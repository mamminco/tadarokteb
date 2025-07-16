// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null, // Or '200.html'/'404.html' if needed
            precompress: false,
            strict: true,
        }),
        prerender: {
            handleHttpError: 'warn',
            handleMissingId: 'warn'
            // Consider adding `export const prerender = true;` in your root +layout.ts/js
            // for explicit global prerendering if not all pages are automatically discovered.
        },
        // Note: `vite` is MOVED outside of `kit`
    },

    // Vite config is a TOP-LEVEL property
    vite: {
        build: {
            target: 'esnext', // Keep if needed, default is 'modules' which is usually fine
            minify: 'terser', // Default is 'esbuild' which is faster, terser might be smaller
            // Generally REMOVE custom rollupOptions unless you have a very specific need
            // Let Vite/SvelteKit handle code-splitting and asset naming
            /*
            rollupOptions: {
                // Recommend removing this output section entirely for adapter-static
                output: {
                    // inlineDynamicImports: true, // REMOVE THIS - usually bad for static
                    // manualChunks: undefined,    // REMOVE THIS
                    // Let Vite handle chunk/entry/asset naming with hashing for caching
                },
                // treeshake: 'smallest', // Keep if desired, default is good too
            },
            */
        },
    },
};

export default config;