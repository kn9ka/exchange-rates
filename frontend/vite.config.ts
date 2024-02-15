import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': { target: 'http://0.0.0.0:3000', secure: false, changeOrigin: true }
		}
	}
});
