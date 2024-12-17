## 디렉토리 구조

1. <u>기존 vue 프로젝트 디렉토리</u>는 popup 역할
2. <u>scr/extensions/content</u> 는 content script 역할
3. <u>src/extensions/background</u> 는 background script 역할

### 기존 vue 디렉토리

### scr/extensions/content

* 디렉토리 구조 변경 불가능

### src/extensions/background

* 디렉토리 구조 변경 불가능

---

## 빌드

### vite.config.js

```javascript
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

```

### package.json

```json
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && vite build --mode content && vite build --mode background",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "vite": "^6.0.1"
  }
}

```

## 배포
