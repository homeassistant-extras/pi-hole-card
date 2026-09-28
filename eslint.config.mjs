import { createCardEslintConfig } from '@homeassistant-extras/config/eslint/card';

export default createCardEslintConfig({
  tsconfigRootDir: import.meta.dirname,
});
