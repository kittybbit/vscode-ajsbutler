import * as assert from "assert";
import type { Edge, Node } from "@xyflow/react";
import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import {
  buildFlowNodeDetail,
  collectRelatedUnitIds,
  summarizeFlowNodeRelationships,
} from "../../presentation/webview/editor/ajsFlow/flowNodeDetail";
import {
  buildFlowNodeDetailActions,
  buildFlowNodeDetailChips,
  buildFlowNodeDetailRows,
} from "../../presentation/webview/editor/ajsFlow/FlowNodeDetailPanel";
import { reduceSelectedFlowNodeId } from "../../presentation/webview/editor/ajsFlow/useSelectedFlowNodeState";
import { getSharedUnitDetailPaneActionLabels } from "../../presentation/webview/editor/shared/SharedUnitDetailPane";
import type { AjsNode } from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";

const edges: Edge[] = [
  { id: "a-b", source: "a", target: "b" },
  { id: "b-c", source: "b", target: "c" },
  { id: "c-a", source: "c", target: "a" },
  { id: "b-d", source: "b", target: "d" },
  { id: "b-b", source: "b", target: "b" },
];

const unit = (id: string, parentId?: string): AjsUnit => ({
  id,
  name: id.toUpperCase(),
  unitAttribute: "",
  unitType: "j",
  absolutePath: `/root/${id}`,
  depth: parentId ? 2 : 1,
  parentId,
  isRoot: !parentId,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 0, v: 0 },
  parameters: [],
  relations: [],
  children: [],
});

suite("Flow Node Detail", () => {
  test("selection transitions clear on close and context replacement", () => {
    const selected = reduceSelectedFlowNodeId(undefined, {
      type: "select",
      unitId: "b",
    });

    assert.strictEqual(selected, "b");
    assert.strictEqual(
      reduceSelectedFlowNodeId(selected, { type: "clear" }),
      undefined,
    );
    assert.strictEqual(
      reduceSelectedFlowNodeId(selected, { type: "contextChanged" }),
      undefined,
    );
  });

  test("relationship traversal terminates on cycles and excludes the origin", () => {
    assert.deepStrictEqual(
      [...collectRelatedUnitIds("b", edges, "upstream")].sort(),
      ["a", "c"],
    );
    assert.deepStrictEqual(
      [...collectRelatedUnitIds("b", edges, "downstream")].sort(),
      ["a", "c", "d"],
    );
    assert.deepStrictEqual(summarizeFlowNodeRelationships("b", edges), {
      predecessorCount: 1,
      successorCount: 2,
      upstreamCount: 2,
      downstreamCount: 3,
    });
  });

  test("builds lightweight graph context without definition contents", () => {
    const units = new Map<string, AjsUnit>([
      ["parent", unit("parent")],
      ["b", { ...unit("b", "parent"), unitType: "n" }],
    ]);
    const node = {
      id: "b",
      type: "jobnet",
      position: { x: 0, y: 0 },
      data: {
        unitId: "b",
        absolutePath: "/root/b",
        unitDefinition: {
          absolutePath: "/root/b",
          rawData: "secret definition",
          commands: [],
          commandBuilders: [],
        },
        label: "B",
        comment: "summary",
        ty: "n",
        isAncestor: false,
        isCurrent: false,
        isRootJobnet: false,
        hasSchedule: true,
        hasWaitedFor: true,
        isSearchMatch: true,
        isCurrentSearchResult: true,
        canExpandNested: true,
        dialogData: undefined,
        setDialogData: () => undefined,
        currentUnitId: "parent",
        setCurrentUnitId: () => undefined,
      },
    } satisfies Node<AjsNode>;

    const detail = buildFlowNodeDetail(node, edges, units);

    assert.deepStrictEqual(detail, {
      unitId: "b",
      name: "B",
      unitType: "n",
      groupType: undefined,
      comment: "summary",
      absolutePath: "/root/b",
      parentName: "PARENT",
      parentPath: "/root/parent",
      hasSchedule: true,
      hasWaitedFor: true,
      canExpandNested: true,
      isSearchMatch: true,
      isCurrentSearchResult: true,
      canOpenAsScope: true,
      predecessorCount: 1,
      successorCount: 2,
      upstreamCount: 2,
      downstreamCount: 3,
    });
    assert.strictEqual("rawData" in (detail ?? {}), false);
  });

  test("limits scope actions to non-current jobnets and conditions", () => {
    const baseNode = {
      id: "b",
      position: { x: 0, y: 0 },
      data: {
        unitId: "b",
        absolutePath: "/root/b",
        unitDefinition: {
          absolutePath: "/root/b",
          rawData: "",
          commands: [],
          commandBuilders: [],
        },
        label: "B",
        ty: "n",
        isAncestor: false,
        isCurrent: false,
        isRootJobnet: false,
        hasSchedule: false,
        hasWaitedFor: false,
        setDialogData: () => undefined,
        setCurrentUnitId: () => undefined,
      },
    } satisfies Omit<Node<AjsNode>, "type">;
    const units = new Map([["b", unit("b")]]);

    assert.strictEqual(
      buildFlowNodeDetail({ ...baseNode, type: "condition" }, [], units)
        ?.canOpenAsScope,
      true,
    );
    assert.strictEqual(
      buildFlowNodeDetail({ ...baseNode, type: "job" }, [], units)
        ?.canOpenAsScope,
      false,
    );
    assert.strictEqual(
      buildFlowNodeDetail(
        {
          ...baseNode,
          type: "jobnet",
          data: { ...baseNode.data, isCurrent: true },
        },
        [],
        units,
      )?.canOpenAsScope,
      false,
    );
  });

  test("maps flow detail into shared detail pane rows and actions", () => {
    const detail = {
      unitId: "b",
      name: "B",
      unitType: "n",
      comment: "summary",
      absolutePath: "/root/b",
      parentName: "PARENT",
      parentPath: "/root/parent",
      hasSchedule: true,
      hasWaitedFor: false,
      canExpandNested: true,
      isSearchMatch: true,
      isCurrentSearchResult: false,
      canOpenAsScope: true,
      predecessorCount: 1,
      successorCount: 2,
      upstreamCount: 3,
      downstreamCount: 4,
    } as const;

    assert.deepStrictEqual(buildFlowNodeDetailRows(detail), [
      { label: "Comment", value: "summary" },
      { label: "Absolute path", value: "/root/b" },
      { label: "Parent unit", value: "PARENT (/root/parent)" },
    ]);
    assert.deepStrictEqual(
      buildFlowNodeDetailChips(detail, true).map((chip) => [
        chip.label,
        chip.active,
      ]),
      [
        ["Schedule", true],
        ["Waited for", false],
        ["Nested expandable", true],
        ["Search match", true],
        ["Current search result", false],
        ["Relationship focus", true],
      ],
    );
    assert.deepStrictEqual(
      getSharedUnitDetailPaneActionLabels(
        buildFlowNodeDetailActions({
          canOpenAsScope: true,
          focusModeEnabled: false,
          onOpenDefinition: () => undefined,
          onOpenScope: () => undefined,
          onToggleFocusMode: () => undefined,
        }),
      ),
      ["Focus relationships", "Open definition details", "Open as graph scope"],
    );
  });
});
