// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.*',
      'commitlint.config.*',
      'scripts/**',
      '.husky/**',
      'dist/**',
    ],
  },

  ...tanstackConfig,

  // React Hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // TanStack Router
  ...pluginRouter.configs['flat/recommended'],

  // TanStack Query
  ...pluginQuery.configs['flat/recommended'],

  // Игнорим генерируемое дерево роутов
  { ignores: ['**/routeTree.gen.ts'] },

  // Prettier — последним
  eslintConfigPrettier,
]
