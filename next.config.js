/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:["bom-inverted.s3.amazonaws.com"]
  }
}

module.exports = nextConfig
