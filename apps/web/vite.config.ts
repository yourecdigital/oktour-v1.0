import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from '@vite-pwa/vite-plugin';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      plugins: [['@swc/plugin-styled-components', { displayName: true, ssr: true }]],
      styledComponents: true,
    }),
    VitePWA({
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        name: 'Sochi Travel',
        short_name: 'Sochi',
        icons: [
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
        ],
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone'
      }
    })
  ],
  ssr: {
    target: 'node',
  }
});




