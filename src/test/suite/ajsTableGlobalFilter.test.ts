import * as assert from "assert";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterMeta, Row } from "@tanstack/table-core";
import { UnitListRowView } from "../../application/unit-list/buildUnitListView";
import {
  buildParameterSearchValues,
  createAjsGlobalFilterFn,
  isAjsTableSearchHit,
} from "../../presentation/webview/editor/ajsTable/globalFilter";

const createRow = (
  absolutePath: string,
  value: unknown,
): Row<UnitListRowView> =>
  ({
    original: { absolutePath } as unknown as UnitListRowView,
    getValue: () => value,
  }) as unknown as Row<UnitListRowView>;

suite("AJS table global filter", () => {
  test("builds parameter value search candidates", () => {
    assert.deepStrictEqual(
      buildParameterSearchValues([{ key: "prm", value: "--job" }]),
      ["--job"],
    );
  });

  test("preserves existing rendered cell matching", () => {
    const filterFn = createAjsGlobalFilterFn(new Map());
    let meta: FilterMeta | undefined;

    const passed = filterFn(
      createRow("/root/job", "rendered job"),
      "name",
      "rendered",
      (nextMeta) => {
        meta = nextMeta;
      },
    );

    assert.strictEqual(passed, true);
    assert.strictEqual((meta as RankingInfo | undefined)?.passed, true);
  });

  test("matches parameter values outside rendered cells in value mode", () => {
    const filterFn = createAjsGlobalFilterFn(
      new Map([["/root/job", [{ key: "prm", value: "--job" }]]]),
    );

    assert.strictEqual(
      filterFn(createRow("/root/job", undefined), "name", "--job", () => {}),
      true,
    );
    assert.strictEqual(
      filterFn(createRow("/root/job", undefined), "name", "job", () => {}),
      true,
    );
    assert.strictEqual(
      filterFn(createRow("/root/job", undefined), "name", "prm", () => {}),
      false,
    );
  });

  test("identifies matching cells in value mode", () => {
    assert.strictEqual(
      isAjsTableSearchHit(
        "rendered job",
        [{ key: "prm", value: "--job" }],
        "job",
      ),
      true,
    );
    assert.strictEqual(
      isAjsTableSearchHit(
        "rendered job",
        [{ key: "prm", value: "--job" }],
        "prm",
      ),
      false,
    );
  });

  test("identifies rendered cells by visible value and parameter value", () => {
    assert.strictEqual(
      isAjsTableSearchHit("--job", [{ key: "prm", value: "--job" }], "job"),
      true,
    );
    assert.strictEqual(
      isAjsTableSearchHit("other", [{ key: "prm", value: "--job" }], "job"),
      false,
    );
    assert.strictEqual(
      isAjsTableSearchHit("other", [{ key: "prm", value: "--job" }], "prm"),
      false,
    );
  });
});
