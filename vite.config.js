import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		// 1) PWA with precaching and runtime caching for your video
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,mp4}'],
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
		}),

		// 2) Gzip + Brotli compress your build output
		viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 10240 }),
		viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 }),

		// 3) Bundle visualizer to inspect your chunks
		visualizer({ open: true, gzipSize: true, brotliSize: true })
	],

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@utils': path.resolve(__dirname, 'src/scss/utils')
		}
	},

	css: {
		postcss: {
			plugins: [autoprefixer]
		}
	},

	build: {
		target: 'es2020',
		minify: 'terser',
		cssCodeSplit: true,
		chunkSizeWarningLimit: 500,
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			},
			format: {
				comments: false
			}
		},
		rollupOptions: {
			output: {
				// split vendor code into its own chunk
				manualChunks(id) {
					if (id.includes('node_modules')) return 'vendor';
				},
				// hashed filenames for long‑term caching
				assetFileNames: 'assets/[name].[hash][extname]'
			}
		}
	}
});
