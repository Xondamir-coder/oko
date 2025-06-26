import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
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
	}
});
