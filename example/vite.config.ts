import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        'process.env.RS_FACEBOOK_APP_ID': JSON.stringify(env.RS_FACEBOOK_APP_ID),
        'process.env.RS_TWITTER_OAUTH2_STATE': JSON.stringify(env.RS_TWITTER_OAUTH2_STATE),
        'process.env.RS_PASS_CORS_KEY': JSON.stringify(env.RS_PASS_CORS_KEY),
        'process.env.RS_TWITTER_CLIENT_KEY': JSON.stringify(env.RS_TWITTER_CLIENT_KEY),
        'process.env.RS_TWITTER_CLIENT_KEYS': JSON.stringify(env.RS_TWITTER_CLIENT_KEYS),
        'process.env.RS_SNAPCHAT_CLIENT_KEY': JSON.stringify(env.RS_SNAPCHAT_CLIENT_KEY),
        'process.env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY': JSON.stringify(env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY),
        'process.env.RS_SNAPCHAT_OAUTH2_STATE': JSON.stringify(env.RS_SNAPCHAT_OAUTH2_STATE),
        'process.env.RS_LINKEDIN_OAUTH2_STATE': JSON.stringify(env.RS_LINKEDIN_OAUTH2_STATE),
        'process.env.RS_LINKEDIN_CLIENT_KEY': JSON.stringify(env.RS_LINKEDIN_CLIENT_KEY),
        'process.env.RS_LINKEDIN_CLIENT_SECRET': JSON.stringify(env.RS_LINKEDIN_CLIENT_SECRET),
        'process.env.RS_GOOGLE_CLIENT_KEY': JSON.stringify(env.RS_GOOGLE_CLIENT_KEY),

      },
      plugins: [react()],
    }
  })
