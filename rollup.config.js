import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist/',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({})],
};
