/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  plugins: [
    require("@ianvs/prettier-plugin-sort-imports"),
    require("prettier-plugin-tailwindcss"),
  ],
  importOrder: [
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(remix/(.*)$)|^(remix$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@transitchat/(.*)$",
    "",
    "^~/lib/(.*)$",
    "^~/components/(.*)$",
    "^~/(.*)$",
    "^[./]",
  ],
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
};
