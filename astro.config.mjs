// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import glsl from "vite-plugin-glsl";

// https://astro.build/config
export default defineConfig({
    integrations: [vue()],
    vite: {
        plugins: [glsl()],
    }
});