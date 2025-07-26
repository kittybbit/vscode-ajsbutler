import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { WebviewMediator } from "./WebviewMediator";
import { MyExtension } from "../MyExtension";
import { WebviewStore } from "./WebviewStore";

/**
 * Mediator for JP1/AJS table viewer.
 */
export class AjsTableViewerMediator extends WebviewMediator {
  public static init(
    myExtension: MyExtension,
    store: WebviewStore,
  ): AjsTableViewerMediator {
    console.log("invoke AjsTableViewerMediator.init");
    return new AjsTableViewerMediator(myExtension, store);
  }

  private constructor(myExtension: MyExtension, store: WebviewStore) {
    super(myExtension, AJS_TABLE_VIEWER_TYPE, store);
  }

  override dispose() {
    console.log("invoke AjsTableViewerMediator.dispose.");
    super.dispose();
  }
}
