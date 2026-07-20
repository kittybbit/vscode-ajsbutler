import * as assert from "assert";
import { parseAjs } from "../support/parseAjs";
import {
  findUnitParameter,
  findUnitParameters,
  findUnitParameterValue,
  findUnitParameterValues,
} from "../../domain/values/unitParameterLookupHelpers";

const validDefinition = `
unit = root,,jp1admin, ;
{
  ty = g ;
  gty = n ;
  op = mo:1 ;
  op = 2024/01/01 ;
}
`;

suite("Unit Parameter Lookup Helpers", () => {
  test("accepts a parameter-only source", () => {
    const source = {
      parameters: [
        { key: "op", value: "mo:1", position: 1 },
        { key: "op", value: "2024/01/01", position: 2 },
      ],
    };

    assert.deepStrictEqual(findUnitParameterValues(source, "op"), [
      "mo:1",
      "2024/01/01",
    ]);
  });

  test("finds raw unit parameters and values", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const unit = result.rootUnits[0];

    assert.strictEqual(unit.name, "root");
    assert.strictEqual(findUnitParameter(unit, "ty")?.value, "g");
    assert.strictEqual(findUnitParameterValue(unit, "gty"), "n");
    assert.deepStrictEqual(
      findUnitParameters(unit, "op").map((parameter) => parameter.value),
      ["mo:1", "2024/01/01"],
    );
    assert.deepStrictEqual(findUnitParameterValues(unit, "op"), [
      "mo:1",
      "2024/01/01",
    ]);
    assert.strictEqual(findUnitParameterValue(undefined, "ty"), undefined);
    assert.deepStrictEqual(findUnitParameterValues(undefined, "op"), []);
  });
});
