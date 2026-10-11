import * as assert from "assert";
import { runDesktopTestEntry } from "./desktopTestEntry";

suite("Desktop suite loading boundary", () => {
  test("loads and executes the runner exactly once", async () => {
    let loads = 0;
    let runs = 0;
    await runDesktopTestEntry(
      async () => {
        loads++;
        return {
          run: async () => {
            runs++;
          },
        };
      },
      () => undefined,
    );
    assert.strictEqual(loads, 1);
    assert.strictEqual(runs, 1);
  });

  test("reports loading rejection and preserves its original cause", async () => {
    const cause = new Error("module unavailable");
    const reports: Array<{ message: string; cause?: unknown }> = [];
    await assert.rejects(
      runDesktopTestEntry(
        async () => {
          throw cause;
        },
        (message, error) => reports.push({ message, cause: error }),
      ),
      (error) => error === cause,
    );
    assert.ok(
      reports.some(
        (report) =>
          report.message.includes("loading failed") && report.cause === cause,
      ),
    );
    assert.ok(
      !reports.some((report) => report.message.endsWith("runner loaded")),
    );
  });

  test("execution rejection is preserved without being reported as loading failure", async () => {
    const cause = new Error("case failed");
    const reports: string[] = [];
    await assert.rejects(
      runDesktopTestEntry(
        async () => ({
          run: async () => {
            throw cause;
          },
        }),
        (message) => reports.push(message),
      ),
      (error) => error === cause,
    );
    assert.ok(reports.some((report) => report.endsWith("runner loaded")));
    assert.ok(!reports.some((report) => report.includes("loading failed")));
  });
});
