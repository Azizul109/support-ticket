import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react({
            fastRefresh: true,
        }),
    ],
    esbuild: {
        jsx: "automatic",
    },
    optimizeDeps: {
        include: ["react", "react-dom"],
    },
    server: {
        host: "0.0.0.0",
        hmr: {
            host: "localhost",
        },
    },
    define: {
        "process.env": {},
    },
    build: {
        // Ensure assets are built with absolute URLs
        assetsDir: 'assets',
    },
});
