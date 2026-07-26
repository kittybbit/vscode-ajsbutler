import * as assert from "assert";
import {
  parseNavigationRequest,
  resolveFlowNavigationTarget,
} from "../../application/navigation/resolveNavigationTarget";
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import { createFlowTestUnit } from "../support/flowUnits";

const createValidatedDocument = (
  rootUnits: FlowGraphUnitDto[],
): ValidatedFlowGraphDocument => {
  const unitById = new Map<string, FlowGraphUnitDto>();
  const unitByAbsolutePath = new Map<string, FlowGraphUnitDto>();
  const pending = [...rootUnits];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const unit = pending.pop() as FlowGraphUnitDto;
    if (visited.has(unit.id)) continue;
    visited.add(unit.id);
    unitById.set(unit.id, unit);
    unitByAbsolutePath.set(unit.absolutePath, unit);
    pending.push(...unit.children);
  }
  return {
    status: "available",
    document: { rootUnits },
    index: { unitById, unitByAbsolutePath },
    issues: [],
  };
};

const createRootWithJob = (): ValidatedFlowGraphDocument => {
  const job = createFlowTestUnit({
    id: "job",
    absolutePath: "/root/job",
    unitType: "j",
    parentId: "root",
    depth: 1,
    isRootJobnet: false,
  });
  const root = createFlowTestUnit({
    id: "root",
    absolutePath: "/root",
    depth: 0,
    parentId: undefined,
    isRoot: true,
    children: [job],
  });
  return createValidatedDocument([root]);
};

