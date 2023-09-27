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
