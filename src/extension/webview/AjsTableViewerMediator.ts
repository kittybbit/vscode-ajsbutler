import { AJS_TABLE_VIEWER_TYPE } from "./constant";
import { WebviewMediator } from "./WebviewMediator";
import { MyExtension } from "../MyExtension";
import { WebviewStore } from "./WebviewStore";
import { debouncedTableDocumentChangeFn } from "./tableDocument";

/**
 * Mediator for JP1/AJS table viewer.
 */
export class AjsTableViewerMediator extends WebviewMediator {
  public constructor(myExtension: MyExtension, store: WebviewStore) {
    super(
      myExtension,
      AJS_TABLE_VIEWER_TYPE,
      store,
      debouncedTableDocumentChangeFn(300),
    );
  }
}
