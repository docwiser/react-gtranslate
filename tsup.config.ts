import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-slot',
    'lucide-react',
  ],
  banner: {
    js: "'use client';",
  },
});
