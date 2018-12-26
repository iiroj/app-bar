import typescript from "rollup-plugin-typescript2";
import minify from "rollup-plugin-babel-minify";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/index.tsx",

  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],

  external: [...Object.keys(pkg.peerDependencies || {})],

  plugins: [
    typescript({
      typescript: require("typescript")
    }),
    production &&
      minify({
        comments: false
      })
  ]
};
