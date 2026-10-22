package com.aistudio.pokiesvault.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aistudio.pokiesvault.ui.theme.*

@Composable
fun AppDrawer(
    savedAccountsCount: Int,
    onMyAccountsClick: () -> Unit,
    onAddDomainClick: () -> Unit,
    onFetcherClick: () -> Unit,
    onClearDeviceClick: () -> Unit,
    onCloseDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showConfirmClear by remember { mutableStateOf(false) }

    ModalDrawerSheet(
        modifier = modifier.width(300.dp),
        drawerContainerColor = VaultPanel,
        drawerContentColor = VaultFg
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Menu",
                        color = VaultFg,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    Text(
                        text = "Your list only. No credits, no rentals.",
                        color = VaultMuted,
                        fontSize = 11.sp
                    )
                }
                IconButton(onClick = onCloseDrawer) {
                    Icon(Icons.Default.Close, contentDescription = "Close menu", tint = VaultMuted)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            DrawerItemRow(
                icon = Icons.Default.Person,
                title = "My accounts",
                subtitle = "$savedAccountsCount site${if (savedAccountsCount == 1) "" else "s"} saved",
                onClick = {
                    onMyAccountsClick()
                    onCloseDrawer()
                },
                modifier = Modifier.testTag("drawer_my_accounts")
            )

            DrawerItemRow(
                icon = Icons.Default.Add,
                title = "Add a domain",
                subtitle = "Save a site into your accounts",
                onClick = {
                    onAddDomainClick()
                    onCloseDrawer()
                },
                modifier = Modifier.testTag("drawer_add_domain")
            )

            DrawerItemRow(
                icon = Icons.Default.Bolt,
                title = "Bonus fetcher",
                subtitle = "Balances, share, referral, rebate",
                onClick = {
                    onFetcherClick()
                    onCloseDrawer()
                },
                modifier = Modifier.testTag("drawer_bonus_fetcher")
            )

            DrawerItemRow(
                icon = Icons.Default.Shield,
                title = "Same login on each site",
                subtitle = "Phone and password, this device only",
                onClick = {},
                clickable = false
            )

            Spacer(modifier = Modifier.weight(1f))

            DrawerItemRow(
                icon = Icons.Default.DeleteOutline,
                title = "Clear this device",
                subtitle = "Removes local vault data",
                titleColor = VaultDead,
                onClick = { showConfirmClear = true },
                modifier = Modifier.testTag("drawer_clear_device")
            )
        }
    }

    if (showConfirmClear) {
        AlertDialog(
            onDismissRequest = { showConfirmClear = false },
            title = { Text("Clear this device?", color = VaultFg) },
            text = { Text("Clear saved sites, visits, and the password stored on this device?", color = VaultMuted) },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmClear = false
                        onClearDeviceClick()
                        onCloseDrawer()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = VaultDead)
                ) {
                    Text("Clear", color = VaultFg, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmClear = false }) {
                    Text("Cancel", color = VaultMuted)
                }
            },
            containerColor = VaultPanel2,
            shape = RoundedCornerShape(14.dp)
        )
    }
}

@Composable
private fun DrawerItemRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    titleColor: androidx.compose.ui.graphics.Color = VaultFg,
    clickable: Boolean = true
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        shape = RoundedCornerShape(12.dp),
        color = VaultPanel2,
        border = androidx.compose.foundation.BorderStroke(1.dp, VaultBorder),
        onClick = if (clickable) onClick else ({})
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (titleColor == VaultDead) VaultDead else VaultCyan,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = title,
                    color = titleColor,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 13.sp
                )
                Text(
                    text = subtitle,
                    color = VaultMuted,
                    fontSize = 11.sp
                )
            }
        }
    }
}
