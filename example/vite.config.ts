import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        'process.env.RS_FACEBOOK_APP_ID': JSON.stringify(env.RS_FACEBOOK_APP_ID)
      },
      plugins: [react()],
    }
  })
