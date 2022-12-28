
import preprocess from "svelte-preprocess";
import { vitePreprocess } from '@sveltejs/kit/vite';
const config = {
	preprocess: [
		preprocess({
		  postcss: true,
		  vitePreprocess:true
		}),
	  ],
};

export default config;
