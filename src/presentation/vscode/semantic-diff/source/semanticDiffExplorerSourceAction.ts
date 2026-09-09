import type {
  SemanticDiffSourceActionDeps,
  SemanticDiffSourceActionRequest,
  SemanticDiffSourceActionResult,
} from "./semanticDiffExplorerSourceTypes";
import { runSemanticDiffExplorerSourceAction } from "./semanticDiffExplorerSourceActionRunner";
export type {
  SemanticDiffSourceActionDeps,
  SemanticDiffSourceActionFailureCode,
  SemanticDiffSourceActionRequest,
  SemanticDiffSourceActionResult,
} from "./semanticDiffExplorerSourceTypes";

export const executeSemanticDiffExplorerSourceAction = async (
  request: SemanticDiffSourceActionRequest,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> =>
  runSemanticDiffExplorerSourceAction(request, deps);
