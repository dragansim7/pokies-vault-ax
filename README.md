# Pokies Vault (Android)

Pokies Vault is an Android application built with Kotlin and Jetpack Compose that tracks, verifies, and audits wallet balances and promotional bonus balances across shared casino portals.

## Features

- **Domain Catalog & Grouping:**
  - Grouped catalog supporting `New`, `Best`, `Unverified`, `Instant share bonuses`, `Added by you` (custom domains), and `Latest`.
  - Live site health and accessibility checks (`Live`, `Slow`, `Redirect`, `Down`).
  - Search filter by casino name and domain.
  - Quick toggles for `Not visited only`, `Wallets on/off`, `View: Groups / One / Two`, and `My accounts only`.
  - Comprehensive sorting: Featured groups, Domain A–Z, Domain Z–A, Newest added, and Wallet balance.
  - Active bonus badges on site cards: Welcome, Share, Commission, Referral, and Rebate.

- **Bonus Fetcher & Multi-Account Sync:**
  - Enter primary phone number and password used across shared login portals.
  - Support for up to 3 fallback login credentials.
  - Single domain check or full background catalog scan.
  - Live multi-worker concurrent syncing of wallet balances and promotional bonuses via the shared API endpoint.
  - Real-time progress bar, status notifications, and diff detector tracking balance changes between runs.
  - Detailed account result cards displaying cash balance, wallet name, withdrawal thresholds (min/max), bonus breakdown matrix, and rollover requirements.
  - Filter and inspect valid accounts, zero-balance accounts, and rejected login responses.

- **Local Vault Storage:**
  - Secure on-device persistence for visited sites, bookmarked accounts, custom domains, and saved credentials.
  - "Clear this device" action to securely wipe local data.

- **Responsible Gambling Compliance:**
  - Prominent 18+ warnings with direct links to Gambling Help Online (1800 858 858) and BetStop.

## Technology Stack

- **Platform:** Android (minSdk 26, targetSdk 35)
- **UI Framework:** Jetpack Compose with Material 3 (M3)
- **Architecture:** MVVM (Model-View-ViewModel) with Kotlin Coroutines & StateFlow
- **Networking:** OkHttpClient for high-throughput concurrency and SSL/TLS validation
- **Build System:** Gradle (Kotlin DSL) with Version Catalog (`libs.versions.toml`)
