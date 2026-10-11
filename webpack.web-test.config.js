/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

const webpackConfigs = require("./webpack.config.js");
const productionWebConfig = webpackConfigs(
  { target: "web" },
  { mode: "production" },
).find((config) => config.entry?.web);
const productionEditorConfig = webpackConfigs(
  { target: "editor" },
  { mode: "production" },
).find((config) => config.entry?.tableViewer);

if (!productionWebConfig) {
  throw new Error("The production web webpack target is unavailable.");
}

if (!productionEditorConfig) {
  throw new Error("The production editor webpack target is unavailable.");
}

const webSmokeConfig = {
  ...productionWebConfig,
  name: "web-test",
  entry: "./src/test/suite/webSmoke.ts",
  output: {
    ...productionWebConfig.output,
    path: path.join(__dirname, "out/test/suite"),
    filename: "webSmoke.bundle.js",
    library: {
      type: "commonjs2",
    },
  },
  cache: {
    ...productionWebConfig.cache,
    name: "web-test-production",
  },
};

const accessibilityConfig = {
  ...productionEditorConfig,
  name: "web-test-accessibility",
  entry: "./src/test/fixtures/accessibilityDeepTreeBrowser.tsx",
  output: {
    ...productionEditorConfig.output,
    path: path.join(__dirname, "out/test/fixtures"),
    filename: "accessibilityDeepTree.bundle.js",
    library: {
      name: "accessibilityDeepTreeFixture",
      type: "window",
    },
  },
  cache: {
    ...productionEditorConfig.cache,
    name: "web-test-accessibility-production",
  },
};

module.exports = (env = {}) =>
  env.target === "accessibility" ? accessibilityConfig : webSmokeConfig;
