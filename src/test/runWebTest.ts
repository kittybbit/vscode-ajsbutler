import * as fs from "fs/promises";
import * as path from "path";
import { runTests } from "@vscode/test-web";

const ensureWorkbenchCssAlias = async (buildLocation: string) => {
  const workbenchDir = path.join(buildLocation, "out/vs/workbench");
  const targetCss = path.join(workbenchDir, "workbench.web.main.css");
  const internalCss = path.join(
    workbenchDir,
    "workbench.web.main.internal.css",
  );

  try {
    await fs.access(targetCss);
  } catch {
    await fs.copyFile(internalCss, targetCss);
  }
};

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");
    const extensionTestsPath = path.resolve(__dirname, "./suite/webSmoke");
    const testRunnerDataDir = path.resolve(
      extensionDevelopmentPath,
      ".vscode-test-web",
    );
    const { downloadAndUnzipVSCode } = await import(
      "@vscode/test-web/out/server/download.js"
    );
    const vscodeBuild = await downloadAndUnzipVSCode(
      testRunnerDataDir,
      "stable",
    );

    await ensureWorkbenchCssAlias(vscodeBuild.location);

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
