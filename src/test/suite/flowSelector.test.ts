import * as assert from "assert";
import { isSelectableFlowScopeUnit } from "../../presentation/webview/editor/ajsFlow/FlowSelector";
import {
  collectFlowTreeAncestorUnitIds,
  isUnitInCurrentFlowScope,
  resolveFlowTreeSelectionTarget,
} from "../../presentation/webview/editor/ajsFlow/flowTreeSelection";
import { createFlowTestUnit } from "../support/flowUnits";

suite("Flow Selector", () => {
  test("allows only root jobnets as selectable flow scopes", () => {
    const rootJobnet = createFlowTestUnit({
      id: "/root/jobnet",
      name: "jobnet",
      unitType: "n",
      isRootJobnet: true,
    });
    const jobGroup = createFlowTestUnit({
      id: "/root",
      name: "root",
      unitType: "g",
      groupType: "n",
      isRoot: true,
      isRootJobnet: false,
    });
    const nestedJobnet = createFlowTestUnit({
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

  test("resolves tree ancestors and in-scope nested expansion", () => {
    const rootGroup = createFlowTestUnit({
      id: "/root",
      name: "root",
      unitType: "g",
      isRoot: true,
      isRootJobnet: false,
    });
    const rootJobnet = createFlowTestUnit({
      id: "/root/jobnet",
      parentId: rootGroup.id,
      isRootJobnet: true,
    });
    const nestedJobnet = createFlowTestUnit({
      id: "/root/jobnet/nested",
      parentId: rootJobnet.id,
      isRootJobnet: false,
      children: [],
    });
    const leaf = createFlowTestUnit({
      id: "/root/jobnet/nested/leaf",
      name: "leaf",
      unitType: "j",
      parentId: nestedJobnet.id,
      isRootJobnet: false,
    });
    nestedJobnet.children = [leaf];
    rootJobnet.children = [nestedJobnet];
    rootGroup.children = [rootJobnet];
    const unitById = new Map(
      [rootGroup, rootJobnet, nestedJobnet, leaf].map((unit) => [
        unit.id,
        unit,
      ]),
    );

    assert.deepStrictEqual(collectFlowTreeAncestorUnitIds(leaf.id, unitById), [
      rootGroup.id,
      rootJobnet.id,
      nestedJobnet.id,
    ]);
    assert.strictEqual(
      isUnitInCurrentFlowScope(leaf, rootJobnet, unitById),
      true,
    );
    assert.strictEqual(
      isUnitInCurrentFlowScope(rootGroup, rootJobnet, unitById),
      true,
    );
    assert.deepStrictEqual(
      resolveFlowTreeSelectionTarget(leaf.id, rootJobnet, unitById),
      {
        selectedUnitId: leaf.id,
        expandedNestedUnitIds: [nestedJobnet.id],
      },
    );
  });

  test("rejects selection outside the current root jobnet", () => {
    const current = createFlowTestUnit({ id: "/root/current" });
    const another = createFlowTestUnit({ id: "/root/another" });
    const anotherJob = createFlowTestUnit({
      id: "/root/another/job",
      unitType: "j",
      parentId: another.id,
      isRootJobnet: false,
    });
    another.children = [anotherJob];
    const unitById = new Map(
      [current, another, anotherJob].map((unit) => [unit.id, unit]),
    );

    assert.strictEqual(
      isUnitInCurrentFlowScope(anotherJob, current, unitById),
      false,
    );
    assert.strictEqual(
      resolveFlowTreeSelectionTarget(anotherJob.id, current, unitById),
      undefined,
    );
  });
});
