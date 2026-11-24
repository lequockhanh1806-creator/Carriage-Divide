import {defineConfig} from 'vite';
// Relative asset paths work on GitHub Pages project subpaths and on root-level hosts.
export default defineConfig({base:'./',build:{outDir:'dist'}});
