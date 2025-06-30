import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "repairfindbucket.s3.eu-west-3.amazonaws.com",
      "repairfindbucket.s3-eu-west-3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
