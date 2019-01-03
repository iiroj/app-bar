import commonjs from 'rollup-plugin-commonjs';
import minify from "rollup-plugin-babel-minify";
import resolve from 'rollup-plugin-node-resolve';
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const external = [...Object.keys(pkg.peerDependencies)]

const plugins = [
  typescript({ typescript: require("typescript") }),
  production && minify({ comments: false })
]

export default [
  {
    input: "src/index.tsx",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    external,
    plugins
  },
  {
    input: "src/index.tsx",
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'appBar'
    },
    external,
    plugins: [
      resolve(),
      commonjs(),
      ...plugins
    ]
  }
];
