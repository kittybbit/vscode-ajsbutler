import * as assert from "assert";
import { v5 as uuidv5 } from "uuid";
import { parseAjs } from "../support/parseAjs";
import { tyFactory } from "../../domain/utils/TyUtils";

const UNIT_ENTITY_ID_NAMESPACE = uuidv5.URL;
const UUID_V5_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const parseRootAndChildIds = (): { rootId: string; childId: string } => {
  const result = parseAjs(`
    unit=root,,jp1admin,;
    {
      ty=g;
      el=jobnet,n,+0+0;
      unit=jobnet,,jp1admin,;
      {
        ty=n;
      }
    }
  `);

  assert.deepStrictEqual(result.errors, []);

  const root = tyFactory(result.rootUnits[0]);
  const child = root.children[0];

  return {
    rootId: root.id,
    childId: child.id,
  };
};

suite("Unit entity identity", () => {
  test("derives deterministic UUID v5 ids from unit absolute paths", () => {
    const first = parseRootAndChildIds();
    const second = parseRootAndChildIds();

    assert.match(first.rootId, UUID_V5_PATTERN);
    assert.match(first.childId, UUID_V5_PATTERN);
    assert.strictEqual(first.rootId, uuidv5("/root", UNIT_ENTITY_ID_NAMESPACE));
    assert.strictEqual(
      first.childId,
      uuidv5("/root/jobnet", UNIT_ENTITY_ID_NAMESPACE),
    );
    assert.strictEqual(first.rootId, second.rootId);
    assert.strictEqual(first.childId, second.childId);
    assert.notStrictEqual(first.rootId, first.childId);
  });
});
