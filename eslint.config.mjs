// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({}).append({
  rules: {
    // vue
    'vue/multi-word-component-names': 0,
    'vue/valid-template-root': 1,
    'vue/return-in-computed-property': 1,
    'vue/no-side-effects-in-computed-properties': 1,
    'vue/html-self-closing': 0,
    'vue/no-unused-vars': 1,
    'vue/no-mutating-props': 1,
    'vue/valid-v-for': 1,
    'vue/no-multiple-template-root': 1,

    // typescript
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-non-null-asserted-optional-chain': 1,
    '@typescript-eslint/no-dynamic-delete': 1,
    '@typescript-eslint/unified-signatures': 0,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/no-extraneous-class': 1,
    '@typescript-eslint/no-empty-object-type': 0,

    // other
    'no-useless-escape': 0,
    'prefer-rest-params': 1,
    'prefer-const': 1,
    'no-empty': 1,
  },
  ignores: ['**/*.js'],
});
