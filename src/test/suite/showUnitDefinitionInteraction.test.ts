import * as assert from "assert";
import type { KeyboardEvent } from "react";
import { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";
import {
  handleClickNestedToggle,
  handleClickDialogOpen,
  handleKeyDownNestedToggle,
  handleKeyDownDialogOpen,
} from "../../ui-component/editor/ajsFlow/nodes/Utils";
import { AjsNode } from "../../ui-component/editor/ajsFlow/nodes/AjsNode";
import { handleOpenUnitDefinition } from "../../ui-component/editor/ajsTable/tableColumnDef";

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

suite("Show Unit Definition interaction", () => {
  test("table action forwards the selected unit path", () => {
    const received: string[] = [];

    handleOpenUnitDefinition("/root/job1", (absolutePath) => {
      received.push(absolutePath);
    })();

    assert.deepStrictEqual(received, ["/root/job1"]);
  });

  test("flow action opens the dialog on click", () => {
    let received: UnitDefinitionDialogDto | undefined;
    const node = createNode({
      setDialogData: (nextState) => {
        received =
          typeof nextState === "function" ? nextState(undefined) : nextState;
      },
    });

    handleClickDialogOpen(node)();

    assert.deepStrictEqual(received, dialogData);
  });

  test("flow action opens the dialog only on Enter key", () => {
    let received: UnitDefinitionDialogDto | undefined;
    const node = createNode({
      setDialogData: (nextState) => {
        received =
          typeof nextState === "function" ? nextState(undefined) : nextState;
      },
    });

    handleKeyDownDialogOpen(node)({
      key: "Space",
    } as KeyboardEvent<HTMLElement>);
    assert.strictEqual(received, undefined);

    handleKeyDownDialogOpen(node)({
      key: "Enter",
    } as KeyboardEvent<HTMLElement>);
    assert.deepStrictEqual(received, dialogData);
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
