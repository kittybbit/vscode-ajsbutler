import * as assert from "assert";
import { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { isSelectableFlowScopeUnit } from "../../presentation/webview/editor/ajsFlow/FlowSelector";

const createUnit = (overrides: Partial<AjsUnit>): AjsUnit => ({
  id: overrides.id ?? "/root/jobnet",
  name: overrides.name ?? "jobnet",
  unitAttribute: "",
  unitType: overrides.unitType ?? "n",
  groupType: overrides.groupType,
  absolutePath: overrides.absolutePath ?? "/root/jobnet",
  depth: overrides.depth ?? 1,
  parentId: overrides.parentId,
  isRoot: overrides.isRoot ?? false,
  isRootJobnet: overrides.isRootJobnet ?? true,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 0, v: 0 },
  parameters: [],
  relations: [],
  children: [],
});

suite("Flow Selector", () => {
  test("allows only root jobnets as selectable flow scopes", () => {
    const rootJobnet = createUnit({
      id: "/root/jobnet",
      name: "jobnet",
      unitType: "n",
      isRootJobnet: true,
    });
    const jobGroup = createUnit({
      id: "/root",
      name: "root",
      unitType: "g",
      groupType: "n",
      isRoot: true,
      isRootJobnet: false,
    });
    const nestedJobnet = createUnit({
      id: "/root/jobnet/nested",
      name: "nested",
      unitType: "n",
      parentId: "/root/jobnet",
      isRootJobnet: false,
    });

    assert.strictEqual(isSelectableFlowScopeUnit(rootJobnet), true);
    assert.strictEqual(isSelectableFlowScopeUnit(jobGroup), false);
    assert.strictEqual(isSelectableFlowScopeUnit(nestedJobnet), false);
  });
});
