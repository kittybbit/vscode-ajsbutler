import * as vscode from "vscode";
import * as os from "os";
import { MyAppResource } from "@ui-component/editor/MyContexts";
import { ResourceEventType } from "./types";

export const resource = (e: ResourceEventType, panel: vscode.WebviewPanel) => {
  console.log(`post a message of resource. (${panel.title})`);
  const data: MyAppResource = {
    ...(e.data as MyAppResource),
    isDarkMode:
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
    lang: vscode.env.language,
    os: os.platform().toLowerCase(),
  };
  panel.webview.postMessage({
    type: "resource",
    data: data,
  });
};
