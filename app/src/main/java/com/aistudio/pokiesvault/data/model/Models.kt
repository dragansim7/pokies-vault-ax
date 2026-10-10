package com.aistudio.pokiesvault.data.model

enum class SiteGroup(val label: String) {
    NEW("New"),
    BEST("Best"),
    UNVERIFIED("Unverified"),
    SHARE("Instant share bonuses"),
    LATEST("Latest"),
    CUSTOM("Added by you")
}

data class CatalogSite(
    val domain: String,
    val group: SiteGroup,
    val addedAt: String = ""
)

enum class SiteStatus(val label: String) {
    CHECKING("Checking"),
    LIVE("Live"),
    SLOW("Slow"),
    REDIRECT("Redirect"),
    DEAD("Down")
}

enum class ViewMode {
    GROUPS, ONE, TWO
}

enum class SortMode(val label: String) {
    DEFAULT("Featured groups"),
    AZ("Domain A–Z"),
    ZA("Domain Z–A"),
    NEW("Newest added"),
    BALANCE("Wallet balance")
}

enum class BonusMode(val label: String) {
    NONE("Nothing extra"),
    NEW("Welcome"),
    SHARE("Share"),
    COMMISSION("Commission"),
    REFERRAL("Referral"),
    REBATE("Rebate")
}

data class FallbackCred(
    val phone: String = "",
    val password: String = ""
)

data class BonusView(
    val name: String,
    val amount: Double,
    val amountDisplay: String,
    val minWithdrawal: Double? = null,
    val maxWithdrawal: Double? = null,
    val rollover: Double? = null,
    val isPercent: Boolean = false
)

data class WalletView(
    val id: String,
    val name: String,
    val balance: Double
)

sealed class AccountResult {
    abstract val domain: String

    data class Ok(
        override val domain: String,
        val hasData: Boolean,
        val cash: Double,
        val cashWalletName: String,
        val cashMinWithdrawal: Double?,
        val cashMaxWithdrawal: Double?,
        val wallets: List<WalletView>,
        val commission: BonusView?,
        val share: BonusView?,
        val referral: BonusView?,
        val newMember: BonusView?,
        val rebate: BonusView?,
        val availableBonuses: List<BonusView>
    ) : AccountResult()

    data class Err(
        override val domain: String,
        val code: String,
        val message: String
    ) : AccountResult()
}

data class LastFetch(
    val timestamp: Long,
    val rows: List<AccountResult>
)
