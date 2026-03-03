const ALLOWED_SCOPES = [
  'tooling',
  'repo',
  'config',
  'ci',
  'app',
  'router',
  'api',
  'query',
  'mocks',
  'shared',
  'ui',
  'entities',
  'features',
  'widgets',
  'pages',
  'docs',
]

module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: './scripts/commitlint-formatter.cjs',

  // Разрешаем merge-коммиты (по желанию)
  ignores: [(msg) => msg.startsWith('Merge ')],

  // Парсим заголовок вида: feat(scope): subject
  parserPreset: {
    name: 'conventional-changelog-conventionalcommits',
    parserOpts: {
      headerPattern: /^([^\s:(]+)(?:\(([^)]+)\))?:\s*(.*)$/u,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    // scope опционален, но если указан — только из списка
    'scope-enum': [2, 'always', ALLOWED_SCOPES],
    'scope-case': [2, 'always', 'kebab-case'],

    // чтобы кириллица в subject не мешала:
    'subject-case': [0],
    'subject-full-stop': [0],
    'header-max-length': [2, 'always', 100],
  },
}
