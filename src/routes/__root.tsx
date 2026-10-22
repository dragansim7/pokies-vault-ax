import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { VaultProvider } from "@/components/vault";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Pokies Vault" },
      {
        name: "description",
        content:
          "A private list of pokie sites and a bonus fetcher for accounts that share your phone login.",
      },
      { name: "theme-color", content: "#050507" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" data-theme="vault" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=JSON.parse(localStorage.getItem("pokies_vault_v1")||"null");if(t&&typeof t.theme==="string")document.documentElement.dataset.theme=t.theme}catch(e){}',
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <VaultProvider>
            <Outlet />
          </VaultProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
