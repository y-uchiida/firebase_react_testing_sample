/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export const viteConfig = defineConfig({
  plugins: [react(), tsConfigPaths()],
});

export default viteConfig;
