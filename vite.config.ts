import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Opsi 'base' ini sangat PENTING untuk XAMPP / Hosting Subfolder
  // './' membuat browser mencari file aset relatif terhadap file index.html
  // bukan relatif terhadap root domain.
  base: './',
})