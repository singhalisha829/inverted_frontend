/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER: process.env.SERVER,
  },
  images:{
    domains:["bom-inverted.s3.amazonaws.com"]
  }
}

module.exports = nextConfig
