import type {
  AjsGroupType,
  AjsParameter,
  AjsRelation,
  AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import type { FlowGraphSemanticDiffOverlay } from "./buildFlowGraphCore";
import {
  toFlowGraphDocumentDto,
  toFlowGraphUnitDto,
} from "./flowGraphDocumentProjection";
import { validateFlowGraphDocument } from "./flowGraphDocumentValidation";

export type FlowGraphParameterDto = AjsParameter;
export type FlowGraphRelationDto = AjsRelation;

export type FlowGraphUnitDto = {
  id: string;
  name: string;
  unitAttribute: string;
  permission?: string;
  jp1Username?: string;
  jp1ResourceGroup?: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  comment?: string;
  absolutePath: string;
  depth: number;
  parentId?: string;
  isRoot: boolean;
  isRecovery?: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  layout: { h: number; v: number };
  parameters: FlowGraphParameterDto[];
  relations: FlowGraphRelationDto[];
  children: FlowGraphUnitDto[];
};

export type FlowGraphDocumentDto = {
  rootUnits: FlowGraphUnitDto[];
  /** Optional additive semantic-diff state; null clears only the overlay. */
  semanticDiffOverlay?: FlowGraphSemanticDiffOverlay | null;
};

export type FlowGraphDocumentIssueCode =
  | "invalid_document"
  | "invalid_unit"
  | "invalid_layout"
  | "duplicate_unit_id"
  | "duplicate_absolute_path"
  | "inconsistent_parent"
  | "parent_cycle"
  | "invalid_relation"
  | "invalid_semantic_diff_overlay";

export type FlowGraphDocumentIssue = {
  code: FlowGraphDocumentIssueCode;
  message: string;
  unitPath?: string;
};

export type FlowGraphDocumentIndex = {
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
  unitByAbsolutePath: ReadonlyMap<string, FlowGraphUnitDto>;
};

export type FlowGraphDocumentValidationResult =
  | {
      status: "available";
      document: FlowGraphDocumentDto;
      index: FlowGraphDocumentIndex;
      issues: FlowGraphDocumentIssue[];
    }
  | { status: "unavailable"; issues: FlowGraphDocumentIssue[] };

export type ValidatedFlowGraphDocument = Extract<
  FlowGraphDocumentValidationResult,
  { status: "available" }
>;

export {
  toFlowGraphDocumentDto,
  toFlowGraphUnitDto,
  validateFlowGraphDocument,
};
