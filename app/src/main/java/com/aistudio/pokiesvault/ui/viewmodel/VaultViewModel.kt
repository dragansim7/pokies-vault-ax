package com.aistudio.pokiesvault.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.aistudio.pokiesvault.data.model.*
import com.aistudio.pokiesvault.data.network.CasinoApiService
import com.aistudio.pokiesvault.data.repository.VaultRepository
import com.aistudio.pokiesvault.data.repository.VaultState
import com.aistudio.pokiesvault.util.DomainUtil
import com.aistudio.pokiesvault.util.FormatUtil
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class VaultUiState(
    val vaultState: VaultState = VaultState(),
    val searchQuery: String = "",
    val siteStatuses: Map<String, SiteStatus> = emptyMap(),
    val isFetching: Boolean = false,
    val fetchProgressDone: Int = 0,
    val fetchProgressTotal: Int = 0,
    val fetchStatusMessage: String = "Enter the phone number and password you use on these sites.",
    val currentFetchRows: List<AccountResult> = emptyList(),
    val fetchDiffs: List<String> = emptyList(),
    val isAddDomainOpen: Boolean = false,
    val isSortFilterOpen: Boolean = false,
    val isConfirmScanOpen: Boolean = false,
    val showRejectedSites: Boolean = false
)

class VaultViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = VaultRepository(application)
    private val apiService = CasinoApiService()

    private val _uiState = MutableStateFlow(VaultUiState())
    val uiState: StateFlow<VaultUiState> = _uiState.asStateFlow()

    private var fetchJob: Job? = null
    private val statusCheckJobs = mutableMapOf<String, Job>()

    init {
        viewModelScope.launch {
            repository.state.collect { vState ->
                _uiState.update { current ->
                    current.copy(
                        vaultState = vState,
                        currentFetchRows = if (current.currentFetchRows.isEmpty() && vState.lastFetch != null) {
                            vState.lastFetch.rows
                        } else {
                            current.currentFetchRows
                        }
                    )
                }
            }
        }
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun toggleNotVisited() {
        repository.setNotVisited(!_uiState.value.vaultState.notVisited)
    }

    fun toggleWallets() {
        repository.setWallets(!_uiState.value.vaultState.wallets)
    }

    fun toggleMineOnly() {
        repository.setMineOnly(!_uiState.value.vaultState.mineOnly)
    }

    fun cycleViewMode() {
        val next = when (_uiState.value.vaultState.viewMode) {
            ViewMode.GROUPS -> ViewMode.ONE
            ViewMode.ONE -> ViewMode.TWO
            ViewMode.TWO -> ViewMode.GROUPS
        }
        repository.setViewMode(next)
    }

    fun setSortMode(mode: SortMode) {
        repository.setSortMode(mode)
    }

    fun setBonusMode(mode: BonusMode) {
        repository.setBonusMode(mode)
    }

    fun toggleVisited(domain: String) {
        repository.toggleVisited(domain)
    }

    fun markVisited(domain: String) {
        repository.markVisited(domain)
    }

    fun toggleMine(domain: String) {
        repository.toggleMine(domain)
    }

    fun setAddDomainOpen(open: Boolean) {
        _uiState.update { it.copy(isAddDomainOpen = open) }
    }

    fun setSortFilterOpen(open: Boolean) {
        _uiState.update { it.copy(isSortFilterOpen = open) }
    }

    fun setConfirmScanOpen(open: Boolean) {
        _uiState.update { it.copy(isConfirmScanOpen = open) }
    }

    fun setShowRejectedSites(show: Boolean) {
        _uiState.update { it.copy(showRejectedSites = show) }
    }

    fun addCustomDomain(raw: String): String? {
        val domain = DomainUtil.normalizeDomain(raw)
        if (!DomainUtil.isPublicDomain(domain)) return "Enter a valid domain like 9au.com"
        val error = repository.addCustomDomain(domain)
        if (error == null) {
            setAddDomainOpen(false)
        }
        return error
    }

    fun updateCredentials(phone: String, pass: String) {
        repository.updateCredentials(phone, pass)
    }

    fun updateFallback(index: Int, phone: String, pass: String) {
        repository.updateFallback(index, phone, pass)
    }

    fun clearAll() {
        repository.clearAll()
        _uiState.update {
            it.copy(
                siteStatuses = emptyMap(),
                currentFetchRows = emptyList(),
                fetchDiffs = emptyList()
            )
        }
    }

    fun checkStatusIfNeeded(domain: String) {
        if (_uiState.value.siteStatuses.containsKey(domain) || statusCheckJobs.containsKey(domain)) return

        _uiState.update { it.copy(siteStatuses = it.siteStatuses + (domain to SiteStatus.CHECKING)) }
        val job = viewModelScope.launch {
            val status = apiService.checkSiteStatus(domain)
            _uiState.update { it.copy(siteStatuses = it.siteStatuses + (domain to status)) }
        }
        statusCheckJobs[domain] = job
    }

    fun startFetch(domainsToFetch: List<String>) {
        val vState = _uiState.value.vaultState
        val creds = mutableListOf(vState.phone.trim() to vState.password)
        for (f in vState.fallbacks) {
            if (f.phone.isNotBlank() && f.password.isNotBlank()) {
                creds.add(f.phone.trim() to f.password)
            }
        }
        val validCreds = creds.filter { it.first.isNotBlank() && it.second.isNotBlank() }
        if (validCreds.isEmpty()) {
            _uiState.update { it.copy(fetchStatusMessage = "Enter your phone number and password before fetching.") }
            return
        }

        val uniqueDomains = domainsToFetch.distinct().filter { DomainUtil.isPublicDomain(it) }
        if (uniqueDomains.isEmpty()) {
            _uiState.update { it.copy(fetchStatusMessage = "No sites to check. Save accounts from the list, add a domain, or scan.") }
            return
        }

        fetchJob?.cancel()
        fetchJob = viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isFetching = true,
                    fetchProgressDone = 0,
                    fetchProgressTotal = uniqueDomains.size,
                    fetchStatusMessage = if (uniqueDomains.size == 1) "Checking ${uniqueDomains[0]}…" else "Checking ${uniqueDomains.size} sites…",
                    currentFetchRows = emptyList(),
                    fetchDiffs = emptyList(),
                    showRejectedSites = false
                )
            }

            val previousMap = mutableMapOf<String, AccountResult.Ok>()
            vState.lastFetch?.rows?.filterIsInstance<AccountResult.Ok>()?.forEach {
                previousMap[it.domain] = it
            }

            val collected = mutableListOf<AccountResult>()
            val mutex = java.lang.Object()

            // Run with concurrency of 3 workers
            val queue = java.util.concurrent.ConcurrentLinkedQueue(uniqueDomains)
            val workers = (1..3).map {
                launch {
                    while (isActive) {
                        val domain = queue.poll() ?: break
                        var result: AccountResult = AccountResult.Err(domain, "other", "No credentials")

                        for ((phone, password) in validCreds) {
                            if (!isActive) break
                            val res = apiService.fetchCasinoAccount(domain, phone, password)
                            if (res is AccountResult.Ok) {
                                repository.rememberAccount(domain)
                                result = res
                                break
                            } else if (res is AccountResult.Err) {
                                result = res
                                if (res.code != "invalid_login") break
                            }
                        }

                        synchronized(mutex) {
                            collected.add(result)
                            val done = collected.size
                            val sorted = collected.sortedBy { it.domain }
                            _uiState.update {
                                it.copy(
                                    fetchProgressDone = done,
                                    currentFetchRows = sorted
                                )
                            }
                        }
                    }
                }
            }
            workers.joinAll()

            val finalRows = collected.sortedBy { it.domain }
            repository.saveFetch(finalRows)

            // Diffs
            val diffNotes = mutableListOf<String>()
            for (r in finalRows) {
                if (r is AccountResult.Ok) {
                    val prev = previousMap[r.domain]
                    if (prev != null && Math.abs(prev.cash - r.cash) >= 0.01) {
                        diffNotes.add("${r.domain} balance ${FormatUtil.money(prev.cash)} → ${FormatUtil.money(r.cash)}")
                    }
                }
            }

            val okCount = finalRows.count { it is AccountResult.Ok }
            _uiState.update {
                it.copy(
                    isFetching = false,
                    fetchDiffs = diffNotes,
                    fetchStatusMessage = "Done. $okCount of ${finalRows.size} signed in. Successful accounts are saved in your vault."
                )
            }
        }
    }

    fun stopFetch() {
        fetchJob?.cancel()
        _uiState.update {
            it.copy(
                isFetching = false,
                fetchStatusMessage = "Stopped. Successful sign-ins stay in My accounts."
            )
        }
    }

    fun viewLastFetch() {
        val last = _uiState.value.vaultState.lastFetch
        if (last != null) {
            _uiState.update {
                it.copy(
                    currentFetchRows = last.rows,
                    fetchStatusMessage = "Showing the last fetch saved on this device."
                )
            }
        }
    }

    fun getFilteredCatalogSites(): List<CatalogSite> {
        val state = _uiState.value
        val allSites = repository.getAllSites()
        val q = state.searchQuery.trim().lowercase()
        val vState = state.vaultState

        val fetchMap = state.currentFetchRows.associateBy { it.domain }

        var list = allSites.filter { site ->
            if (vState.mineOnly && !vState.mine.contains(site.domain)) return@filter false
            if (vState.notVisited && vState.visited.contains(site.domain)) return@filter false
            if (q.isNotEmpty() && !site.domain.contains(q)) return@filter false
            true
        }

        list = when (vState.sortMode) {
            SortMode.AZ -> list.sortedBy { it.domain }
            SortMode.ZA -> list.sortedByDescending { it.domain }
            SortMode.NEW -> list.sortedByDescending { it.addedAt }
            SortMode.BALANCE -> list.sortedWith(
                compareByDescending<CatalogSite> { (fetchMap[it.domain] as? AccountResult.Ok)?.cash ?: -1.0 }
                    .thenBy { it.domain }
            )
            SortMode.DEFAULT -> list
        }

        return list
    }
}
