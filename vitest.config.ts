import { defineConfig } from "vitest/config";

const include: string[] = [];

const testIncludes = [
  {
    dir: '"./packages/**/{__test__,test}/**/*.{ts,js}"',
  },
];

for (let index = 0; index < testIncludes.length; index++) {
  const element = testIncludes[index];
  include.push(element.dir);
}

export default defineConfig((config) => {
  return {
    test: {
      // 包含 packages下所有文件的 __test__ 文件夹下的所有文件
      include,
      // 排除 packages examples下所有文件的 node_modules 和 dist 文件夹
      exclude: [
        "./packages/**/{node_modules,dist}/**",
        "./examples/**/{node_modules,dist}/**",
      ],
    },
  };
});

