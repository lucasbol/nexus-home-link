import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          'lucide-vue-next': [
            'RefreshCw',
            'Settings',
            'Activity',
            'Home',
            'Film',
            'Server',
            'Shield'
          ]
        }
      ],
      dts: true,
      dirs: ['src/composables', 'src/stores', 'src/utils'],
      vueTemplate: true
    }),
    Components({
      dts: true,
      dirs: ['src/components'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT ?? "3000"),
    proxy: {
      '/api': {
        target: process.env.services__api__https__0 || process.env.services__api__http__0 || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['chart.js', 'vue-chartjs'],
          d3: ['d3-force', 'd3-selection', 'd3-zoom'],
          ui: ['lucide-vue-next', '@vueuse/core']
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'chart.js', 'vue-chartjs']
  }
})
