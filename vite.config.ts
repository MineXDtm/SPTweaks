import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from "path";
import typescript from '@rollup/plugin-typescript';
function loadWebExtConfig() {
  try {
    return require("./.web-ext.config.json");
  } catch {
    return undefined;
  }
}

function generateManifest() {
  const manifest = readJsonFile("manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}
export default defineConfig({
  plugins: [
    svelte(),
    
    webExtension({
      assets: "src/assets",
      webExtConfig: loadWebExtConfig(),
      manifest: generateManifest,
      additionalInputs: [
        "src/sptweaks_client.ts",
        "sptweaks.css",
        
      ]
    }),
    typescript()
  ]
});
