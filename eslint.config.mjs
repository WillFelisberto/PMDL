import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const eslintConfig = [
  {
    rules: {
      'newline-before-return': 2,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_'
        }
      ]
    },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['**/*.test.tsx'] // Exclui arquivos de teste
  },
  ...compat.config({
    extends: ['eslint:recommended', 'next'],
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['**/*.test.tsx'],
    rules: {
      'newline-before-return': 2,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }),
  {
    rules: {
      'newline-before-return': 2,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_'
        }
      ]
    },
    ignores: ['**/*.test.tsx'] // Adiciona uma regra extra de ignore
  }
];

export default eslintConfig;
