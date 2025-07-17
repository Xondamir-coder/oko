import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'assets/video.mp4' // ← add your video here (relative to dist/)
			],
			workbox: {
				globPatterns: [
					'**/*.{js,css,html,mp4}' // ← ensure .mp4 files are part of the precache manifest
				],
				runtimeCaching: [
					{
						urlPattern: /\/assets\/.*\.mp4$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'video-cache',
							expiration: {
								maxEntries: 5,
								maxAgeSeconds: 60 * 60 * 24 * 365
							}
						}
					}
				]
			}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@utils': path.resolve(__dirname, 'src/scss/utils')
		}
	},
	css: { postcss: { plugins: [autoprefixer] } },
	build: {
		rollupOptions: {
			output: { assetFileNames: 'assets/[name].[hash][extname]' }
		}
	}
});
