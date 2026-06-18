import * as vscode from "vscode";
import { createBuildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";
import { createBuildUnitList } from "../../application/unit-list/buildUnitList";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { MyExtension } from "../MyExtension";
import {
  reportExtensionActivated,
  reportAndDisposeExtensionRuntime,
} from "./extensionLifecycle";
import { createExtensionRuntime } from "./extensionRuntime";
import { createExtensionSubscriptions } from "./extensionSubscriptions";

export type ActivatedExtension = {
  myExtension: MyExtension;
};

export const activateExtension = (
  context: vscode.ExtensionContext,
): ActivatedExtension => {
  const myExtension = createExtensionRuntime(context);
  const parser = new AntlrAjsParser();

  context.subscriptions.push(
    ...createExtensionSubscriptions(
      myExtension.context,
      myExtension.telemetry,
      {
        buildSyntaxDiagnostics: createBuildSyntaxDiagnostics(parser),
        buildUnitList: createBuildUnitList(parser),
      },
    ),
  );

  reportExtensionActivated(myExtension);

  return {
    myExtension,
  };
};

export const deactivateExtension = (
  activatedExtension: ActivatedExtension | undefined,
): void => {
  reportAndDisposeExtensionRuntime(activatedExtension?.myExtension);
};
