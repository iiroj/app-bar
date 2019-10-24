import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const external = [...Object.keys(pkg.peerDependencies)];

const plugins = [
  typescript({ typescript: require("typescript") }),
  production && terser()
];

export default [
  {
    input: "index.tsx",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    external,
    plugins
  },
  {
    input: "index.tsx",
    output: {
      file: pkg.browser,
      format: "umd",
      globals: {
        react: "React"
      },
      name: "ReactStickyNav"
    },
    external,
    plugins: [resolve(), commonjs(), ...plugins]
  }
];
