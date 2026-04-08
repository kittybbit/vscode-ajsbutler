import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { WebviewMediator } from "./WebviewMediator";
import { MyExtension } from "../MyExtension";
import { WebviewStore } from "./WebviewStore";
import { debouncedAjsDocumentChangeFn } from "./ajsDocument";

/**
 * Mediator for JP1/AJS table viewer.
 */
export class AjsTableViewerMediator extends WebviewMediator {
  public constructor(myExtension: MyExtension, store: WebviewStore) {
    super(
      myExtension,
      AJS_TABLE_VIEWER_TYPE,
      store,
      debouncedAjsDocumentChangeFn(300),
    );
  }
}
