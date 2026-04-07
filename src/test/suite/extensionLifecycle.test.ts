import * as assert from "assert";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "../../extension/MyExtension";
import {
  reportExtensionActivated,
  reportAndDisposeExtensionRuntime,
} from "../../extension/bootstrap/extensionLifecycle";
import { Telemetry } from "../../extension/constant";

suite("Extension lifecycle", () => {
  test("reports activate telemetry", () => {
    const events: string[] = [];
    const extension = MyExtension.init({} as never, {
      trackEvent(eventName) {
        events.push(eventName);
      },
      dispose() {},
    });

    reportExtensionActivated(extension);

    assert.deepStrictEqual(events, [Telemetry.ExtensionActivate]);
    extension.dispose();
  });

  test("reports deactivate telemetry and disposes runtime", () => {
    const events: string[] = [];
    let disposed = false;
    const telemetry: TelemetryPort = {
      trackEvent(eventName) {
        events.push(eventName);
      },
      dispose() {
        disposed = true;
      },
    };
    const extension = MyExtension.init({} as never, telemetry);

    reportAndDisposeExtensionRuntime(extension);

    assert.deepStrictEqual(events, [Telemetry.ExtensionDeactivate]);
    assert.strictEqual(disposed, true);
  });

  test("ignores missing runtime on deactivate", () => {
    reportAndDisposeExtensionRuntime(undefined);
    assert.ok(true);
  });
});
