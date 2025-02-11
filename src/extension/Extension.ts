import * as vscode from "vscode";
import TelemetryReporter from "@vscode/extension-telemetry";

/**
 * Context of this extension.
 */
export class Extension {
  private static _reporter: TelemetryReporter;

  public static init(context: vscode.ExtensionContext): TelemetryReporter {
    new Extension();
    context.subscriptions.push(Extension._reporter);
    return Extension._reporter;
  }

  private constructor() {
    console.log("initializing extension context.");
    Extension._reporter = new TelemetryReporter(CONNECTION_STRING);
    console.log(`connection string: ${CONNECTION_STRING}`);
  }

  static get reporter(): TelemetryReporter {
    return Extension._reporter;
  }
}
