/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
    watchPaths: async () => {
    return [
      // "./app/styles/**",
      "../../packages/ui/src/**/*",
      "../../packages/business/src/**/*",
      "../../packages/database/src/**/*",
      "../../packages/internal-nobuild/src/**/*",
    ];
  },
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  postcss: true,
  serverModuleFormat: "cjs",
  tailwind: true,
};
