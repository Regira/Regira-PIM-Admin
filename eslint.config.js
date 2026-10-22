import { defineConfig, globalIgnores } from "eslint/config"
import pluginVue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import tseslint from "typescript-eslint"
import skipFormatting from "eslint-config-prettier/flat"

// What @vue/eslint-config-typescript's defineConfigWithVueTs(vueTsConfigs.recommended) sets up, written out with its own
// dependencies: the package also pulls in fast-glob → micromatch → braces (GHSA-vfj7-8cjw-p6xm), which it only needs
// for type-checked linting, and this app lints without type information
export default defineConfig(
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"],
    },

    globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "**/node_modules/**"]),

    pluginVue.configs["flat/essential"],

    // typescript-eslint's recommended rules, for the TypeScript in .vue files too
    tseslint.configs.recommended.map((config) => (config.files?.includes("**/*.ts") ? { ...config, files: [...config.files, "**/*.vue"] } : config)),

    // typescript-eslint's base config sets its own parser for every file: put the Vue parser back for .vue files,
    // with TypeScript for <script lang="ts">
    pluginVue.configs["flat/base"],
    {
        name: "app/vue-typescript",
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: { js: "espree", jsx: "espree", ts: tseslint.parser, tsx: tseslint.parser },
                ecmaVersion: 2024,
                extraFileExtensions: [".vue"],
            },
        },
        rules: {
            // every component's script is TypeScript
            "vue/block-lang": ["error", { script: { lang: ["ts"], allowNoLang: false } }],
        },
    },

    skipFormatting,

    // Regira entity-slice conventions: single-word component names (Selector, Filter, Details, …),
    // `any` in scaffold boilerplate and empty `Emits` interfaces extending OverviewEmits.
    {
        name: "app/regira-conventions",
        rules: {
            "vue/multi-word-component-names": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off",
        },
    }
)
