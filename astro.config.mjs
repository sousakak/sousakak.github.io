// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import glsl from "vite-plugin-glsl";

// https://astro.build/config
export default defineConfig({
    i18n: {
        defaultLocale: "en",
        locales: ["ja", "en"],
        routing: {
            prefixDefaultLocale: false
        }
    },
    integrations: [vue()],
    vite: {
        plugins: [glsl()],
    }
});