import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import viteCompression from 'vite-plugin-compression';
import { fixRussianPrepositions } from './src/js/typography';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(() => ({
	plugins: [
		createHtmlPlugin({
			minify: true
		}),
		viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 10240 }),
		viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 }),
		{
			name: 'fix-russian-prepositions',
			transformIndexHtml(html) {
				return fixRussianPrepositions(html);
			}
		}
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
