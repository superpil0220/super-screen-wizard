import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function buildRole(mode) {
  console.log("Build Mode is ", mode);
  return mode === "content" || mode === "background"
      ? {
        build: {
          outDir: "dist",
          rollupOptions: {
            input: `./src/${mode}/${mode}main.js`,
            output: {
              entryFileNames: `${mode}/[name].js`,
              chunkFileNames: `${mode}/[name]-[hash].js`,
              assetFileNames: `${mode}/[name][extname]`,
            },
          },
          emptyOutDir: false, // 빌드 시 기존 빌드된 파일 지우지 않음, vue빌드는 dist파일을 삭제하고 다시 새롭게 빌드 생성
        },
        resolve: {
          alias: {
            '~@': resolve(__dirname, `src/${mode}`),
          },
        },
        publicDir: false,
      }
      : {
        plugins: [vue()],
      };
}

export default defineConfig(({mode}) => {
  return buildRole(mode);
});
