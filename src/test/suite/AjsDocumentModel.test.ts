import * as assert from "assert";
import {
  findAjsUnitAncestors,
  findAjsUnitParameter,
  findAjsUnitParameters,
  findParentAjsUnit,
  findRootJobnet,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../domain/models/ajs/AjsDocument";

const unit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "unit",
  name: "unit",
  unitAttribute: "unit,,jp1admin,",
  unitType: "j",
  absolutePath: "/root/jobnet/unit",
  depth: 2,
  parentId: "/root/jobnet",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: [],
  relations: [],
  children: [],
  ...overrides,
});

suite("AjsDocument model helpers", () => {
  test("flattens empty and sparse roots and children in preorder", () => {
    const empty = flattenAjsUnits([]);
    assert.deepStrictEqual(empty, []);
    assert.notStrictEqual(empty, flattenAjsUnits([]));
    empty.push(unit({ id: "mutable-result" }));

    const first = unit({ id: "first" });
    const second = unit({ id: "second" });
    const third = unit({ id: "third" });
    const sparseChildren = new Array<AjsUnit>(4);
    sparseChildren[1] = first;
    sparseChildren[3] = second;
    const root = unit({ id: "root", children: sparseChildren });
    const sparseRoots = new Array<AjsUnit>(3);
    sparseRoots[0] = root;
    sparseRoots[2] = third;

    const flattened = flattenAjsUnits(sparseRoots);
    assert.deepStrictEqual(flattened, [root, first, second, third]);
    assert.deepStrictEqual(
      flattened.map((entry) => entry.id),
      ["root", "first", "second", "third"],
    );
    assert.strictEqual(flattened[0], root);
    assert.strictEqual(flattened[1], first);
    assert.strictEqual(flattened[2], second);
    assert.strictEqual(flattened[3], third);
    assert.strictEqual(0 in sparseRoots, true);
    assert.strictEqual(1 in sparseRoots, false);
    assert.strictEqual(2 in sparseRoots, true);
    assert.strictEqual(0 in sparseChildren, false);
    assert.strictEqual(1 in sparseChildren, true);
    assert.strictEqual(2 in sparseChildren, false);
    assert.strictEqual(3 in sparseChildren, true);
  });

  test("preserves repeated and shared subtree occurrences by reference", () => {
    const shared = unit({ id: "shared" });
    const left = unit({ id: "left", children: [shared] });
    const right = unit({ id: "right", children: [shared] });
    const repeated = unit({ id: "repeated" });

    const flattened = flattenAjsUnits([left, right, repeated, repeated]);
    assert.deepStrictEqual(flattened, [
      left,
      shared,
      right,
      shared,
      repeated,
      repeated,
    ]);
    assert.strictEqual(flattened[1], shared);
    assert.strictEqual(flattened[3], shared);
    assert.strictEqual(flattened[4], repeated);
    assert.strictEqual(flattened[5], repeated);
  });

  test("rejects ancestor cycles and malformed root and child collections", () => {
    const cyclicChildren: AjsUnit[] = [];
    const cyclic = unit({ id: "cyclic", children: cyclicChildren });
    cyclicChildren.push(cyclic);

    assert.throws(
      () => flattenAjsUnits([cyclic]),
      (error: unknown) => error instanceof RangeError,
    );

    const leaf = unit({ id: "leaf" });
    const arrayLike = { 0: leaf, length: 1 };
    assert.throws(
      () => flattenAjsUnits(arrayLike as unknown as readonly AjsUnit[]),
      (error: unknown) => error instanceof TypeError,
    );
    const arrayLikeChildren = { ...unit(), children: arrayLike };
    assert.throws(
      () => flattenAjsUnits([arrayLikeChildren as unknown as AjsUnit]),
      (error: unknown) => error instanceof TypeError,
    );

    const malformed = { ...unit({ id: "malformed" }), children: undefined };
    assert.throws(
      () => flattenAjsUnits([malformed as unknown as AjsUnit]),
      (error: unknown) => error instanceof TypeError,
    );
    assert.throws(
      () => flattenAjsUnits([undefined as unknown as AjsUnit]),
      (error: unknown) => error instanceof TypeError,
    );
  });

  test("preserves identity, first-hit and repeated parameters, and fresh results", () => {
    const leafParameters: AjsParameter[] = [
      { key: "eun", value: "first" },
      { key: "eun", value: "second" },
    ];
    const leafChildren: AjsUnit[] = [];
    const leaf = unit({
      id: "leaf",
      absolutePath: "/root/jobnet/leaf",
      parentId: "jobnet",
      parameters: leafParameters,
      children: leafChildren,
    });
    const jobnetChildren: AjsUnit[] = [leaf];
    const jobnet = unit({
      id: "jobnet",
      name: "nightly",
      unitType: "n",
      absolutePath: "/root/jobnet",
      depth: 1,
      parentId: "root",
      isRootJobnet: true,
      children: jobnetChildren,
    });
    const rootChildren: AjsUnit[] = [jobnet];
    const root = unit({
      id: "root",
      name: "root",
      unitType: "g",
      absolutePath: "/root",
      depth: 0,
      parentId: undefined,
      isRoot: true,
      children: rootChildren,
    });
    const document: AjsDocument = {
      rootUnits: [root],
      warnings: [],
    };

    assert.strictEqual(findParentAjsUnit(document, leaf), jobnet);
    assert.deepStrictEqual(findAjsUnitAncestors(document, leaf), [
      jobnet,
      root,
    ]);
    assert.strictEqual(findRootJobnet(document), jobnet);
    assert.strictEqual(findAjsUnitParameter(leaf, "eun"), leafParameters[0]);
    assert.deepStrictEqual(findAjsUnitParameters(leaf, "eun"), leafParameters);

    const flattened = flattenAjsUnits(document.rootUnits);
    const matchingParameters = findAjsUnitParameters(leaf, "eun");
    const ancestors = findAjsUnitAncestors(document, leaf);
    assert.deepStrictEqual(flattened, [root, jobnet, leaf]);
    assert.strictEqual(flattened[0], root);
    assert.strictEqual(flattened[1], jobnet);
    assert.strictEqual(flattened[2], leaf);
    assert.notStrictEqual(flattened, document.rootUnits);
    assert.notStrictEqual(matchingParameters, leafParameters);
    assert.notStrictEqual(ancestors, jobnetChildren);

    flattened.pop();
    matchingParameters.pop();
    ancestors.pop();
    assert.deepStrictEqual(document.rootUnits, [root]);
    assert.deepStrictEqual(rootChildren, [jobnet]);
    assert.deepStrictEqual(jobnetChildren, [leaf]);
    assert.deepStrictEqual(leafParameters, [
      { key: "eun", value: "first" },
      { key: "eun", value: "second" },
    ]);
    assert.strictEqual(findAjsUnitParameter(leaf, "eun"), leafParameters[0]);
  });
});
