export type SiteGroup = "new" | "best" | "unverified" | "share" | "latest" | "custom"

export type CatalogSite = {
  domain: string
  group: Exclude<SiteGroup, "custom">
  addedAt: string
}

export const CATALOG: CatalogSite[] = [
  {
    "domain": "100pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "111aud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "11win.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "123bet.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "19rich.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "1playaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "1pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "1spinnwin.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "1u2win.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "1uwin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "1winau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "1winbet369.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "1xaceau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "1xaud.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "22agwin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "22aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "22ddwin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "22dota.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:35.893983+00:00"
  },
  {
    "domain": "22lol.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "22pokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "22rickycasino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "2uswin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "365aud.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "420pokies.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:36.881898+00:00"
  },
  {
    "domain": "420pokies.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "44spin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "5gau.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "5starclub.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "66spin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "76pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "77pokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "7pokies.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "7staraus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "7vip7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "888pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "93pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "96aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "96pro.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "96spinau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "99casinoaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "99luckaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "9au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "a1club88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "a1pokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "a2w.casino",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "a77au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "a99au.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "a9aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "a9win.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aa29.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aa7au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ac8bet.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ac8et.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ace268.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ace34.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ace4win.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ace4win.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:39.764307+00:00"
  },
  {
    "domain": "ace9win.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aceaud.xyz",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:40.245387+00:00"
  },
  {
    "domain": "acehighwin.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "acepokies777.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:40.311972+00:00"
  },
  {
    "domain": "acewin9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aco96.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "acwin77.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "add88.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "advantplay885.xyz",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "advantplayfun.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "af7aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "afb365.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "afb77au.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "afl88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "afpau.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aggau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ak44au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ak8au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ak8aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aldispin88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aliensspining.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "all117.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "amg86.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "amplayfun.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "anex9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "anz2u.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "anz33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "anzplay.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "apexspin.world",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "app996.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "apple33.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aristocratau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ariswin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "atomic96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "au-king.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "au55.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "au88.io",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "au99.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aub.jjbspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aubet88.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auboss.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auboss1.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aucloud9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auclub77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud22.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud24.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud2u.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aud2u.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:43.886829+00:00"
  },
  {
    "domain": "aud33.live",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aud365.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud77.casa",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:44.421497+00:00"
  },
  {
    "domain": "aud77.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aud96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aud99.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audbet365.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audgaming1.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audgaming8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audgo.store",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audgo.website",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:45.284688+00:00"
  },
  {
    "domain": "audking.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audking98.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audmono.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audplay.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audplay168.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audply.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audpokies88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audpokies888.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audqueen.co",
    "group": "share",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "audrive.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "audwin9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auium.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auking99.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auplay99.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aupokies777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auraplay1.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aurith68.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aurorabets.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:46.452761+00:00"
  },
  {
    "domain": "aurorabets.world",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auryshub77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aus13.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aus29.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aus2u.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aus55.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:47.618320+00:00"
  },
  {
    "domain": "aus66.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aus88.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aus88win.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aus9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ausands33.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ausbet33.net",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ausbet88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ausbet96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ausgogo.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ausinluck.store",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ausix365.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auslot9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auslot96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auspin168.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auspin88.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:49.066953+00:00"
  },
  {
    "domain": "auspin996.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auspokies99.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussie2win.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussie55.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussie96.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:49.721026+00:00"
  },
  {
    "domain": "aussie96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aussieaces.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aussieloot.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussiepokies33.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:50.161285+00:00"
  },
  {
    "domain": "aussiepokies33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussiepokies33.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussieqq.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussieripper.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:50.742094+00:00"
  },
  {
    "domain": "aussiespin9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aussiewin.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ausspeed.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "austar.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "austar.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auwin.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auwin88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "auwinaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "auwins88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "avengers80.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "aviator96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "aviator98.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "azurefortunepalace.co",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bb8au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bbspin.io",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bbspinaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bcgame96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "be9au.me",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "besoft8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "best77.asia",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bestau.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bestau77.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:54.208374+00:00"
  },
  {
    "domain": "bestpokieslist.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bet365aud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bet365game.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betclub11.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betflip.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betgm11.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betjack21.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betjohn.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "betmanau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betsdoggy.tech",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:55.474774+00:00"
  },
  {
    "domain": "betsixty.cc",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betus10.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "betwey365.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "betworld168.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "betworld168.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:56.081167+00:00"
  },
  {
    "domain": "betzilla88.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bigbonus.me",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bigboss88.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bigpay77.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bigw.bet",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bigw7.asia",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bigwin666.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "billionaire2024.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "billionaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bitchie99.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bizzo88.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bizzo88au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:57.245700+00:00"
  },
  {
    "domain": "bk8auspokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bk8global.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:57.380769+00:00"
  },
  {
    "domain": "bk99a.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bkk88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bluespin88.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bluntspin.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bluzz777.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bluzz777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bn8aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bng1au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bngwin7.live",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bondibeachbet.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bonsai369a.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bonus96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bonza7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bonza96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bonzaau.com",
    "group": "new",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bonzaau.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:00:59.638540+00:00"
  },
  {
    "domain": "boomerangaus.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "boomerstake.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:00.429493+00:00"
  },
  {
    "domain": "booongo33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "boyabet9.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "br8au.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:00.206396+00:00"
  },
  {
    "domain": "br8au.win",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "br8aud.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "br8aus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "breeza8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bs22au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bsb007.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bsb88au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bullpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bunny96.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "bx77au.asia",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bxb88au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "bybid9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "call96.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "candy29.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "candy96.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "candymommy.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cashaud.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cashkingau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cashkingau.shop",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cashnet99.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cashnet992.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:03.071796+00:00"
  },
  {
    "domain": "cashnetfun.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cashpokie.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:03.068598+00:00"
  },
  {
    "domain": "cashsinoau.com",
    "group": "share",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cbet68.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cbr8aus.casino",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "champion9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "chanel9.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "check-in77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "check-in777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "checkmate7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cheekyspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "choose96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "chuckmeth9.net",
    "group": "unverified",
    "addedAt": "2026-09-12T02:50:26+10:00"
  },
  {
    "domain": "class777.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "clubimperioaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cobber96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cocspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "coinmaster44.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cola13.me",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "colormate.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "coopers365.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "corona9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cosmojack.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cpau365.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cr33au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crikey7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crikeywin.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:07.228923+00:00"
  },
  {
    "domain": "crikeywins.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "crn7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crown76au.online",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:07.494533+00:00"
  },
  {
    "domain": "crown9au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crownau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crownbet.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "crownbetking.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crowncasinosau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "crownspin996.asia",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "crystalbet777.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "crystalchips777.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ctbet.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cuntcity.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:09.298491+00:00"
  },
  {
    "domain": "cuntcunt.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:09.520727+00:00"
  },
  {
    "domain": "cunthaus.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cuntspider.xyz",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cuntspin.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cuntwin77.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "cyberbet77.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "cyberpunk369.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dangspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dd8au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ddpokies.com",
    "group": "latest",
    "addedAt": "2026-09-02T18:00:01+10:00"
  },
  {
    "domain": "ddw99.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dealau1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "decho34.vip",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "devegas99.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dfl88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dg6au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:12.992688+00:00"
  },
  {
    "domain": "diamondaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dick96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dingospin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dinkum33.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dinkydibets.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dinkydidolla.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dior13.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:12.409128+00:00"
  },
  {
    "domain": "dmd188.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dns33.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dogeau1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dollar33au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dolphin88.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "dpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "drongocunt.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dsyaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "duckyluckaus.online",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:14.033636+00:00"
  },
  {
    "domain": "durameth.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dv77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dvegas77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "dw88.io",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "e99au.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "e99aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ea99.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "eb7au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ebet7.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ebet9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ecl9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "eclbetau.io",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "eebet9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "efa777.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "efa99aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "elitewin7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "emax7.top",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:15.703321+00:00"
  },
  {
    "domain": "exc55.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ez99au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ezbet66.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ezspin68.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ezwin9.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:30.928306+00:00"
  },
  {
    "domain": "fafawinau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fafawinaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fairdinkumbets.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fairdinkumbets.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:31.294083+00:00"
  },
  {
    "domain": "fairdinkumplay9.asia",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fairgo77.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fairgobets.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:31.098929+00:00"
  },
  {
    "domain": "fairgobets.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:31.199400+00:00"
  },
  {
    "domain": "fairspin.asia",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fantasy33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastaud.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastpay9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastslotsau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastspin11.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastspin99.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fastspinau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fatchoy66.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fc8au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fendiwin9.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ff29.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fifaspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fight22.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fight996au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fightspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "first96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fortune88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "fortunex99.co",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "freakcunt21.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "freeaud.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "freebieaud.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "frenzy96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fuckspin88.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fuckwin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "fuckwit9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "funbet365a.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "funcity93.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "funplay.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:34.294851+00:00"
  },
  {
    "domain": "funplayaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "funpokies.win",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "g6au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:34.956795+00:00"
  },
  {
    "domain": "galaxyau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "galaxys77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "galaxys77aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gamdom77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "game4u.games",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "garagespin.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "garcat8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gcity56.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gd8au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:35.904158+00:00"
  },
  {
    "domain": "gd8au.vip",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gday123.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:35.680009+00:00"
  },
  {
    "domain": "gday365.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gday77au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gday9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gday96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gey99pokies.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:36.385881+00:00"
  },
  {
    "domain": "gg29.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gg66au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gg66au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ggbitch.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "global.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:37.062107+00:00"
  },
  {
    "domain": "glorya77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gluck77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "go33au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "goalspin.vip",
    "group": "unverified",
    "addedAt": "2026-09-20T03:27:13+10:00"
  },
  {
    "domain": "gofun33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gofun333.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:37.216903+00:00"
  },
  {
    "domain": "gogoaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gogopokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gold77au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "goldau.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "goldbet9.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "golden88.world",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "golden88a.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "goldenempire8.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "goldkick88.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "goldpalaceau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "goodmeth.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "goodpokies.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gopokies9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gorichescasino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gowin18.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "grandau777.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gt33.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gtbet9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gtbet9au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "gtr33au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gtr99.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gtx33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gucci9-aud-com.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:40.132124+00:00"
  },
  {
    "domain": "gwin77.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gwin9au.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "gxr7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "h4winau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "h4winaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "happy23.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "harbour33.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:39.837589+00:00"
  },
  {
    "domain": "harbour33happy.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "hb88au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "hb88aus.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "hello88au.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "hey96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "heycunt.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:39.905769+00:00"
  },
  {
    "domain": "heycunt.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "heysluts99.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "highrollaoz.org",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "hollywoodaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "holspin.com",
    "group": "latest",
    "addedAt": "2026-09-02T07:12:10+10:00"
  },
  {
    "domain": "hotmate88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "hydra888aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "hype777.io",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "i8au.bet",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ibet123au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "icefrog777.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ienjoy88au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ig9aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ig9aus.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:42.539643+00:00"
  },
  {
    "domain": "ihappy88au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:42.551939+00:00"
  },
  {
    "domain": "ilovecunt.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ilovejili99.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ilovemeth.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "imperium777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "inskingdom8.com",
    "group": "share",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "intensity2aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "intensity2aus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "invegas365.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ioi6.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:43.846956+00:00"
  },
  {
    "domain": "ioi6.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ione8au.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:45.119089+00:00"
  },
  {
    "domain": "ione8aus.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ipay7.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ipay777.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "iplay77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "iplay77.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:44.265749+00:00"
  },
  {
    "domain": "ipokies88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ipokies9.cc",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ironman98.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "isdpokies.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:44.962013+00:00"
  },
  {
    "domain": "ispeedau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ispin77.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:44.347438+00:00"
  },
  {
    "domain": "iw99au.com",
    "group": "new",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "j8au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "jackdom1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jackpotau.net",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "jackpoty9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jaws68.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "jeespin.com",
    "group": "latest",
    "addedAt": "2026-09-02T20:57:16+10:00"
  },
  {
    "domain": "jerkspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jetpot.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jibet1.xyz",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jibet88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jiliau.club",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:46.107895+00:00"
  },
  {
    "domain": "jililuck.fit",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jjpokies.com",
    "group": "latest",
    "addedAt": "2026-09-02T07:19:17+10:00"
  },
  {
    "domain": "jkpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "joker13.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "joker33.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jokeroz.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "jombet77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "joypokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jptau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "justbetau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "justcasino.casino",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jw8au.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jw8bet.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "jwins9aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "k18win.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kangaau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kangaroo88.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kangaspinau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kazzo88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kennycasino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "keno99.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kerowin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kfcspin.org",
    "group": "latest",
    "addedAt": "2026-09-02T17:41:02+10:00"
  },
  {
    "domain": "kimberley333.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kimberley333.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "king88pokies.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:49.076431+00:00"
  },
  {
    "domain": "kingaud.cc",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kingbbet9.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kingdom9aus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kingpower365.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kingsman369.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kingspin12.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kingtech88.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "kingzo88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kkpokies.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "koaspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kraken-bet.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "kurowin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "labubu88au.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:51.267254+00:00"
  },
  {
    "domain": "le88win.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "leespin.com",
    "group": "latest",
    "addedAt": "2026-09-03T12:58:49+10:00"
  },
  {
    "domain": "legend13.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lego66.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lemonade369.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "leprechaunspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "letsgoaud.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "letspokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lfl88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lickcunt27.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lion88.fun",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lisboa7aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "live77bet.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lootaus.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:52.944204+00:00"
  },
  {
    "domain": "lot9ine.store",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lsdpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luck777.store",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luck77au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckmate88.fit",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lucky21au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lucky22.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lucky72au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lucky76au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lucky76aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lucky7au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckyaceau.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckyaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckybet93.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckybox77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "luckymate88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "luckypink.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:53.911046+00:00"
  },
  {
    "domain": "luckypokies777au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luckywave888.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luk77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luna8.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lunawin.xyz",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "lux96.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "luxe66.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "luxeau777.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "luxez7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "luxpokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lvpay77.vip",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "lycanslots.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "m.md88aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "m6au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "m88win.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "m99aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "m9aus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "macluck9aus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "macsp1n.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "madcunt.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "madhorseau.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "madspinau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "madting7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "magicspin77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "majesty77aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mario96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mario99.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mars66.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mates88.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:58.200088+00:00"
  },
  {
    "domain": "mates88.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "maxim88au.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "maxpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "maxspin7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "maxwinaus.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mbs77au.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "me96.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:01:59.749966+00:00"
  },
  {
    "domain": "mee88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mee88aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "meespin.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mega98au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "megabet26.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "megax77au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mel77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "melaud.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:00.909714+00:00"
  },
  {
    "domain": "melowin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "meth76.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "meth789.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "methday.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "methking.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "methpokie.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "methspin.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mgm7au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "micky9.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "midasvault.casino",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "midasvaultcasino.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:02.647177+00:00"
  },
  {
    "domain": "mimiwin.xyz",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "minecraftau.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:02.993323+00:00"
  },
  {
    "domain": "minorspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mix9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mkaus.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mm96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mmd9.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mnp88.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mofo28.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mofoclub.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mooncunt.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mr9vip.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:03.998257+00:00"
  },
  {
    "domain": "mrau7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mraud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mraud88.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrbean9office.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:04.359078+00:00"
  },
  {
    "domain": "mrbeng68.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrbet9au.info",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrblueyau.com",
    "group": "new",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrboom9.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:04.298177+00:00"
  },
  {
    "domain": "mrgreen8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrlucky9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrpay9.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:04.929172+00:00"
  },
  {
    "domain": "mrpoint.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrpokies77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrpokies9.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrvictor9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrwhite96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrwin5.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrwin68.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "mrwin888.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mrwin9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ms9au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "msn33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "mspokies.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "n1aud.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:06.099653+00:00"
  },
  {
    "domain": "n1bet.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "n1win.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nab88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nbapay.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "neiro55.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "neolux.life",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "neolux.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:06.819365+00:00"
  },
  {
    "domain": "neospin66.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:07.882984+00:00"
  },
  {
    "domain": "neospin66aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nexusaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nicepokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ninjabet88.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nova55au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nova88.global",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "novabet13.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "nsw96.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "nz22.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "nz88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "oakfold.net",
    "group": "new",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "obsidian7aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ocean96.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:10.169024+00:00"
  },
  {
    "domain": "okayspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "okvip7.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "omg96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "on88aud.online",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:10.035303+00:00"
  },
  {
    "domain": "on9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "on9pokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "one2betaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "onegoal1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "onesearthau.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:10.698555+00:00"
  },
  {
    "domain": "onewin888.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "onewin9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "online9.io",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:11.745154+00:00"
  },
  {
    "domain": "online9aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "only1au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "onya88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "onyxaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "onyxaud1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "opal96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "oz2win.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "oz777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "oz996.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ozedge9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozlotto88.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ozmeth.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozmeth.xyz",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:12.531191+00:00"
  },
  {
    "domain": "ozplay77.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozplay88.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozpokies365.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozreel88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ozspin.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozwin777au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ozwin96.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:12.868006+00:00"
  },
  {
    "domain": "ozy777.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:13.228123+00:00"
  },
  {
    "domain": "panda95au.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:13.496720+00:00"
  },
  {
    "domain": "pashmeth.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pashslot.com",
    "group": "latest",
    "addedAt": "2026-09-02T17:56:00+10:00"
  },
  {
    "domain": "payid123.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "peakau.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "peakbet.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "penguin88.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pesi13.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "petercasino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pg9aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "play369.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "play77au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "play88a.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "playaud.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "playaud1.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "playdash.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "playfortuneau.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "playroo9.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:15.763605+00:00"
  },
  {
    "domain": "playselect777.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokebet77.online",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:15.994787+00:00"
  },
  {
    "domain": "poker9.fun",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokie-stars.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokie365.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokies21.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokies33au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokies33aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokies4bet.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokies88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokies88aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokies9au.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokies9aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiesbillion.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiesclub.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:16.949492+00:00"
  },
  {
    "domain": "pokiesday.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesflame.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesgod.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiesking1aus.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:17.603365+00:00"
  },
  {
    "domain": "pokieskingau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokieskingdom.net",
    "group": "latest",
    "addedAt": "2026-09-01T09:11:49+10:00"
  },
  {
    "domain": "pokieslab9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesluck.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesluxe.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesmummy.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesokay.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesproo.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiesspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiesstation.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiesvv.com",
    "group": "latest",
    "addedAt": "2026-09-02T07:15:15+10:00"
  },
  {
    "domain": "pokiesx1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pokiexau.bet",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pokiezeus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pop96.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:19.970006+00:00"
  },
  {
    "domain": "popeye88.fit",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "popeye88.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "powerau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "powerball996.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pp33au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "pp77au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "pp99au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "predator9.vip",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "premium1au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "primeplayau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "psychospin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "punk11.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "punter98.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:20.960392+00:00"
  },
  {
    "domain": "qbet21au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "qbet21aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "queen13au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "queenau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "race96.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:20.786070+00:00"
  },
  {
    "domain": "race96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ragecoke.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ragespin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ranger88au.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "raptor77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "raptor7777.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rcrown88.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:21.865399+00:00"
  },
  {
    "domain": "rcrown88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "real9au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "realpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "redspin.site",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:22.448272+00:00"
  },
  {
    "domain": "redspin7.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "redspin8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "redspin88.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:22.765087+00:00"
  },
  {
    "domain": "redspin88.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "redspinfun.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "reefpokies.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "reelixmate.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "reels11.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "regal96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "regalau777.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "regalspin777.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "retro33.io",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rex7au.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:23.531279+00:00"
  },
  {
    "domain": "rggaming.me",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "richau.me",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "richbabaau.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:23.636664+00:00"
  },
  {
    "domain": "richbabaaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "richbet13.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "richboy.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "riches88.live",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "richmama885.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "richmamaplay.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:23.990132+00:00"
  },
  {
    "domain": "richman96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "richpapa8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "richpokies.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "richspinau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ridgydidgeau.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ridgydidgebets.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ring88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "rippaspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ripperbets.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rippermeth.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "robloxau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "roboslotau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "robot66au.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:24.841938+00:00"
  },
  {
    "domain": "robot66aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "rock9.com",
    "group": "best",
    "addedAt": "2026-09-04T18:55:03+10:00"
  },
  {
    "domain": "rolex66.co",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:25.148545+00:00"
  },
  {
    "domain": "rolladollaaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "roo96.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "roocrown.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:25.446169+00:00"
  },
  {
    "domain": "roopokies.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rooroomate.org",
    "group": "best",
    "addedAt": "2026-09-01T09:11:49+10:00"
  },
  {
    "domain": "roosino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "roospeedau.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:26.001381+00:00"
  },
  {
    "domain": "royal8aus.co",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "royalaceau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "royalaud.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:26.077483+00:00"
  },
  {
    "domain": "royale88.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "royale9au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "royalpokies7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "royalvip7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "royalwin96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "royce96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "rpp88au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:27.144933+00:00"
  },
  {
    "domain": "rr33r.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rr4winaus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rtpcnt.com",
    "group": "share",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rtpmeth.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "rtppokies1.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rtpvictory88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "rubyaud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "rugby77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "s2meth.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "s99au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sacino7.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "safeau.net",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "saferoox.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "salamanca96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sapphireaud.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:28.441682+00:00"
  },
  {
    "domain": "sbingo9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sboomerang.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sbuddy9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "scc5.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "scoobywin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "scr28.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:28.040408+00:00"
  },
  {
    "domain": "sexyaus.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sexyspinau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sgdclub88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sgdclub888.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "shardbet.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sheriffspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sickcunt.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "silver9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "silverfox1.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "silverfoxau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sixty9.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "skycity88.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "skycity88au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:30.415380+00:00"
  },
  {
    "domain": "skycrown33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "skycrown777.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "skygate9au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "skygold98.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "skyrooau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "skyrooaus.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "slotaud.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "slotify7.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "slotland8au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "slotunabets.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "slutcunt.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sm8aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "solidluck33.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "southern9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sp77aud.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "space77.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "space9au.land",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:31.168279+00:00"
  },
  {
    "domain": "space9aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spacecraft9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spaceman369.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spacex98.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:32.277713+00:00"
  },
  {
    "domain": "spadeau.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spectre007au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speed365b.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "speed9.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedau.info",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedau.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedaud.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:32.686287+00:00"
  },
  {
    "domain": "speedaudd.store",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedauspeedau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedaussie.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedbliss.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedo168.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedo168.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "speedwin88.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "speedwin96.com",
    "group": "share",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spice77.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spicepokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spin1313.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spin4rich.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spin96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinarooaus.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinaud.live",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spincunt.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spingoau.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinix.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinkash.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinking.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinmeth88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinova.lol",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinpokies29.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinroo9.com",
    "group": "new",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinsaga.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "spinsage33.site",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:35.778820+00:00"
  },
  {
    "domain": "spinsx.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinup77.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinup99.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spinzone11.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "splinkos.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "spongebob13.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:36.926474+00:00"
  },
  {
    "domain": "springmateau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "squeenaud.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sr7aus.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "ss33s.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:37.615309+00:00"
  },
  {
    "domain": "stake88au.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "stakeau.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "starspin.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "starspin996.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "steadyau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "steadyaud.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "stellariscasinoaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "strayalux.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:39.180674+00:00"
  },
  {
    "domain": "sugar96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sugartown7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sundaysunday.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sunshineslot.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "supergamingau.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:40.202824+00:00"
  },
  {
    "domain": "supermateau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "supreme777.biz",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sure66.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "sure6x.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "surerich.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "susspin.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:40.568377+00:00"
  },
  {
    "domain": "sv11.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "svj33au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "svr33.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "sydaus.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "tab77.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "tab77au.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "tab968.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "tab9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "taxis33bfm.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "terrabet9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "theoneau.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "thepokies33.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "thepokies33.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "thepokies96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "thesovereignaud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "thespinau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "thestarau.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "thor7.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "tiger88.support",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "titsplay33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "tnt99au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "tonygame7.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "top1au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "top1cas.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "top96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "topaz33.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "topbet9au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "topplayau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "toppokies33.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "topspin.ltd",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "toystory9au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "trillionaire33.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:44.313409+00:00"
  },
  {
    "domain": "trueblue777au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "truebluebets.cc",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:44.004169+00:00"
  },
  {
    "domain": "truebluebetscasino.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "truedinkumbet.fun",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:43.959912+00:00"
  },
  {
    "domain": "truemateaus.com",
    "group": "unverified",
    "addedAt": "2026-09-23T05:56:54+10:00"
  },
  {
    "domain": "truepokies88.com",
    "group": "latest",
    "addedAt": "2026-09-11T09:56:38+10:00"
  },
  {
    "domain": "truewin77.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "tss88.pro",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "tt-win.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "u2win.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "u88aud.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "uap66.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ubet96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ufc9au.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "unitedau.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "unitedpokies.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "urichbet88.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "uruswin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "uruswinfun.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "uu33au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "uuspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "uuspin.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "uwin33au.club",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "v2plus.me",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "v6aus.website",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "veeclub.net",
    "group": "unverified",
    "addedAt": "2026-09-15T09:43:47+10:00"
  },
  {
    "domain": "vegas88.bet",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vegas99.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "venus55.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "venus55.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "ves88.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vgs123.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "victor96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "victoria77au.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "victoryaud.com",
    "group": "latest",
    "addedAt": "2026-09-02T17:58:16+10:00"
  },
  {
    "domain": "vigorspin.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vip11.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vip31.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vip61.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vip711.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vip77.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vip777au.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:02:48.952196+00:00"
  },
  {
    "domain": "vip777au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vip77au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vip888.32auwin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "vip99.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "vip99au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "virgin77.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "webo98.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "webo98.live",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "weedpokies.org",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "wegobet.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "weplay88.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:04.786554+00:00"
  },
  {
    "domain": "weplay88.me",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "weplay9aus.org",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:05.132913+00:00"
  },
  {
    "domain": "wild88au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "wildcunt.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wildngo.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "wildoz.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wildpokies1.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:06.361437+00:00"
  },
  {
    "domain": "wildpokies8.vip",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wildpokies9.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "wildvip.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "win19au.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "win29au.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "win365b.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "win99au.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winall365.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winaud.cc",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winbet96au.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winfortune777.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winmate8.org",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winner29.co",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winnie777.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winrooau.com",
    "group": "best",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winshift77.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:06.716036+00:00"
  },
  {
    "domain": "winshift77.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winspirit1.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wintrue18.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winvault77.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "winwin96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winwinwin.club",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winwinwin1.online",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winx96.co",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "winzamate.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wombat88.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:07.636197+00:00"
  },
  {
    "domain": "wombat88.vip",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "won29.net",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "won66aud1.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "won96.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "woohoo9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "woospin.net",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:08.128047+00:00"
  },
  {
    "domain": "world99.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "world99aud.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wormsmate.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wow11.site",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wowpokiesau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wowspeed.store",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:08.715191+00:00"
  },
  {
    "domain": "wrbaus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wrc9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wtfmeth.com",
    "group": "latest",
    "addedAt": "2026-09-12T02:43:37+10:00"
  },
  {
    "domain": "wtfpokies.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:09.179110+00:00"
  },
  {
    "domain": "wtfslot.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "wthspin.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "wwe77.store",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:09.162128+00:00"
  },
  {
    "domain": "wynnbetau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "x2baby.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "x4betau.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "xbet96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xbox98.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xmeth98.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xofun88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xox96.net",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "xoxau.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xpay33.org",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "xpay33aus.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xpay9.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "xplay96.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "yayawin.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:10.559293+00:00"
  },
  {
    "domain": "yayawin.site",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:10.519752+00:00"
  },
  {
    "domain": "yayawin88.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "yeah96.co",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "yellowbat8.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "yellowbatfun.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "yes68.com",
    "group": "latest",
    "addedAt": "2026-10-12T18:00:00+10:00"
  },
  {
    "domain": "yes68.vip",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:10.731102+00:00"
  },
  {
    "domain": "yes77au.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "yypokies.com",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "zebra88.club",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:11.044397+00:00"
  },
  {
    "domain": "zebra88.online",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "zeroaud.com",
    "group": "latest",
    "addedAt": "2026-10-18T22:03:11.411566+00:00"
  },
  {
    "domain": "zeroaud.site",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  },
  {
    "domain": "zircon33.cc",
    "group": "latest",
    "addedAt": "2026-08-29T09:33:22+10:00"
  }
]
