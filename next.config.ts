/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forzamos a que webpack o el entorno respeten la raíz local
  distDir: '.next',
};

module.exports = nextConfig;