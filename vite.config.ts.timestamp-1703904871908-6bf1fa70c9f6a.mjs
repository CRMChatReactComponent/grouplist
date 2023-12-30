// scripts/utils.ts
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList/scripts/utils.ts";
var r = (...args) => {
  const __filename = fileURLToPath(__vite_injected_original_import_meta_url);
  const __dirname2 = dirname(__filename);
  return resolve(__dirname2, "..", ...args).replace(/\\/g, "/");
};

// vite.config.ts
import react from "file:///Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.0.10/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.6/node_modules/vite/dist/node/index.js";
import { GenI18nTypes } from "file:///Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList/node_modules/.pnpm/vite-i18n-gen-resources-type@0.0.3/node_modules/vite-i18n-gen-resources-type/dist/index.js";
import tsconfigPaths from "file:///Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList/node_modules/.pnpm/vite-tsconfig-paths@4.2.3_typescript@5.3.3_vite@5.0.10/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/carljin/Documents/project/extension/CRMChatReactComponent/GroupList";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    GenI18nTypes({
      watchFolder: `${r("src/i18n/locales")}`,
      outputFolder: `${r("src/i18n")}`
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "grouplist",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "antd",
        "i18next",
        "react-i18next"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyaXB0cy91dGlscy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9jYXJsamluL0RvY3VtZW50cy9wcm9qZWN0L2V4dGVuc2lvbi9DUk1DaGF0UmVhY3RDb21wb25lbnQvR3JvdXBMaXN0L3NjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYXJsamluL0RvY3VtZW50cy9wcm9qZWN0L2V4dGVuc2lvbi9DUk1DaGF0UmVhY3RDb21wb25lbnQvR3JvdXBMaXN0L3NjcmlwdHMvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2NhcmxqaW4vRG9jdW1lbnRzL3Byb2plY3QvZXh0ZW5zaW9uL0NSTUNoYXRSZWFjdENvbXBvbmVudC9Hcm91cExpc3Qvc2NyaXB0cy91dGlscy50c1wiO2ltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcblxuZXhwb3J0IGNvbnN0IHIgPSAoLi4uYXJnczogc3RyaW5nW10pID0+IHtcbiAgY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbiAgY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShfX2ZpbGVuYW1lKTtcbiAgcmV0dXJuIHJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIC4uLmFyZ3MpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2NhcmxqaW4vRG9jdW1lbnRzL3Byb2plY3QvZXh0ZW5zaW9uL0NSTUNoYXRSZWFjdENvbXBvbmVudC9Hcm91cExpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYXJsamluL0RvY3VtZW50cy9wcm9qZWN0L2V4dGVuc2lvbi9DUk1DaGF0UmVhY3RDb21wb25lbnQvR3JvdXBMaXN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jYXJsamluL0RvY3VtZW50cy9wcm9qZWN0L2V4dGVuc2lvbi9DUk1DaGF0UmVhY3RDb21wb25lbnQvR3JvdXBMaXN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgciB9IGZyb20gXCIuL3NjcmlwdHMvdXRpbHNcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgR2VuSTE4blR5cGVzIH0gZnJvbSBcInZpdGUtaTE4bi1nZW4tcmVzb3VyY2VzLXR5cGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gICAgR2VuSTE4blR5cGVzKHtcbiAgICAgIHdhdGNoRm9sZGVyOiBgJHtyKFwic3JjL2kxOG4vbG9jYWxlc1wiKX1gLFxuICAgICAgb3V0cHV0Rm9sZGVyOiBgJHtyKFwic3JjL2kxOG5cIil9YCxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9pbmRleC50c1wiKSxcbiAgICAgIG5hbWU6IFwiZ3JvdXBsaXN0XCIsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgaW5kZXguJHtmb3JtYXR9LmpzYCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIFwicmVhY3RcIixcbiAgICAgICAgXCJyZWFjdC1kb21cIixcbiAgICAgICAgXCJyZWFjdC9qc3gtcnVudGltZVwiLFxuICAgICAgICBcImFudGRcIixcbiAgICAgICAgXCJpMThuZXh0XCIsXG4gICAgICAgIFwicmVhY3QtaTE4bmV4dFwiLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRaLFNBQVMsU0FBUyxlQUFlO0FBQzdiLFNBQVMscUJBQXFCO0FBRHdPLElBQU0sMkNBQTJDO0FBR2hULElBQU0sSUFBSSxJQUFJLFNBQW1CO0FBQ3RDLFFBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELFFBQU1BLGFBQVksUUFBUSxVQUFVO0FBQ3BDLFNBQU8sUUFBUUEsWUFBVyxNQUFNLEdBQUcsSUFBSSxFQUFFLFFBQVEsT0FBTyxHQUFHO0FBQzdEOzs7QUNOQSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBTDFCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLGFBQWE7QUFBQSxNQUNYLGFBQWEsR0FBRyxFQUFFLGtCQUFrQixDQUFDO0FBQUEsTUFDckMsY0FBYyxHQUFHLEVBQUUsVUFBVSxDQUFDO0FBQUEsSUFDaEMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsU0FBUyxNQUFNO0FBQUEsSUFDdkM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJfX2Rpcm5hbWUiXQp9Cg==
