import * as assert from "assert";
import {
  collectAjsUnitOccurrences,
  collectUniqueAjsUnits,
  createAjsDocumentIndex,
} from "../../domain/models/ajs/AjsDocumentIndex";
import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";

const unit = (
  absolutePath: string,
  overrides: Partial<AjsUnit> = {},
): AjsUnit => ({
  id: absolutePath,
  name: absolutePath,
  unitAttribute: "jobnet,,jp1admin,",
  unitType: "n",
  absolutePath,
  depth: 0,
  isRoot: true,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: [],
  relations: [],
  children: [],
  ...overrides,
});

const document = (rootUnits: AjsUnit[]): AjsDocument => ({
  rootUnits,
  warnings: [],
});

suite("AjsDocumentIndex", () => {
  test("indexes an empty ordered unit list", () => {
    assert.deepStrictEqual(createAjsDocumentIndex([]), {
      byId: new Map(),
      byPath: new Map(),
    });
    assert.deepStrictEqual(collectUniqueAjsUnits(document([])), []);
  });

  test("collects unique objects in root-first preorder through cycles", () => {
    const rootChildren: AjsUnit[] = [];
    const root = unit("/root", { children: rootChildren });
    const firstChildChildren: AjsUnit[] = [];
    const firstChild = unit("/root/first", {
      children: firstChildChildren,
    });
    const secondChildChildren: AjsUnit[] = [];
    const secondChild = unit("/root/second", {
      children: secondChildChildren,
    });
    const shared = unit("/shared");
    const secondRootChildren: AjsUnit[] = [];
    const secondRoot = unit("/second-root", {
      children: secondRootChildren,
    });
    rootChildren.push(firstChild, secondChild);
    firstChildChildren.push(shared, root);
    secondChildChildren.push(shared, secondChild);
    secondRootChildren.push(shared, root);

    const units = collectUniqueAjsUnits(
      document([root, secondRoot, shared, root]),
    );

    assert.deepStrictEqual(units, [
      root,
      firstChild,
      shared,
      secondChild,
      secondRoot,
    ]);
    assert.strictEqual(units[2], shared);
    assert.strictEqual(units[4], secondRoot);
  });

  test("collects every occurrence in recursive root-first preorder", () => {
    const rootChildren: AjsUnit[] = [];
    const root = unit("/root", { id: "root-id", children: rootChildren });
    const shared = unit("/shared", { id: "shared-id" });
    rootChildren.push(shared);

    const occurrences = collectAjsUnitOccurrences(
      document([root, shared, root]),
    );
    const index = createAjsDocumentIndex(occurrences);

    assert.deepStrictEqual(occurrences, [root, shared, shared, root, shared]);
    assert.strictEqual(occurrences[1], shared);
    assert.strictEqual(occurrences[3], root);
    assert.deepStrictEqual([...index.byId.keys()], ["root-id", "shared-id"]);
    assert.deepStrictEqual([...index.byPath.keys()], ["/root", "/shared"]);
    assert.deepStrictEqual(index.byId.get("shared-id"), [
      shared,
      shared,
      shared,
    ]);
    assert.deepStrictEqual(index.byPath.get("/root"), [root, root]);
  });

  test("retains bounded deep and wide occurrence order", () => {
    const rootChildren: AjsUnit[] = [];
    const root = unit("/wide", { children: rootChildren });
    const leaves = Array.from({ length: 4_096 }, (_, position) =>
      unit(`/wide/${position}`),
    );
    rootChildren.push(...leaves);
    const wide = collectAjsUnitOccurrences(document([root]));

    assert.strictEqual(wide.length, leaves.length + 1);
    assert.strictEqual(wide[0], root);
    assert.deepStrictEqual(wide.slice(1), leaves);

    const deepRootChildren: AjsUnit[] = [];
    const deepRoot = unit("/deep/0", { children: deepRootChildren });
    let parent = deepRoot;
    let parentChildren = deepRootChildren;
    const deepestLevel = 128;
    for (let depth = 1; depth <= deepestLevel; depth += 1) {
      const childChildren: AjsUnit[] = [];
      const child = unit(`/deep/${depth}`, { children: childChildren });
      parentChildren.push(child);
      parent = child;
      parentChildren = childChildren;
    }
    const deep = collectAjsUnitOccurrences(document([deepRoot]));

    assert.strictEqual(deep.length, deepestLevel + 1);
    assert.strictEqual(deep[0], deepRoot);
    assert.strictEqual(deep[deepestLevel], parent);
  });

  test("retains recursive occurrence traversal cycle failure", () => {
    const cycleChildren: AjsUnit[] = [];
    const selfCycle = unit("/self-cycle", { children: cycleChildren });
    cycleChildren.push(selfCycle);

    assert.throws(
      () => collectAjsUnitOccurrences(document([selfCycle])),
      RangeError,
    );
  });

  test("preserves distinct duplicate matches, key order, and references", () => {
    const first = unit("/first");
    const duplicateFirst = unit("/duplicate", { id: "duplicate-id" });
    const middle = unit("/middle");
    const duplicateSecond = unit("/duplicate", { id: "duplicate-id" });

    const index = createAjsDocumentIndex([
      first,
      duplicateFirst,
      middle,
      duplicateSecond,
    ]);

    assert.deepStrictEqual(
      [...index.byId.keys()],
      ["/first", "duplicate-id", "/middle"],
    );
    assert.deepStrictEqual(
      [...index.byPath.keys()],
      ["/first", "/duplicate", "/middle"],
    );
    assert.deepStrictEqual(index.byId.get("duplicate-id"), [
      duplicateFirst,
      duplicateSecond,
    ]);
    assert.deepStrictEqual(index.byPath.get("/duplicate"), [
      duplicateFirst,
      duplicateSecond,
    ]);
    assert.strictEqual(index.byId.get("duplicate-id")?.[0], duplicateFirst);
  });

  test("indexes wide duplicate-heavy graphs in encounter order", () => {
    const rootChildren: AjsUnit[] = [];
    const root = unit("/wide-root", { children: rootChildren });
    const duplicateId = "wide-duplicate";
    const duplicatePath = "/wide/duplicate";
    const leaves = Array.from({ length: 4_096 }, (_, position) => {
      return unit(duplicatePath, {
        id: duplicateId,
        name: String(position),
      });
    });
    rootChildren.push(...leaves);

    const ordered = collectUniqueAjsUnits(document([root]));
    const index = createAjsDocumentIndex(ordered);

    assert.strictEqual(ordered.length, leaves.length + 1);
    assert.strictEqual(ordered[0], root);
    assert.deepStrictEqual(ordered.slice(1), leaves);
    assert.deepStrictEqual(index.byId.get(duplicateId), leaves);
    assert.deepStrictEqual(index.byPath.get(duplicatePath), leaves);
  });

  test("collects a substantial deep hierarchy without recursion", () => {
    const rootChildren: AjsUnit[] = [];
    const root = unit("/deep/0", { children: rootChildren });
    let parent = root;
    let parentChildren = rootChildren;
    const deepestLevel = 20_000;
    for (let depth = 1; depth <= deepestLevel; depth += 1) {
      const childChildren: AjsUnit[] = [];
      const child = unit(`/deep/${depth}`, { children: childChildren });
      parentChildren.push(child);
      parent = child;
      parentChildren = childChildren;
    }

    const ordered = collectUniqueAjsUnits(document([root]));
    assert.strictEqual(ordered.length, deepestLevel + 1);
    assert.strictEqual(ordered[0], root);
    assert.strictEqual(ordered[deepestLevel], parent);
  });
});
