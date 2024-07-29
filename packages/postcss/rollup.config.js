import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
    ],
    external: ['@stilvoll/postcss/esm'],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**'],
        exclude: ['**/*.test.*'],
        compilerOptions: {
          emitDeclarationOnly: true,
        },
      }),
    ],
  },
  {
    input: 'src/plugin.ts',
    output: [
      {
        file: 'dist/esm.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**'],
        exclude: ['**/*.test.*'],
        compilerOptions: {
          emitDeclarationOnly: true,
        },
      }),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
