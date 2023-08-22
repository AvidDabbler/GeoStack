module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@transitchat/eslint-config`
  extends: ["@transitchat/eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
};
