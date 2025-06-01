import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // 정적 파일 경로 설정 추가
  publicDir: 'public',
  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
