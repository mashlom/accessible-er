import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// In production the app is deployed to GitHub Pages under /accessible-er/,
// but local dev serves at plain http://localhost:PORT/.
// HashRouter is used so client-side routing works without server rewrites.
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        base: command === 'build' ? '/accessible-er/' : '/',
        plugins: [react()],
    });
});
