import * as assert from "assert";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  createTable,
  FilterMeta,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
} from "@tanstack/table-core";
import { UnitListRowView } from "../../application/unit-list/buildUnitListView";
import {
  buildParameterSearchValues,
  createAjsGlobalFilterFn,
  isAjsTableSearchHit,
} from "../../ui-component/editor/ajsTable/globalFilter";

const createRow = (
  absolutePath: string,
  value: unknown,
): Row<UnitListRowView> =>
  ({
    original: { absolutePath } as UnitListRowView,
    getValue: () => value,
  }) as unknown as Row<UnitListRowView>;

suite("AJS table global filter", () => {
  test("builds parameter value search candidates", () => {
    assert.deepStrictEqual(
      buildParameterSearchValues([{ key: "prm", value: "--job" }], "value"),
      ["--job"],
    );
  });

  test("builds parameter key-value search candidates", () => {
    assert.deepStrictEqual(
      buildParameterSearchValues([{ key: "prm", value: "--job" }], "keyValue"),
      ["prm=--job"],
    );
  });

  test("preserves existing rendered cell matching", () => {
    const filterFn = createAjsGlobalFilterFn(new Map(), "value");
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
      "value",
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

  test("matches only key-value parameter candidates in key-value mode", () => {
    const filterFn = createAjsGlobalFilterFn(
      new Map([["/root/job", [{ key: "prm", value: "--job" }]]]),
      "keyValue",
    );

    assert.strictEqual(
      filterFn(
        createRow("/root/job", "rendered prm value"),
        "name",
        "prm=--job",
        () => {},
      ),
      true,
    );
    assert.strictEqual(
      filterFn(
        createRow("/root/job", "rendered prm value"),
        "name",
        "rendered",
        () => {},
      ),
      false,
    );
  });

  test("filters table rows by key-value parameter candidates", () => {
    const columnHelper = createColumnHelper<UnitListRowView>();
    const table = createTable<UnitListRowView>({
      columns: [
        columnHelper.accessor("absolutePath", {
          id: "absolutePath",
        }),
      ],
      data: [
        { absolutePath: "/root/job" } as UnitListRowView,
        { absolutePath: "/root/other" } as UnitListRowView,
      ],
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getColumnCanGlobalFilter: () => true,
      globalFilterFn: createAjsGlobalFilterFn(
        new Map([
          ["/root/job", [{ key: "prm", value: "--job" }]],
          ["/root/other", [{ key: "prm", value: "--other" }]],
        ]),
        "keyValue",
      ),
      onStateChange: () => {},
      renderFallbackValue: null,
      state: {
        globalFilter: "prm=--job",
      },
    });

    assert.deepStrictEqual(
      table.getRowModel().rows.map((row) => row.original.absolutePath),
      ["/root/job"],
    );
  });

  test("identifies matching cells in value mode", () => {
    assert.strictEqual(
      isAjsTableSearchHit(
        "rendered job",
        [{ key: "prm", value: "--job" }],
        "job",
        "value",
      ),
      true,
    );
    assert.strictEqual(
      isAjsTableSearchHit(
        "rendered job",
        [{ key: "prm", value: "--job" }],
        "prm",
        "value",
      ),
      false,
    );
  });

  test("identifies the rendered value cell for key-value parameter matches", () => {
    assert.strictEqual(
      isAjsTableSearchHit(
        "--job",
        [{ key: "prm", value: "--job" }],
        "prm=--job",
        "keyValue",
      ),
      true,
    );
    assert.strictEqual(
      isAjsTableSearchHit(
        "other",
        [{ key: "prm", value: "--job" }],
        "prm=--job",
        "keyValue",
      ),
      false,
    );
  });
});
