import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { resolveSiteIcon } from "@/lib/casino.functions";

const FALLBACK = "/site-fallback.jpg";
const CACHE = "vault-icon:";
const MAX = 4;

let active = 0;
const waiters: Array<() => void> = [];
const inflight = new Map<string, Promise<string>>();

function readCache(domain: string): string | undefined {
  try {
    const raw = sessionStorage.getItem(CACHE + domain);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { at: number; src: string };
    if (Date.now() - parsed.at > 10 * 60 * 1000) return undefined;
    return parsed.src;
  } catch {
    return undefined;
  }
}

function writeCache(domain: string, src: string) {
  try {
    sessionStorage.setItem(CACHE + domain, JSON.stringify({ at: Date.now(), src }));
  } catch {
    /* ignore */
  }
}

function pump() {
  while (active < MAX && waiters.length) {
    const next = waiters.shift();
    if (next) next();
  }
}

function loadIcon(domain: string, run: (domain: string) => Promise<string>): Promise<string> {
  const cached = readCache(domain);
  if (cached) return Promise.resolve(cached);
  const existing = inflight.get(domain);
  if (existing) return existing;
  const job = new Promise<string>((resolve) => {
    const start = () => {
      active += 1;
      run(domain)
        .then((src) => {
          writeCache(domain, src);
          resolve(src);
        })
        .catch(() => {
          resolve(FALLBACK);
        })
        .finally(() => {
          active -= 1;
          inflight.delete(domain);
          pump();
        });
    };
    if (active < MAX) start();
    else waiters.push(start);
  });
  inflight.set(domain, job);
  return job;
}

export function SiteIcon({ domain }: { domain: string }) {
  const resolve = useServerFn(resolveSiteIcon);
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;
  const ref = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState(FALLBACK);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const cached = readCache(domain);
    if (cached) {
      setSrc(cached);
      return;
    }
    let stop = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void loadIcon(domain, async (value) => {
          const result = await resolveRef.current({ data: { domain: value } });
          return result.icon || FALLBACK;
        }).then((next) => {
          if (!stop) setSrc(next);
        });
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => {
      stop = true;
      observer.disconnect();
    };
  }, [domain]);

  return (
    <img
      ref={ref}
      className="site-icon"
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => {
        if (src === FALLBACK) return;
        writeCache(domain, FALLBACK);
        setSrc(FALLBACK);
      }}
    />
  );
}
