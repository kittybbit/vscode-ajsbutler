import * as vscode from "vscode";
import { TelemetryPort } from "../application/telemetry/TelemetryPort";

/**
 * Runtime context of this extension.
 */
export class MyExtension {
  #telemetry: TelemetryPort;
  #context: vscode.ExtensionContext;

  public static init(
    context: vscode.ExtensionContext,
    telemetry: TelemetryPort,
  ): MyExtension {
    return new MyExtension(context, telemetry);
  }

  private constructor(
    context: vscode.ExtensionContext,
    telemetry: TelemetryPort,
  ) {
    console.log("initializing mycontext.");
    this.#context = context;
    this.#telemetry = telemetry;
  }

  get telemetry(): TelemetryPort {
    return this.#telemetry;
  }

  get context(): vscode.ExtensionContext {
    return this.#context;
  }

  dispose(): void {
    this.#telemetry.dispose();
  }
}
