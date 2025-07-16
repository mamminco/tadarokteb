import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import txPlugin from './txCompiler';
export default defineConfig({
	plugins: [imagetools(),tailwindcss(),sveltekit(),txPlugin('svelte')],
	server: {
		watch: {
			ignored: ['app.css'],
		  },
		allowedHosts: ['hi.tilsan.ir'],
	  },
});
