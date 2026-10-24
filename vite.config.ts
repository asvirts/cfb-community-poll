import tailwindcss from "@tailwindcss/vite";
import { voidReact } from "@void/react/plugin";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { voidPlugin } from "void";
import { defineConfig } from "vite-plus";

function cloudflareDeployPointer() {
  return {
    name: "cfb-cloudflare-deploy-pointer",
    apply: "build" as const,
    enforce: "post" as const,
    closeBundle() {
      if (process.env.VOID_CLOUDFLARE_DEPLOY_BUILD !== "1") return;
      const workerConfig = join(process.cwd(), "dist/ssr/wrangler.json");
      if (!existsSync(workerConfig)) return;
      const directory = join(process.cwd(), ".wrangler", "deploy");
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        join(directory, "config.json"),
        JSON.stringify({
          configPath: "../../dist/ssr/wrangler.json",
          auxiliaryWorkers: [],
        }),
      );
    },
  };
}

export default defineConfig(() => {
  const testing = process.env.VITEST === "true";
  return {
    plugins: testing
      ? []
      : [
          tailwindcss(),
          voidPlugin(),
          voidReact({ react: { compiler: true } }),
          cloudflareDeployPointer(),
        ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    lint: {
      options: {
        typeAware: true,
        typeCheck: true,
      },
    },
  };
});
