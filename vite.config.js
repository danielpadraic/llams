import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  define: {
    'import.meta.env.SUPABASE_URL': JSON.stringify('https://pxxccofroamhafrxigox.supabase.co'),
    'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGNjb2Zyb2FtaGFmcnhpZ294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjk1NjEsImV4cCI6MjA1NjcwNTU2MX0.GXSrO_1QlO8gIiwx2ZVWcHORVFlGR_A55XZVxje-muc')
  },
  server: {
    open: true
  },
  resolve: {
    alias: {
      // No aliases needed
    }
  }
});