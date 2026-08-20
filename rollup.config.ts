import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/ica-shopping-list-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    nodeResolve({ browser: true, extensions: [".mjs", ".js", ".json", ".node", ".ts"] }),
    typescript({ tsconfig: "tsconfig.build.json" }),
    terser({ format: { comments: false } }),
  ],
};
