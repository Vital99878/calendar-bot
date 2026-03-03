// @ts-check

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  // что игнорим
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.*',
      'commitlint.config.*',
      'scripts/**',
      '.husky/**',
      'dist/**',
      'node_modules/**',
    ],
  },

  // базовые правила ESLint для JS
  js.configs.recommended,

  // правила для TS (без type-aware, чтобы не усложнять старт)
  ...tseslint.configs.recommended,

  // настройки языка/окружения для Node ESM
  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // prettier — последним
  eslintConfigPrettier,
]
