import * as assert from "assert";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as vscode from "vscode";
import { runDesktopTestEntry } from "../suite/desktopTestEntry";

const fixturePath = path.resolve(
  __dirname,
  "../../../src/test/fixtures/flow-svg-web/flow-svg-fixture",
);

const wait = async (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

type SmokeCompletion = Readonly<{
  status: "passed" | "failed";
  message?: string;
}>;

const writeFinishedSignal = async (
  signalPath: string,
  signal: SmokeCompletion,
): Promise<void> => {
  const destination = `${signalPath}.finished`;
  const temporaryPath = `${destination}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(signal), "utf8");
  await fs.rename(temporaryPath, destination);
};

const readSmokeCompletion = async (
  signalPath: string,
  suffix: "done",
  timeoutMilliseconds = 60_000,
): Promise<SmokeCompletion> => {
  const completionPath = `${signalPath}.${suffix}`;
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    try {
      return JSON.parse(
        await fs.readFile(completionPath, "utf8"),
      ) as SmokeCompletion;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await wait(100);
    }
  }
  throw new Error(`Timed out waiting for Desktop smoke ${suffix} signal.`);
};

const override = (
  target: object,
  key: string,
  value: unknown,
): (() => void) => {
  const previous = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  });
  return () => {
    if (previous) Object.defineProperty(target, key, previous);
    else Reflect.deleteProperty(target, key);
  };
};

const openFlowViewerFromWorkbench = async (): Promise<void> => {
  const signalPath = process.env.FLOW_IMAGE_SMOKE_SIGNAL_PATH;
  if (!signalPath) throw new Error("Desktop smoke signal path is missing.");
  const fixtureDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "ajs-flow-image-desktop-"),
  );
  const sourcePath = path.join(fixtureDirectory, "flow-source.svg");
  await fs.copyFile(fixturePath, sourcePath);
  const sourceUri = vscode.Uri.file(sourcePath);
  const originalBytes = await fs.readFile(sourcePath);
  const sourceDocument = await vscode.workspace.openTextDocument(sourceUri);
  const jp1Document = await vscode.languages.setTextDocumentLanguage(
    sourceDocument,
    "jp1ajs",
  );
  await vscode.window.showTextDocument(jp1Document, { preview: false });

  const errors: string[] = [];
  const restorers: (() => void)[] = [];
  const originalShowErrorMessage = vscode.window.showErrorMessage.bind(
    vscode.window,
  );
  let verification: SmokeCompletion = { status: "failed" };
  try {
    restorers.push(
      override(vscode.window, "showSaveDialog", async () => sourceUri),
      override(vscode.window, "showErrorMessage", async (message: string) => {
        errors.push(message);
        return originalShowErrorMessage(message);
      }),
    );
    await fs.writeFile(`${signalPath}.ready`, "ready", "utf8");
    const completion = await readSmokeCompletion(signalPath, "done");
    assert.strictEqual(completion.status, "passed", completion.message);
    const messages = vscode.env.language.toLowerCase().startsWith("ja")
      ? (await import("../../resource/i18n/message_ja")).ja
      : (await import("../../resource/i18n/message_en")).en;
    assert.deepStrictEqual(errors, [messages["flow.svg.save.sourceConflict"]]);
    assert.deepStrictEqual(await fs.readFile(sourcePath), originalBytes);
    verification = { status: "passed" };
  } catch (error) {
    verification = { status: "failed", message: String(error) };
    throw error;
  } finally {
    restorers.reverse().forEach((restore) => restore());
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
    await fs.rm(fixtureDirectory, { recursive: true, force: true });
    await writeFinishedSignal(signalPath, verification);
  }
};

export async function run(): Promise<void> {
  if (process.env.FLOW_IMAGE_SMOKE_ONLY !== "true") {
    await runDesktopTestEntry(
      () => import("../suite/index"),
      (message, cause) => {
        if (cause === undefined) console.log(message);
        else console.error(message, cause);
      },
    );
  }
  await vscode.extensions
    .getExtension("kittybbit.vscode-ajsbutler")
    ?.activate();
  await openFlowViewerFromWorkbench();
}
