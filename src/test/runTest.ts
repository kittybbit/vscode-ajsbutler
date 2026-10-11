import * as path from "path";
import { runTests } from "@vscode/test-electron";

export interface DesktopTestTarget {
  version: "stable" | "1.75.0";
  extensionTestsPath: string;
}

export function selectDesktopTestTarget(
  args: readonly string[],
): DesktopTestTarget {
  if (args.length === 0) {
    return {
      version: "stable",
      extensionTestsPath: path.resolve(__dirname, "suite/desktopTestEntry"),
    };
  }
  if (args.length === 1 && args[0] === "--minimum") {
    return {
      version: "1.75.0",
      extensionTestsPath: path.resolve(__dirname, "suite/webSmoke.bundle.js"),
    };
  }
  throw new Error(`Unsupported Desktop test arguments: ${args.join(" ")}`);
}

async function main(): Promise<void> {
  try {
    const target = selectDesktopTestTarget(process.argv.slice(2));
    console.log(
      `[desktop-test] launching VS Code ${target.version}: ${target.extensionTestsPath}`,
    );
    await runTests({
      ...target,
      extensionDevelopmentPath: path.resolve(__dirname, "../../"),
    });
    console.log("[desktop-test] host completed successfully");
  } catch (error) {
    console.error("[desktop-test] launch or test execution failed", error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void main();
}
