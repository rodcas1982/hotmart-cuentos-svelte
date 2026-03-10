import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const base = process.env.BASE_PATH || '/hotmart-cuentos-svelte';

export default defineConfig({
	plugins: [sveltekit()],
	base: base
});
