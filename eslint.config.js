import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default [
  ...compat.extends('alloy', 'alloy/react', 'alloy/typescript'),
  {
    files: ['src/**/*.{ts,tsx}'],
  },
]
