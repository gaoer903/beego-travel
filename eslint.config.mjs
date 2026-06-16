import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  {
    ignores: [".nuxt/**", ".output/**", "dist/**", "node_modules/**"],
  },

  {
    files: ["**/*.{js,ts,vue}"],
    plugins: {
      vue: pluginVue,
      "@typescript-eslint": tsPlugin,
    },

    languageOptions: {
      parser: vueParser,

      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        sourceType: "module",
      },

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // ===== JavaScript =====

      "no-console": "off",

      "no-debugger": "error",

      eqeqeq: ["error", "always"],

      curly: ["error", "all"],

      "prefer-const": "error",

      "no-var": "error",

      // ===== TypeScript =====

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": "error",

      // ===== Vue =====

      "vue/multi-word-component-names": "off",

      "vue/max-attributes-per-line": "off",

      "vue/html-self-closing": "off",

      "vue/singleline-html-element-content-newline": "off",

      "vue/require-default-prop": "off",

      "vue/block-order": [
        "error",
        {
          order: ["template", "script", "style"],
        },
      ],
    },
  },

  eslintConfigPrettier,
]
