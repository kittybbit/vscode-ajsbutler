/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

const productionWebConfig = require("./webpack.config.js")(
  { target: "web" },
  { mode: "production" },
).find((config) => config.entry?.web);

if (!productionWebConfig) {
  throw new Error("The production web webpack target is unavailable.");
}

module.exports = {
  ...productionWebConfig,
  name: "web-test",
  entry: "./src/test/suite/webSmokeWebEntry.ts",
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
