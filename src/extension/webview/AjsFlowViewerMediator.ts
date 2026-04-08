import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { WebviewMediator } from "./WebviewMediator";
import { MyExtension } from "../MyExtension";
import { WebviewStore } from "./WebviewStore";
import { debouncedAjsDocumentChangeFn } from "./ajsDocument";

/**
 * Mediator for JP1/AJS flow viewer.
 */
export class AjsFlowViewerMediator extends WebviewMediator {
  public constructor(myExtension: MyExtension, store: WebviewStore) {
    super(
      myExtension,
      AJS_FLOW_VIEWER_TYPE,
      store,
      debouncedAjsDocumentChangeFn(300),
    );
  }
}
