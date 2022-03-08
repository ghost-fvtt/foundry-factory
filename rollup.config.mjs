import shebang from 'rollup-plugin-preserve-shebang';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist/',
    entryFileNames: '[name].mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({ noEmitOnError: true }), shebang()],
  external: ['chalk', 'child_process', 'commander', 'fs-extra', 'inquirer', 'nunjucks', 'ora', 'path', 'url', 'util'],
};
