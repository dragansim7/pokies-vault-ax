import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { lookupSiteIconFn } from "@/lib/casino.functions";

const CACHE_KEY = "pokies_vault_site_icons_v1";
const FALLBACK = "/site-fallback.jpg";
const memory = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
let active = 0;
const queue: Array<() => void> = [];

function readStore(): Record<string, string> {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}") as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function remembered(domain: string): string | undefined {
  if (memory.has(domain)) return memory.get(domain);
  const stored = readStore()[domain];
  if (typeof stored === "string") {
    memory.set(domain, stored);
    return stored;
  }
  return undefined;
}

function remember(domain: string, url: string) {
  memory.set(domain, url);
  try {
    const next = readStore();
    next[domain] = url;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

function runNext() {
  if (active >= 4) return;
  const job = queue.shift();
  if (job) job();
}

export function SiteIcon({ domain }: { domain: string }) {
  const lookup = useServerFn(lookupSiteIconFn);
  const lookupRef = useRef(lookup);
  lookupRef.current = lookup;
  const [src, setSrc] = useState(() => remembered(domain) || "");

  useEffect(() => {
    const known = remembered(domain);
    if (known !== undefined) {
      setSrc(known || FALLBACK);
      return;
    }
    let cancelled = false;
    const existing = pending.get(domain);
    const task =
      existing ??
      new Promise<string>((resolve) => {
        const run = () => {
          active += 1;
          lookupRef.current({ data: { domain } })
            .then((url) => {
              const next = typeof url === "string" ? url : "";
              remember(domain, next);
              resolve(next);
            })
            .catch(() => {
              remember(domain, "");
              resolve("");
            })
            .finally(() => {
              active -= 1;
              pending.delete(domain);
              runNext();
            });
        };
        if (active < 4) run();
        else queue.push(run);
      });
    pending.set(domain, task);
    void task.then((url) => {
      if (!cancelled) setSrc(url || FALLBACK);
    });
    return () => {
      cancelled = true;
    };
  }, [domain]);

  if (!src) return <span className="site-icon" />;

  return (
    <img
      className="site-icon"
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => setSrc(FALLBACK)}
    />
  );
}
