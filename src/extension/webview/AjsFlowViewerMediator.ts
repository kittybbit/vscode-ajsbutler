import { AJS_FLOW_VIEWER_TYPE } from "./constant";
import { WebviewMediator } from "./WebviewMediator";
import { MyExtension } from "../MyExtension";
import { WebviewStore } from "./WebviewStore";

/**
 * Mediator for JP1/AJS flow viewer.
 */
export class AjsFlowViewerMediator extends WebviewMediator {
  public static init(
    myExtension: MyExtension,
    store: WebviewStore,
  ): AjsFlowViewerMediator {
    console.log("invoke AjsFlowViewerMediator.init");
    return new AjsFlowViewerMediator(myExtension, store);
  }

  private constructor(myExtension: MyExtension, store: WebviewStore) {
    super(myExtension, AJS_FLOW_VIEWER_TYPE, store);
  }

  override dispose() {
    console.log("invoke AjsFlowViewerMediator.dispose.");
    super.dispose();
  }
}
