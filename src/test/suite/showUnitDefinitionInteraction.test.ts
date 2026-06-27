import * as assert from "assert";
import React from "react";
import type { KeyboardEvent } from "react";
import { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";
import type { UnitListRowView } from "../../application/unit-list/buildUnitListView";
import {
  handleClickNestedToggle,
  handleKeyDownNestedToggle,
} from "../../presentation/webview/editor/ajsFlow/nodes/Utils";
import { AjsNode } from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";
import { tableColumnDef } from "../../presentation/webview/editor/ajsTable/tableColumnDef";
import {
  buildUnitListDetailActions,
  buildUnitListDetailChips,
  buildUnitListRelationshipRows,
  buildUnitListDetailRows,
} from "../../presentation/webview/editor/ajsTable/UnitListDetailPanel";
import {
  createUnitListDetailResolver,
  resolveUnitListDetail,
} from "../../presentation/webview/editor/ajsTable/unitListDetail";
import { getSharedUnitDetailPaneActionLabels } from "../../presentation/webview/editor/shared/SharedUnitDetailPane";

const dialogData: UnitDefinitionDialogDto = {
  absolutePath: "/root/job1",
  rawData: "ty=j\ncm=example",
  commands: [
    {
      id: "ajsshow",
      label: "ajsshow",
      value: "ajsshow -R /root/job1",
    },
    {
      id: "ajsprint",
      label: "ajsprint",
      value: "ajsprint -a -R /root/job1",
    },
  ],
  commandBuilders: [],
};

const createNode = (overrides: Partial<AjsNode> = {}): AjsNode =>
  ({
    unitId: "u1",
    unitDefinition: dialogData,
    label: "job1",
    comment: "example",
    ty: "j",
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: false,
    hasSchedule: false,
    hasWaitedFor: false,
    dialogData: undefined,
    setDialogData: () => undefined,
    currentUnitId: undefined,
    setCurrentUnitId: () => undefined,
    ...overrides,
  }) as AjsNode;

const rowView = {
  id: "u1",
  absolutePath: "/root/job1",
  group1: {
    name: "job1",
    parentAbsolutePath: "/root",
    unitType: "j",
  },
  group2: {
    comment: "example",
    previousUnits: [],
    nextUnits: [],
  },
  group5: {},
  group6: {
    openDates: [],
    closeDates: [],
  },
  group10: {
    parentRules: [],
    scheduleDateTypes: [],
    scheduleDateYearMonths: [],
    scheduleDateDays: [],
    startTimes: [],
    cycles: [],
    substitutes: [],
    shiftDays: [],
    scheduleByDaysFromStart: [],
    maxShiftableDays: [],
    startRangeTimes: [],
    endRangeTimes: [],
    waitCounts: [],
    waitTimes: [],
  },
} as UnitListRowView;

const createRowView = (
  absolutePath: string,
  previousUnits: UnitListRowView["group2"]["previousUnits"] = [],
  nextUnits: UnitListRowView["group2"]["nextUnits"] = [],
): UnitListRowView =>
  ({
    ...rowView,
    id: absolutePath,
    absolutePath,
    group1: {
      ...rowView.group1,
      name: absolutePath.split("/").at(-1) ?? absolutePath,
    },
    group2: {
      ...rowView.group2,
      previousUnits,
      nextUnits,
    },
  }) as UnitListRowView;

suite("Show Unit Definition interaction", () => {
  test("list detail resolves selected definition content by stable path", () => {
    const detail = resolveUnitListDetail(
      "/root/job1",
      new Map([["/root/job1", rowView]]),
      new Map([["/root/job1", dialogData]]),
    );

    assert.strictEqual(detail?.row.absolutePath, "/root/job1");
    assert.strictEqual(detail?.definition?.rawData, "ty=j\ncm=example");
    assert.strictEqual(
      resolveUnitListDetail(undefined, new Map(), new Map()),
      undefined,
    );
  });

  test("list detail resolver caches transitive relationship summaries by selected path", () => {
    const job0 = createRowView("/root/job0");
    const job1 = createRowView(
      "/root/job1",
      [
        {
          id: "job0",
          name: "job0",
          absolutePath: "/root/job0",
          relationType: "seq",
        },
      ],
      [
        {
          id: "job2",
          name: "job2",
          absolutePath: "/root/job2",
          relationType: "seq",
        },
      ],
    );
    const job2 = createRowView(
      "/root/job2",
      [
        {
          id: "job1",
          name: "job1",
          absolutePath: "/root/job1",
          relationType: "seq",
        },
      ],
      [
        {
          id: "job3",
          name: "job3",
          absolutePath: "/root/job3",
          relationType: "seq",
        },
      ],
    );
    const job3 = createRowView("/root/job3", [
      {
        id: "job2",
        name: "job2",
        absolutePath: "/root/job2",
        relationType: "seq",
      },
    ]);
    const resolveDetail = createUnitListDetailResolver(
      new Map([job0, job1, job2, job3].map((row) => [row.absolutePath, row])),
      new Map([["/root/job1", dialogData]]),
    );

    const detail = resolveDetail("/root/job1");

    assert.strictEqual(detail?.predecessorCount, 1);
    assert.strictEqual(detail?.successorCount, 1);
    assert.strictEqual(detail?.upstreamCount, 1);
    assert.strictEqual(detail?.downstreamCount, 2);
    assert.strictEqual(resolveDetail("/root/job1"), detail);
  });

  test("list detail resolver keeps cycle traversal cache local to selected path", () => {
    const job1 = createRowView(
      "/root/job1",
      [],
      [
        {
          id: "job2",
          name: "job2",
          absolutePath: "/root/job2",
          relationType: "seq",
        },
      ],
    );
    const job2 = createRowView(
      "/root/job2",
      [],
      [
        {
          id: "job1",
          name: "job1",
          absolutePath: "/root/job1",
          relationType: "seq",
        },
      ],
    );
    const resolveDetail = createUnitListDetailResolver(
      new Map([job1, job2].map((row) => [row.absolutePath, row])),
      new Map(),
    );

    assert.strictEqual(resolveDetail("/root/job1")?.downstreamCount, 1);
    assert.strictEqual(resolveDetail("/root/job2")?.downstreamCount, 1);
  });

  test("list detail exposes definition and flow navigation as pane actions", () => {
    const detail = resolveUnitListDetail(
      "/root/job1",
      new Map([["/root/job1", rowView]]),
      new Map([["/root/job1", dialogData]]),
    );
    assert.ok(detail);

    const actions = buildUnitListDetailActions(
      Boolean(detail.definition),
      () => undefined,
      () => undefined,
    );

    assert.deepStrictEqual(getSharedUnitDetailPaneActionLabels(actions), [
      "Open definition details",
      "Open in flow graph",
    ]);
    assert.deepStrictEqual(buildUnitListDetailRows(detail), [
      { label: "Comment", value: "example" },
      { label: "Absolute path", value: "/root/job1" },
      { label: "Parent unit", value: "/root" },
    ]);
    assert.deepStrictEqual(buildUnitListRelationshipRows(detail), [
      { label: "Predecessors", value: 0 },
      { label: "Successors", value: 0 },
      { label: "Upstream", value: 0 },
      { label: "Downstream", value: 0 },
    ]);
    assert.deepStrictEqual(
      buildUnitListDetailChips(detail).map((chip) => [chip.label, chip.active]),
      [
        ["Schedule", false],
        ["Waited for", false],
        ["Nested expandable", false],
      ],
    );
  });

  test("table utility column does not expose row-level dialog or flow actions", () => {
    const utilityColumn = tableColumnDef("en", () => undefined, new Map())[0];
    const renderCell = utilityColumn.cell as (
      props: unknown,
    ) => React.ReactElement;
    const content = renderCell({
      row: { index: 0, original: rowView },
    });

    const props = content.props as { children: React.ReactNode };
    assert.strictEqual(React.Children.count(props.children), 1);
  });

  test("flow nested toggle action expands only on click or Enter key", () => {
    const toggled: string[] = [];
    const node = createNode({
      unitId: "/root/jobnet/child-net",
      toggleExpandedUnitId: (unitId) => {
        toggled.push(unitId);
      },
    });

    handleClickNestedToggle(node)();
    handleKeyDownNestedToggle(node)({
      key: "Space",
    } as KeyboardEvent<HTMLElement>);
    handleKeyDownNestedToggle(node)({
      key: "Enter",
    } as KeyboardEvent<HTMLElement>);

    assert.deepStrictEqual(toggled, [
      "/root/jobnet/child-net",
      "/root/jobnet/child-net",
    ]);
  });
});
