import type { NextConfig } from "next";
require("dotenv").config({
  path: ".env.local",
});


const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ['i.imgur.com'],
  },
};

export default nextConfig;
