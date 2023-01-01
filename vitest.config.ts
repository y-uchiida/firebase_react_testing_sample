/// <reference types="vitest" />
import { mergeConfig, defineConfig } from 'vite'
import { viteConfig } from './vite.config'

// https://vitejs.dev/config/
export const vitestConfig = mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: 'happy-dom',
			setupFiles: [
				// 各テストファイルを実行する前に読み込まれる共通設定を記述するファイルを指定
				'tests/setup.ts'
			],
		},
	})
);

export default vitestConfig;
