import nextra from "nextra"

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
})

export default withNextra({
  reactStrictMode: false,
  output: "standalone",
  productionBrowserSourceMaps: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })

    if (!dev) {
      config.optimization.minimize = false
    }

    return config
  },
  async headers() {
    return [
      {
        // allow cross-origin requests to the API
        source: "/api/v1/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
})
