import * as vscode from "vscode";
import { TelemetryReporter } from "@vscode/extension-telemetry";

/**
 * Runtime context of this extension.
 */
export class MyExtension {
  #reporter: TelemetryReporter;
  #context: vscode.ExtensionContext;

  public static init(context: vscode.ExtensionContext): MyExtension {
    const myExtension = new MyExtension();
    context.subscriptions.push(myExtension.#reporter);
    myExtension.#context = context;
    return myExtension;
  }

  private constructor() {
    console.log("initializing mycontext.");
    this.#reporter = new TelemetryReporter(CONNECTION_STRING);
    console.log(`connection string: ${CONNECTION_STRING}`);
  }

  get reporter(): TelemetryReporter {
    return this.#reporter;
  }

  get context(): vscode.ExtensionContext {
    return this.#context;
  }
}
