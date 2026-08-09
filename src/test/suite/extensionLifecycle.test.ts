import * as assert from "assert";
import {
  createExtensionLifecycleActivatedEvent,
  createExtensionLifecycleDeactivatedEvent,
  createLegacyExtensionActivatedEvent,
  createLegacyExtensionDeactivatedEvent,
} from "../../application/telemetry/extensionLifecycleTelemetry";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "../../bootstrap/extension/MyExtension";
import {
  reportExtensionActivated,
  reportAndDisposeExtensionRuntime,
} from "../../bootstrap/extension/extensionLifecycle";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";

suite("Extension lifecycle", () => {
  test("reports activate telemetry", () => {
    const events: string[] = [];
    const extension = MyExtension.init({} as never, {
      report(event) {
        events.push(event.name);
      },
      dispose() {},
    });

    reportExtensionActivated(extension);

    assert.deepStrictEqual(events, [
      createLegacyExtensionActivatedEvent().name,
      createExtensionLifecycleActivatedEvent("desktop").name,
    ]);
    extension.dispose();
  });

  test("reports deactivate telemetry and disposes runtime", () => {
    const events: string[] = [];
    let disposeCount = 0;
    const telemetry: TelemetryPort = {
      report(event) {
        events.push(event.name);
      },
      dispose() {
        disposeCount += 1;
      },
    };
    const extension = MyExtension.init({} as never, telemetry);

    reportAndDisposeExtensionRuntime(extension);

    assert.deepStrictEqual(events, [
      createLegacyExtensionDeactivatedEvent().name,
      createExtensionLifecycleDeactivatedEvent("desktop").name,
    ]);
    assert.strictEqual(disposeCount, 1);
  });

  test("ignores missing runtime on deactivate", () => {
    reportAndDisposeExtensionRuntime(undefined);
    assert.ok(true);
  });

  test("keeps lifecycle reporting and disposal non-throwing when the SDK fails", () => {
    const telemetry = new VscodeTelemetryAdapter("test", () => ({
      sendTelemetryEvent() {
        throw new Error("telemetry failed");
      },
      dispose() {
        throw new Error("telemetry disposal failed");
      },
    }));
    const extension = MyExtension.init({} as never, telemetry);

    assert.doesNotThrow(() => reportExtensionActivated(extension));
    assert.doesNotThrow(() => reportAndDisposeExtensionRuntime(extension));
  });
});
