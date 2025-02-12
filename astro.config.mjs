import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // Integración de React
import tailwind from '@astrojs/tailwind'; // Integración de TailwindCSS

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),    // Activa React
    tailwind(), // Activa TailwindCSS
  ],
});
