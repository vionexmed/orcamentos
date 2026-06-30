/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // O build não deve falhar por lint; a checagem de tipos do TS continua ativa.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
