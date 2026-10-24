import { defineConfig } from "void/config";

export default defineConfig({
  cloudflare: {
    name: "cfb-community-poll",
    account_id: "8bac5053cc0448ced93c05985636036c",
    workers_dev: true,
    preview_urls: true,
    routes: [
      { pattern: "cfbcommunity.com", custom_domain: true },
      { pattern: "www.cfbcommunity.com", custom_domain: true },
    ],
  },
  routing: {
    redirects: {
      "https://www.cfbcommunity.com/*": { to: "https://cfbcommunity.com/:splat", status: 301 },
    },
  },
  worker: {
    compatibility_date: "2026-02-24",
  },
  head: {
    title: "CFB Community Poll — FBS and FCS Ranked by Fans",
    htmlAttrs: { lang: "en" },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Separate fan polls for every FBS and FCS college football program. One ballot per subdivision, Borda count scoring.",
      },
    ],
    link: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap",
      },
    ],
  },
});
