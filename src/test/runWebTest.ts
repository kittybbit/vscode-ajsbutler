import * as path from "path";
import { runTests } from "@vscode/test-web";

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");
    const extensionTestsPath = path.resolve(__dirname, "./suite/webSmoke");
    const testRunnerDataDir = path.resolve(
      extensionDevelopmentPath,
      ".vscode-test-web",
    );

    await runTests({
      browserType: "chromium",
      headless: true,
      esm: true,
      quality: "stable",
      port: 3210,
      testRunnerDataDir,
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error(`Failed to run web tests. ${err}`);
    process.exit(1);
  }
}

main();
