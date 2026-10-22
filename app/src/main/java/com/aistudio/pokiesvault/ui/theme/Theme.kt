package com.aistudio.pokiesvault.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = VaultCyan,
    onPrimary = VaultInk,
    primaryContainer = VaultPanel2,
    onPrimaryContainer = VaultFg,
    secondary = VaultViolet,
    onSecondary = VaultFg,
    secondaryContainer = VaultPanel2,
    onSecondaryContainer = VaultFg,
    tertiary = VaultPink,
    onTertiary = VaultFg,
    background = VaultBg,
    onBackground = VaultFg,
    surface = VaultPanel,
    onSurface = VaultFg,
    surfaceVariant = VaultPanel2,
    onSurfaceVariant = VaultMuted,
    outline = VaultBorder
)

@Composable
fun PokiesVaultTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = VaultBg.toArgb()
                window.navigationBarColor = VaultBg.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
