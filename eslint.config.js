// @ts-check

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.husky/**',
      'scripts/**',
      'eslint.config.js',
      'prettier.config.*',
      'commitlint.config.*',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,js,mjs,cjs}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        // чтобы корректно резолвить TS в NodeNext-режиме
        typescript: {
          project: './tsconfig.eslint.json',
        },
        node: true,
      },
    },
    rules: {
      // 🧱 Границы слоёв (архитектура)
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // main.ts — только bot + config
            {
              target: './src/main.ts',
              from: './src/flows',
              message: 'main.ts не должен импортировать flows напрямую. Используй bot/* как вход.',
            },
            {
              target: './src/main.ts',
              from: './src/services',
              message: 'main.ts не должен импортировать services напрямую.',
            },
            {
              target: './src/main.ts',
              from: './src/db',
              message: 'main.ts не должен импортировать db напрямую.',
            },

            // bot — адаптер Telegram: без services/db
            {
              target: './src/bot',
              from: './src/services',
              message: 'bot/* не должен импортировать services/*. Вызови flow (flows/*).',
            },
            {
              target: './src/bot',
              from: './src/db',
              message: 'bot/* не должен импортировать db/*. Вызови flow (flows/*).',
            },

            // flows — сценарии: без bot
            {
              target: './src/flows',
              from: './src/bot',
              message: 'flows/* не должен импортировать bot/* (никакого ctx/reply внутри flows).',
            },

            // services — чистая логика: без bot/flows/db
            {
              target: './src/services',
              from: './src/bot',
              message: 'services/* не должен зависеть от bot/*.',
            },
            {
              target: './src/services',
              from: './src/flows',
              message: 'services/* не должен зависеть от flows/*.',
            },
            {
              target: './src/services',
              from: './src/db',
              message: 'services/* не должен зависеть от db/*.',
            },

            // db — доступ к хранилищу: без bot/flows/services
            {
              target: './src/db',
              from: './src/bot',
              message: 'db/* не должен зависеть от bot/*.',
            },
            {
              target: './src/db',
              from: './src/flows',
              message: 'db/* не должен зависеть от flows/*.',
            },
            {
              target: './src/db',
              from: './src/services',
              message: 'db/* не должен зависеть от services/*.',
            },

            // config — желательно ни от кого не зависеть
            {
              target: './src/config',
              from: './src/bot',
              message: 'config/* не должен зависеть от bot/*.',
            },
            {
              target: './src/config',
              from: './src/flows',
              message: 'config/* не должен зависеть от flows/*.',
            },
            {
              target: './src/config',
              from: './src/services',
              message: 'config/* не должен зависеть от services/*.',
            },
            {
              target: './src/config',
              from: './src/db',
              message: 'config/* не должен зависеть от db/*.',
            },
          ],
        },
      ],
    },
  },

  // Prettier — последним
  eslintConfigPrettier,
]
