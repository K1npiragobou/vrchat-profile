import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig, squooshImageService } from 'astro/config';

export default defineConfig({
  site: 'https://piramura.github.io',
  base: '/vrchat-profile',
  integrations: [tailwind(), mdx(), icon({
    include: {
      mdi: ["*"]
    }
  })],
  image: {
    service: squooshImageService()
  }
});
