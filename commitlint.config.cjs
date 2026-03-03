const ALLOWED_SCOPES = [
  'tooling', 'repo', 'config', 'ci',
  'app', 'router',
  'api', 'query', 'mocks',
  'shared', 'ui', 'entities', 'features', 'widgets', 'pages',
  'docs',
];

const TASK_RE = /^[A-Z][A-Z0-9]{1,9}-\d+$/; // ABC-123

module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: './scripts/commitlint-formatter.cjs',

  // Разрешаем merge-коммиты (по желанию)
  ignores: [(msg) => msg.startsWith('Merge ')],

  // Парсим заголовок вида: ABC-123 feat(scope): subject
  parserPreset: {
    name: 'conventional-changelog-conventionalcommits',
    parserOpts: {
      headerPattern:
        /^(?:([A-Z][A-Z0-9]{1,9}-\d+)\s+)?([^\s:(]+)(?:\(([^)]+)\))?:\s*(.*)$/u,
      headerCorrespondence: ['ticket', 'type', 'scope', 'subject'],
    },
  }
,



  plugins: [
    {
      rules: {
        // Ключ задачи обязателен и должен быть корректного формата
        'ticket-required': (parsed) => {
          const ticket = parsed.ticket || '';
          const ok = TASK_RE.test(ticket);
          return [
            ok,
            'В начале сообщения нужен ключ задачи вида ABC-123. Пример: ABC-123 feat(api): добавить ...',
          ];
        },
      },
    },
  ],

  rules: {
    // scope опционален, но если указан — только из списка
    'scope-enum': [2, 'always', ALLOWED_SCOPES],
    'scope-case': [2, 'always', 'kebab-case'],

    // наш новый must-have
    'ticket-required': [2, 'always'],

    // чтобы кириллица в subject не мешала:
    'subject-case': [0],
    'subject-full-stop': [0],
    'header-max-length': [2, 'always', 100],
  },
};
