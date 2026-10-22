package com.aistudio.pokiesvault.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aistudio.pokiesvault.data.model.*
import com.aistudio.pokiesvault.ui.theme.*
import com.aistudio.pokiesvault.util.FormatUtil

@Composable
fun SiteAvatar(domain: String, modifier: Modifier = Modifier) {
    val tones = listOf(VaultCyan, VaultViolet, VaultPink, VaultLive)
    val color = tones[domain.firstOrNull()?.code?.mod(tones.size) ?: 0]
    Box(
        modifier = modifier
            .size(36.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(color.copy(alpha = 0.2f)),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = FormatUtil.initials(domain),
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = 13.sp
        )
    }
}

@Composable
fun SiteCard(
    site: CatalogSite,
    status: SiteStatus,
    isBookmarked: Boolean,
    isVisited: Boolean,
    walletText: String?,
    bonusText: String?,
    onCardClick: () -> Unit,
    onBookmarkToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val statusColor = when (status) {
        SiteStatus.LIVE -> VaultLive
        SiteStatus.SLOW -> VaultSlow
        SiteStatus.REDIRECT -> VaultViolet
        SiteStatus.DEAD -> VaultDead
        SiteStatus.CHECKING -> VaultMuted
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable {
                onCardClick()
                try {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://${site.domain}/"))
                    context.startActivity(intent)
                } catch (_: Exception) {}
            }
            .testTag("site_card_${site.domain}"),
        shape = RoundedCornerShape(14.dp),
        color = VaultPanel,
        border = BorderStroke(1.dp, VaultBorder)
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            SiteAvatar(domain = site.domain)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = site.domain,
                    color = VaultFg,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(statusColor)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = status.label + if (site.addedAt.isNotBlank()) " · ${FormatUtil.formatAdded(site.addedAt)}" else "",
                        color = VaultMuted,
                        fontSize = 11.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                if (!walletText.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = walletText,
                        color = VaultCyan,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
                if (!bonusText.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = bonusText,
                        color = VaultPink,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            IconButton(
                onClick = onBookmarkToggle,
                modifier = Modifier
                    .size(40.dp)
                    .testTag("bookmark_button_${site.domain}")
            ) {
                Icon(
                    imageVector = if (isBookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                    contentDescription = if (isBookmarked) "Remove bookmark" else "Save account",
                    tint = if (isBookmarked) VaultCyan else VaultMuted
                )
            }
        }
    }
}

@Composable
fun ResultCard(
    row: AccountResult.Ok,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var expandedBonuses by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(14.dp),
        color = VaultPanel,
        border = BorderStroke(1.dp, VaultBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = row.domain,
                    color = VaultFg,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                TextButton(
                    onClick = {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://${row.domain}/"))
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    }
                ) {
                    Text("Open", color = VaultCyan, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = FormatUtil.money(row.cash),
                    color = VaultLive,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 20.sp
                )
                Spacer(modifier = Modifier.width(8.dp))
                val limits = buildString {
                    append(row.cashWalletName)
                    if (row.cashMinWithdrawal != null) append(" · Min ${FormatUtil.money(row.cashMinWithdrawal)}")
                    if (row.cashMaxWithdrawal != null) append(" · Max ${FormatUtil.money(row.cashMaxWithdrawal)}")
                    else append(" · No max shown")
                }
                Text(
                    text = limits,
                    color = VaultMuted,
                    fontSize = 11.sp,
                    modifier = Modifier.padding(bottom = 2.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            // Bonus Grid
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                BonusGridItem(label = "Commission", bonus = row.commission, modifier = Modifier.weight(1f))
                BonusGridItem(label = "Share", bonus = row.share, modifier = Modifier.weight(1f))
                BonusGridItem(label = "Referral", bonus = row.referral, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                BonusGridItem(label = "Welcome", bonus = row.newMember, modifier = Modifier.weight(1f))
                BonusGridItem(label = "Rebate", bonus = row.rebate, modifier = Modifier.weight(1f))
                Box(modifier = Modifier.weight(1f))
            }

            if (row.availableBonuses.isNotEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { expandedBonuses = !expandedBonuses },
                    shape = RoundedCornerShape(8.dp),
                    color = VaultPanel2
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "All bonuses on this account (${row.availableBonuses.size})",
                                color = VaultFg,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Icon(
                                imageVector = if (expandedBonuses) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                                contentDescription = null,
                                tint = VaultMuted
                            )
                        }
                        AnimatedVisibility(visible = expandedBonuses) {
                            Column(modifier = Modifier.padding(top = 6.dp)) {
                                row.availableBonuses.forEach { bonus ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 3.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = bonus.name + if (bonus.rollover != null) " · ${bonus.rollover.toInt()}×" else "",
                                            color = VaultMuted,
                                            fontSize = 11.sp
                                        )
                                        Text(
                                            text = bonus.amountDisplay,
                                            color = VaultCyan,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BonusGridItem(label: String, bonus: BonusView?, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        color = VaultPanel2
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 6.dp)
        ) {
            Text(
                text = label,
                color = VaultFaint,
                fontSize = 10.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(2.dp))
            if (bonus != null) {
                Text(
                    text = "Yes (${bonus.amountDisplay})",
                    color = VaultLive,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            } else {
                Text(
                    text = "No",
                    color = VaultMuted,
                    fontSize = 11.sp
                )
            }
        }
    }
}

@Composable
fun StatsBar(
    siteCount: Int,
    visitedCount: Int,
    myCount: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceAround
    ) {
        Text(
            text = "Sites $siteCount",
            color = VaultMuted,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
        Text(
            text = "Visited $visitedCount",
            color = VaultMuted,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
        Text(
            text = "My accounts $myCount",
            color = VaultCyan,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun HowAccountsWorkBanner(modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = VaultPanel,
        border = BorderStroke(1.dp, VaultBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(
                text = "How your accounts work",
                color = VaultFg,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Bookmark a site, then open the fetcher and sign in with the phone number and password you already use. Only sites that accept that login are kept. Nothing here is paid — no fetch packs and no rented cards.",
                color = VaultMuted,
                fontSize = 12.sp,
                lineHeight = 16.sp
            )
        }
    }
}

@Composable
fun StorySection(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp)
    ) {
        Text(
            text = "One place for the sites you actually use",
            color = VaultFg,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        val items = listOf(
            "The list" to "New, best, unverified, share, and the long tail stay grouped. Search, hide sites you have already opened, and bookmark only the ones that are yours.",
            "The fetch" to "The same phone and password is tried on the wallet login these sites share. A hit keeps the site. A rejection does not.",
            "What you see" to "Cash, commission, share, referral, welcome, and rebate — plus the rest of the bonuses sitting on the account. Unlimited checks. No credits to buy."
        )

        items.forEach { (title, desc) ->
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                shape = RoundedCornerShape(12.dp),
                color = VaultPanel,
                border = BorderStroke(1.dp, VaultBorder)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(title, color = VaultCyan, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(desc, color = VaultMuted, fontSize = 12.sp, lineHeight = 16.sp)
                }
            }
        }
    }
}

@Composable
fun ResponsibleGamblingFooter(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = VaultBg
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = VaultDead.copy(alpha = 0.2f),
                    border = BorderStroke(1.dp, VaultDead)
                ) {
                    Text(
                        "18+",
                        color = VaultDead,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    "Gamble responsibly.",
                    color = VaultFg,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Need help? Gambling Help Online — 1800 858 858 · BetStop",
                color = VaultCyan,
                fontSize = 11.sp,
                modifier = Modifier.clickable {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.gamblinghelponline.org.au/"))
                        context.startActivity(intent)
                    } catch (_: Exception) {}
                }
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                "Pokies Vault checks sites you already use. It does not take bets, sell fetches, or rent listings. Passwords stay on this device.",
                color = VaultFaint,
                fontSize = 10.sp,
                lineHeight = 14.sp
            )
        }
    }
}

@Composable
fun AddDomainDialog(
    onDismiss: () -> Unit,
    onAdd: (String) -> String?
) {
    var domainInput by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add a domain", color = VaultFg, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                Text(
                    "It is saved as one of your accounts and can be fetched with the same phone and password.",
                    color = VaultMuted,
                    fontSize = 13.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = domainInput,
                    onValueChange = {
                        domainInput = it
                        errorMessage = null
                    },
                    placeholder = { Text("e.g. 9au.com", color = VaultFaint) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = VaultFg,
                        unfocusedTextColor = VaultFg,
                        focusedBorderColor = VaultCyan,
                        unfocusedBorderColor = VaultBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("domain_input")
                )
                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(errorMessage!!, color = VaultDead, fontSize = 12.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val err = onAdd(domainInput)
                    if (err != null) errorMessage = err
                },
                colors = ButtonDefaults.buttonColors(containerColor = VaultCyan),
                modifier = Modifier.testTag("save_domain_button")
            ) {
                Text("Save site", color = VaultInk, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = VaultMuted)
            }
        },
        containerColor = VaultPanel,
        shape = RoundedCornerShape(16.dp)
    )
}

@Composable
fun SortFilterDialog(
    currentSort: SortMode,
    currentBonus: BonusMode,
    mineOnly: Boolean,
    onSortSelected: (SortMode) -> Unit,
    onBonusSelected: (BonusMode) -> Unit,
    onMineOnlyToggled: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Sort and filter", color = VaultFg, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                Text("Sort order", color = VaultCyan, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                SortMode.values().forEach { mode ->
                    val selected = currentSort == mode
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSortSelected(mode) }
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selected,
                            onClick = { onSortSelected(mode) },
                            colors = RadioButtonDefaults.colors(selectedColor = VaultCyan)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(mode.label, color = if (selected) VaultCyan else VaultFg, fontSize = 13.sp)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Text("Show on cards", color = VaultCyan, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                BonusMode.values().forEach { mode ->
                    val selected = currentBonus == mode
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onBonusSelected(mode) }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selected,
                            onClick = { onBonusSelected(mode) },
                            colors = RadioButtonDefaults.colors(selectedColor = VaultCyan)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(mode.label, color = if (selected) VaultCyan else VaultFg, fontSize = 13.sp)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onMineOnlyToggled() }
                        .padding(vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = mineOnly,
                        onCheckedChange = { onMineOnlyToggled() },
                        colors = CheckboxDefaults.colors(checkedColor = VaultCyan)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("My accounts only", color = VaultFg, fontSize = 13.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = VaultCyan)
            ) {
                Text("Done", color = VaultInk, fontWeight = FontWeight.Bold)
            }
        },
        containerColor = VaultPanel,
        shape = RoundedCornerShape(16.dp)
    )
}

@Composable
fun ConfirmScanDialog(
    totalCount: Int,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Scan every listed site?", color = VaultFg, fontWeight = FontWeight.Bold) },
        text = {
            Text(
                "This tries your password on $totalCount domains and keeps only the ones that sign in. It can take several minutes. You can stop it at any time.",
                color = VaultMuted,
                fontSize = 13.sp
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    onConfirm()
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = VaultCyan),
                modifier = Modifier.testTag("confirm_scan_button")
            ) {
                Text("Scan my login", color = VaultInk, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = VaultMuted)
            }
        },
        containerColor = VaultPanel,
        shape = RoundedCornerShape(16.dp)
    )
}
