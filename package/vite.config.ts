import react from '@vitejs/plugin-react';
import {readFile} from 'node:fs/promises';
import {defineConfig, UserConfigExport} from 'vite';
import dts from 'vite-plugin-dts';
import * as path from "path";

const App = async (): Promise<UserConfigExport> => {
    let name: string = 'ReactSocialAuth';

    const data: string = await readFile(path.join(__dirname, 'src', 'lib', 'index.ts'), {encoding: 'utf-8'});

    const s = data.split('\n');

    for (let x of s.reverse()) {
        if (x.includes('export default'))
            name = x.replace('export default ', '').replace(" ", "");
    }

    return defineConfig({
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
    });
}

export default App
