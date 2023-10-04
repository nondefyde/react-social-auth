import react from '@vitejs/plugin-react';
import { readFile } from 'fs/promises'; // remove 'node:'
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';

let name: string = 'ReactSocialAuth';

readFile(path.join(__dirname, 'src', 'lib', 'index.ts'), { encoding: 'utf-8' })
    .then(data => {
        const s = data.split('\n');
        for (let x of s.reverse()) {
            if (x.includes('export default')) {
                name = x.replace('export default ', '').replace(' ', '');
            }
        }
    })
    .catch(error => {
        console.error(error);
    });

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
        plugins: [
            react(),
            dts({
                insertTypesEntry: true,
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/lib/index.ts'),
                name,
                formats: ['es', 'umd'],
                fileName: (format) => `lib.${format}.js`,
            },
            rollupOptions: {
                external: ['react', 'react-dom', 'styled-components'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'styled-components': 'styled',
                    },
                },
            },
        },
    };
});
