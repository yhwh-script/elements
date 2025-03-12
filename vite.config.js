import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
    build: {
        target: 'esnext'
    },
    server: {
        port: 3443,
    },
    plugins: [
        basicSsl()
    ]
});