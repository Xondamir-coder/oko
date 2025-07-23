import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ command }) => ({
	plugins: [
		command === 'build' &&
			VitePWA({
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{png,jpg,jpeg,webp,avif,mp4,webm}'],
					runtimeCaching: [
						{
							urlPattern: /\/assets\/.*\.(?:mp4|webm)$/,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'video-cache',
								expiration: {
									maxEntries: 5,
									maxAgeSeconds: 60 * 60 * 24 * 365
								}
							}
						},
						{
							urlPattern: /\/assets\/.*\.(?:png|jpg|jpeg|webp|avif)$/,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'image-cache',
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60 * 24 * 30
								}
							}
						}
					]
				}
			}),
		viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 10240 }),
		viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 })
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
