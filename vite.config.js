import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command }) => ({
	plugins: [
		command === 'build' &&
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
		viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 10240 }),
		viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 }),
		visualizer({ open: true, gzipSize: true, brotliSize: true })
	].filter(Boolean),

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
			compress: { drop_console: true, drop_debugger: true },
			format: { comments: false }
		},
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) return 'vendor';
				},
				assetFileNames: 'assets/[name].[hash][extname]'
			}
		}
	}
}));
