import * as assert from "assert";
import {
  collectAjsUnitOccurrences,
  collectUniqueAjsUnits,
  createAjsDocumentIndex,
} from "../../domain/models/ajs/AjsDocumentIndex";
import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";

const unit = (absolutePath: string): AjsUnit => ({
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
    const root = unit("/root");
    const firstChild = unit("/root/first");
    const secondChild = unit("/root/second");
    const shared = unit("/shared");
    const secondRoot = unit("/second-root");
    root.children.push(firstChild, secondChild);
    firstChild.children.push(shared, root);
    secondChild.children.push(shared, secondChild);
    secondRoot.children.push(shared, root);

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
    const root = unit("/root");
    const shared = unit("/shared");
    root.id = "root-id";
    shared.id = "shared-id";
    root.children.push(shared);

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
    const root = unit("/wide");
    const leaves = Array.from({ length: 4_096 }, (_, position) =>
      unit(`/wide/${position}`),
    );
    root.children.push(...leaves);
    const wide = collectAjsUnitOccurrences(document([root]));

    assert.strictEqual(wide.length, leaves.length + 1);
    assert.strictEqual(wide[0], root);
    assert.deepStrictEqual(wide.slice(1), leaves);

    const deepRoot = unit("/deep/0");
    let parent = deepRoot;
    const deepestLevel = 128;
    for (let depth = 1; depth <= deepestLevel; depth += 1) {
      const child = unit(`/deep/${depth}`);
      parent.children.push(child);
      parent = child;
    }
    const deep = collectAjsUnitOccurrences(document([deepRoot]));

    assert.strictEqual(deep.length, deepestLevel + 1);
    assert.strictEqual(deep[0], deepRoot);
    assert.strictEqual(deep[deepestLevel], parent);
  });

  test("retains recursive occurrence traversal cycle failure", () => {
    const selfCycle = unit("/self-cycle");
    selfCycle.children.push(selfCycle);

    assert.throws(
      () => collectAjsUnitOccurrences(document([selfCycle])),
      RangeError,
    );
  });

  test("preserves distinct duplicate matches, key order, and references", () => {
    const first = unit("/first");
    const duplicateFirst = unit("/duplicate");
    const middle = unit("/middle");
    const duplicateSecond = unit("/duplicate");
    duplicateFirst.id = "duplicate-id";
    duplicateSecond.id = "duplicate-id";

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
    const root = unit("/wide-root");
    const duplicateId = "wide-duplicate";
    const duplicatePath = "/wide/duplicate";
    const leaves = Array.from({ length: 4_096 }, (_, position) => {
      const leaf = unit(duplicatePath);
      leaf.id = duplicateId;
      leaf.name = String(position);
      return leaf;
    });
    root.children.push(...leaves);

    const ordered = collectUniqueAjsUnits(document([root]));
    const index = createAjsDocumentIndex(ordered);

    assert.strictEqual(ordered.length, leaves.length + 1);
    assert.strictEqual(ordered[0], root);
    assert.deepStrictEqual(ordered.slice(1), leaves);
    assert.deepStrictEqual(index.byId.get(duplicateId), leaves);
    assert.deepStrictEqual(index.byPath.get(duplicatePath), leaves);
  });

  test("collects a substantial deep hierarchy without recursion", () => {
    const root = unit("/deep/0");
    let parent = root;
    const deepestLevel = 20_000;
    for (let depth = 1; depth <= deepestLevel; depth += 1) {
      const child = unit(`/deep/${depth}`);
      parent.children.push(child);
      parent = child;
    }

    const ordered = collectUniqueAjsUnits(document([root]));
    assert.strictEqual(ordered.length, deepestLevel + 1);
    assert.strictEqual(ordered[0], root);
    assert.strictEqual(ordered[deepestLevel], parent);
  });
});
