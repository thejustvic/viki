import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintComments from "eslint-plugin-eslint-comments";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.js", "**/*.mjs", "**/node_modules", "**/target", "**/coverage", "**/.next"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
        "eslint-comments": eslintComments,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                tsx: true,
            },
            project: ["./tsconfig.eslint.json"],
        },
    },

    rules: {
        "max-lines": ["warn", {
            max: 300,
        }],

        "max-lines-per-function": ["warn", {
            max: 70,
        }],

        "no-nested-ternary": ["warn"],
        "class-methods-use-this": "off",
        eqeqeq: "error",

        "no-restricted-imports": ["error", {
            patterns: ["app/*", "node_modules"],
        }],

        "no-console": ["error", {
            allow: ["table", "error", "time", "timeEnd"],
        }],

        "func-style": ["error", "declaration", {
            allowArrowFunctions: true,
        }],

        "func-names": ["error", "always"],
        curly: ["error", "all"],
        "max-params": "warn",
        "no-implicit-globals": "warn",
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["error", {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "all",
            argsIgnorePattern: "^_",
        }],

        "eslint-comments/no-restricted-disable": ["warn", "max-lines*"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/prefer-as-const": "error",

        "@typescript-eslint/explicit-function-return-type": ["warn", {
            allowExpressions: true,
        }],

        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-includes": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-non-null-assertion": "error",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/await-thenable": "error",
        "max-depth": ["warn", 3],
    },
}, {
    files: ["**/*.tsx"],

    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",

        "max-lines-per-function": ["error", {
            max: 70,
        }],
    },
}];