suite("Resolve navigation target", () => {
  test("parses a JSON-safe stable-path navigation request", () => {
    const parsed = parseNavigationRequest(
      JSON.parse(JSON.stringify({ absolutePath: "/root/job" })),
    );
    assert.deepStrictEqual(parsed, {
      status: "available",
      request: { absolutePath: "/root/job" },
    });
    for (const value of [
      undefined,
      {},
      { absolutePath: 1 },
      { absolutePath: "" },
    ]) {
      assert.strictEqual(parseNavigationRequest(value).status, "unavailable");
    }
  });

  test("opens the containing jobnet and retains the revealed unit", () => {
    const document = createRootWithJob();
    const result = resolveFlowNavigationTarget(document, {
      absolutePath: "/root/job",
    });
    assert.deepStrictEqual(result, {
      status: "available",
      target: {
        absolutePath: "/root/job",
        activeFlowScopeUnitId: "root",
        revealedUnitId: "job",
        requiredExpandedAncestorUnitIds: [],
      },
      issues: [],
    });
    assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), result);

    const rootResult = resolveFlowNavigationTarget(document, {
      absolutePath: "/root",
    });
    assert.strictEqual(rootResult.status, "available");
    if (rootResult.status !== "available") return;
    assert.strictEqual(rootResult.target.activeFlowScopeUnitId, "root");
    assert.strictEqual(rootResult.target.revealedUnitId, "root");
  });

  test("opens the first descendant root jobnet in stable tree order", () => {
    const first = createFlowTestUnit({
      id: "first-root",
      absolutePath: "/group/branch/first-root",
      parentId: "branch",
      depth: 2,
      isRootJobnet: true,
    });
    const branch = createFlowTestUnit({
      id: "branch",
      absolutePath: "/group/branch",
      unitType: "g",
      parentId: "group",
      depth: 1,
      isRootJobnet: false,
      children: [first],
    });
    const second = createFlowTestUnit({
      id: "second-root",
      absolutePath: "/group/second-root",
      parentId: "group",
      depth: 1,
      isRootJobnet: true,
    });
    const group = createFlowTestUnit({
      id: "group",
      absolutePath: "/group",
      unitType: "g",
      depth: 0,
      isRoot: true,
      isRootJobnet: false,
      children: [branch, second],
    });
    const document = createValidatedDocument([group]);

    const result = resolveFlowNavigationTarget(document, {
      absolutePath: "/group",
    });
    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.target.activeFlowScopeUnitId, "first-root");
    assert.strictEqual(result.target.revealedUnitId, "group");
  });

  test("opens a direct condition parent as the active scope", () => {
    const job = createFlowTestUnit({
      id: "job",
      absolutePath: "/root/.condition/job",
      unitType: "j",
      parentId: "condition",
      depth: 2,
      isRootJobnet: false,
    });
    const condition = createFlowTestUnit({
      id: "condition",
      absolutePath: "/root/.condition",
      unitType: "rc",
      parentId: "root",
      depth: 1,
      isRootJobnet: false,
      children: [job],
    });
    const root = createFlowTestUnit({
      id: "root",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      children: [condition],
    });

    const result = resolveFlowNavigationTarget(
      createValidatedDocument([root]),
      {
        absolutePath: "/root/.condition/job",
      },
    );
    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.target.activeFlowScopeUnitId, "condition");
  });

  test("keeps nearest nested jobnet scope and ancestor order deterministic", () => {
    const job = createFlowTestUnit({
      id: "job",
      absolutePath: "/root/child/job",
      unitType: "j",
      parentId: "child",
      depth: 2,
      isRootJobnet: false,
    });
    const child = createFlowTestUnit({
      id: "child",
      absolutePath: "/root/child",
      parentId: "root",
      depth: 1,
      isRootJobnet: false,
      children: [job],
    });
    const root = createFlowTestUnit({
      id: "root",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      children: [child],
    });

    const result = resolveFlowNavigationTarget(
      createValidatedDocument([root]),
      {
        absolutePath: "/root/child/job",
      },
    );
    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.target.activeFlowScopeUnitId, "child");
    assert.deepStrictEqual(result.target.requiredExpandedAncestorUnitIds, []);
  });

  test("returns typed unavailable results for missing targets and scopes", () => {
    const missing = resolveFlowNavigationTarget(createRootWithJob(), {
      absolutePath: "/missing",
    });
    assert.strictEqual(missing.status, "unavailable");
    assert.strictEqual(missing.issues[0]?.code, "navigation_target_not_found");

    const group = createFlowTestUnit({
      id: "group",
      absolutePath: "/group",
      unitType: "g",
      depth: 0,
      isRoot: true,
      isRootJobnet: false,
    });
    const noScope = resolveFlowNavigationTarget(
      createValidatedDocument([group]),
      { absolutePath: "/group" },
    );
    assert.strictEqual(noScope.status, "unavailable");
    assert.strictEqual(noScope.issues[0]?.code, "flow_scope_unavailable");
  });

  test("guards a malformed cyclic parent chain", () => {
    const first = createFlowTestUnit({
      id: "first",
      absolutePath: "/first",
      unitType: "j",
      parentId: "second",
      isRootJobnet: false,
    });
    const second = createFlowTestUnit({
      id: "second",
      absolutePath: "/second",
      unitType: "j",
      parentId: "first",
      isRootJobnet: false,
    });
    const document = createValidatedDocument([first, second]);

    const result = resolveFlowNavigationTarget(document, {
      absolutePath: "/first",
    });
    assert.strictEqual(result.status, "unavailable");
    assert.strictEqual(result.issues[0]?.code, "navigation_parent_cycle");
  });

  test("resolves a representative deep hierarchy without recursive traversal", () => {
    const depth = 400;
    const root = createFlowTestUnit({
      id: "root",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      children: [],
    });
    let parent = root;
    let parentPath = root.absolutePath;
    for (let index = 1; index <= depth; index++) {
      const absolutePath = `${parentPath}/group-${index}`;
      const group = createFlowTestUnit({
        id: `group-${index}`,
        absolutePath,
        unitType: "g",
        parentId: parent.id,
        depth: index,
        isRootJobnet: false,
        children: [],
      });
      parent.children = [group];
      parent = group;
      parentPath = absolutePath;
    }
    const job = createFlowTestUnit({
      id: "deep-job",
      absolutePath: `${parentPath}/job`,
      unitType: "j",
      parentId: parent.id,
      depth: depth + 1,
      isRootJobnet: false,
    });
    parent.children = [job];

    const result = resolveFlowNavigationTarget(
      createValidatedDocument([root]),
      {
        absolutePath: job.absolutePath,
      },
    );
    assert.strictEqual(result.status, "available");
    if (result.status !== "available") return;
    assert.strictEqual(result.target.activeFlowScopeUnitId, "root");
    assert.strictEqual(result.target.revealedUnitId, "deep-job");
  });

  test("reuses a missing root-jobnet lookup for a large job group", () => {
    const depth = 400;
    const group = createFlowTestUnit({
      id: "group",
      absolutePath: "/group",
      unitType: "g",
      depth: 0,
      isRoot: true,
      isRootJobnet: false,
      children: [],
    });
    let parent = group;
    for (let index = 1; index <= depth; index++) {
      const child = createFlowTestUnit({
        id: `branch-${index}`,
        absolutePath: `/group/branch-${index}`,
        unitType: "g",
        parentId: parent.id,
        depth: index,
        isRootJobnet: false,
        children: [],
      });
      parent.children = [child];
      parent = child;
    }
    const document = createValidatedDocument([group]);
    const children = group.children;
    let rootChildrenReads = 0;
    Object.defineProperty(group, "children", {
      configurable: true,
      get: () => {
        rootChildrenReads++;
        return children;
      },
    });

    const request = { absolutePath: "/group" };
    assert.strictEqual(
      resolveFlowNavigationTarget(document, request).status,
      "unavailable",
    );
    assert.strictEqual(
      resolveFlowNavigationTarget(document, request).status,
      "unavailable",
    );
    assert.strictEqual(rootChildrenReads, 1);
  });
});
