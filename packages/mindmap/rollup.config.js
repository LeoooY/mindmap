import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
const alias_config = {
  entries: [
    // { find: '@xx', replacement: path.resolve(__dirname, 'src') },
  ],
};
const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return id => pattern.test(id);
};
export default [
  // CommonJS
  {
    input: 'src/index.tsx',
    output: { dir: 'dist/lib', format: 'cjs', indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      alias(alias_config),
      nodeResolve({ extensions }),
      commonjs(),
      typescript({
        declaration: true, // 配置输出.d.ts
        declarationMap: true, // 输出从.d.ts映射回.ts的map，让vscode等ide可以做变量声明跳转
        emitDeclarationOnly: true, // 只输出.d.ts，不生成编译后的js结果
        outDir: 'dist/lib',
        target: 'esnext', // ecmascript版本:最新
        module: 'commonjs',
        jsx: 'react-jsx',
      }),
      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
    ],
  },

  // ES
  {
    input: 'src/index.tsx',
    output: { dir: 'dist/es', format: 'es', indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      alias(alias_config),
      nodeResolve({ extensions }),
      commonjs(), // 将（node_module）cmd的模块转为es模块
      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
    ],
  },

  // ES for Browsers

  // UMD Development

  // UMD Production
];
