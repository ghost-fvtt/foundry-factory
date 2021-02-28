import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist/',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({})],
  external: ['commander', 'fs-extra', 'path', 'chalk', 'fs/promises', 'url', 'ora', 'nunjucks', 'inquirer'],
};
