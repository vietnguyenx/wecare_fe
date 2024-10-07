import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000, // Chỉ định cổng mà Vite sẽ chạy
    proxy: {
      '/api': {
        target: 'https://localhost:7999', // Địa chỉ backend của bạn
        changeOrigin: true,
        secure: false, // Sử dụng true nếu backend sử dụng HTTPS và bạn có chứng chỉ hợp lệ
      },
    },
  },
});
