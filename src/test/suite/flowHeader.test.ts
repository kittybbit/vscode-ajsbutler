import * as assert from "assert";
import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { getCurrentUnitLabel } from "../../presentation/webview/editor/ajsFlow/Header";

const createUnit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
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

suite("Flow Header", () => {
  test("keeps the current scope type identifiable without breadcrumbs", () => {
    assert.strictEqual(getCurrentUnitLabel(undefined), undefined);
    assert.strictEqual(getCurrentUnitLabel(createUnit()), "ROOT JOBNET");
    assert.strictEqual(
      getCurrentUnitLabel(createUnit({ unitType: "n", isRootJobnet: false })),
      "N",
    );
  });
});
