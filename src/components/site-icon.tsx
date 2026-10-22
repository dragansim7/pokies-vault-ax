import { useEffect, useState } from "react";

export function SiteIcon({ domain }: { domain: string }) {
  const [src, setSrc] = useState(`https://intel.bestpokieslist.online/favicon/${domain}`);
  useEffect(() => setSrc(`https://intel.bestpokieslist.online/favicon/${domain}`), [domain]);

  return (
    <img
      className="site-icon"
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => setSrc((current) => (current === "/site-fallback.jpg" ? current : "/site-fallback.jpg"))}
    />
  );
}
