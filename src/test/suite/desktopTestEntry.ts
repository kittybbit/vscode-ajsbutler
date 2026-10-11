export interface DesktopTestRunner {
  run(): Promise<void>;
}

export async function runDesktopTestEntry(
  loadRunner: () => Promise<DesktopTestRunner>,
  report: (message: string, cause?: unknown) => void,
): Promise<void> {
  report("[desktop-test] loading suite runner");
  let runner: DesktopTestRunner;
  try {
    runner = await loadRunner();
  } catch (error) {
    report("[desktop-test] suite runner loading failed", error);
    throw error;
  }
  report("[desktop-test] suite runner loaded");
  await runner.run();
}

export function run(): Promise<void> {
  return runDesktopTestEntry(
    () => import("./index"),
    (message, cause) => {
      if (cause === undefined) {
        console.log(message);
      } else {
        console.error(message, cause);
      }
    },
  );
}
