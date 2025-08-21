import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { devLogger } from '@meituan-nocode/vite-plugin-dev-logger';
import { devHtmlTransformer, prodHtmlTransformer } from '@meituan-nocode/vite-plugin-nocode-html-transformer';
import react from '@vitejs/plugin-react';

const isProdEnv = process.env.NODE_ENV === 'production';
// Ensure PUBLIC_PATH is always root path
const PUBLIC_PATH = '/';
// Ensure OUT_DIR is always dist directory
const OUT_DIR = 'dist';

const PLUGINS = isProdEnv ? [
  react(),
  prodHtmlTransformer(process.env.CHAT_VARIABLE)
] : [
  devLogger({
    dirname: resolve(tmpdir(), '.nocode-dev-logs'),
    maxFiles: '3d',
  }),
  react(),
  devHtmlTransformer(process.env.CHAT_VARIABLE),
];

// Note: Since vite-plugin-prerender uses CommonJS module system while Vite uses ES modules
// We will handle pre-rendering in build scripts rather than in vite.config.js
let prerenderPlugin = [];

// Plugin to add X-Robots-Tag
const addXRobotsTag = () => {
  return {
    name: 'add-x-robots-tag',
    transformIndexHtml(html) {
      return html.replace('<head>', '<head><meta name="robots" content="index, follow">');
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
    hmr: {
      overlay: true
    }
  },
  plugins: [...PLUGINS, addXRobotsTag()],
  base: PUBLIC_PATH,
  build: {
    outDir: OUT_DIR,
    // 性能优化配置
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // 代码拆分
        manualChunks: {
          react: ['react', 'react-dom'],
          radix: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio', '@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-collapsible', '@radix-ui/react-context-menu', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card', '@radix-ui/react-label', '@radix-ui/react-menubar', '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-progress', '@radix-ui/react-radio-group', '@radix-ui/react-scroll-area', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slider', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-tooltip'],
          framer: ['framer-motion'],
          recharts: ['recharts'],
          supabase: ['@supabase/supabase-js'],
          reactquery: ['@tanstack/react-query'],
        },
        // 静态资源分类
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: 'lib',
        replacement: resolve(__dirname, 'lib'),
      },
    ],
  },
  // 优化CSS
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
    devSourcemap: false,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', '@radix-ui/react-accordion'],
    exclude: [],
  },
});