import * as assert from "assert";
import {
  buildAjsCommandBuilders,
  buildAjsCommands,
  buildCommandLine,
} from "../../application/unit-definition/buildAjsCommands";
import {
  buildUnitDefinition,
  buildUnitDefinitionByPath,
} from "../../application/unit-definition/buildUnitDefinition";
import { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { localeString } from "../../domain/services/i18n/nls";

const unit: AjsUnit = {
  id: "u1",
  name: "job1",
  unitAttribute: "job1,,jp1admin,",
  permission: "jp1admin",
  jp1Username: "jp1admin",
  jp1ResourceGroup: undefined,
  unitType: "j",
  groupType: undefined,
  comment: "example",
  absolutePath: "/root/job1",
  depth: 1,
  parentId: "root",
  isRoot: false,
  isRecovery: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 80, v: 48 },
  parameters: [
    { key: "ty", value: "j" },
    { key: "cm", value: "example" },
  ],
  relations: [],
  children: [],
};

suite("Build Unit Definition", () => {
  test("builds the supported AJS command set from a normalized unit", () => {
    assert.deepStrictEqual(buildAjsCommands(unit), [
      {
        id: "ajsshow",
        label: "ajsshow",
        value: "ajsshow -R /root/job1",
      },
      {
        id: "ajsprint",
        label: "ajsprint",
        value: "ajsprint -a -R /root/job1",
      },
    ]);
  });

  test("builds command builders with compatibility-preserving defaults", () => {
    const builders = buildAjsCommandBuilders(unit);

    assert.deepStrictEqual(
      builders.map(({ id, label, labelKey, manualUrl }) => ({
        id,
        label,
        labelKey,
        manualUrl: manualUrl.urlByLang,
      })),
      [
        {
          id: "ajsshow",
          label: "ajsshow",
          labelKey: "commandBuilder.ajsshow.label",
          manualUrl: {
            en: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0131.HTM",
            ja: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920/AJSO0131.HTM",
          },
        },
        {
          id: "ajsprint",
          label: "ajsprint",
          labelKey: "commandBuilder.ajsprint.label",
          manualUrl: {
            en: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0121.HTM",
            ja: "https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920/AJSO0121.HTM",
          },
        },
      ],
    );
    assert.deepStrictEqual(
      builders.map((builder) => buildCommandLine(builder)),
      ["ajsshow -R /root/job1", "ajsprint -a -R /root/job1"],
    );
  });

  test("command builder labels resolve through message resources", () => {
    const [ajsshow, ajsprint] = buildAjsCommandBuilders(unit);

    assert.strictEqual(
      localeString(ajsshow.descriptionKey, "en"),
      ajsshow.description,
    );
    assert.strictEqual(
      localeString(ajsshow.descriptionKey, "ja"),
      "選択したユニットの実行状態、結果、予定、関連情報を表示します。",
    );
    assert.strictEqual(
      localeString(ajsprint.manualUrl.labelKey, "en"),
      "Command reference",
    );
    assert.strictEqual(
      localeString(ajsprint.manualUrl.labelKey, "ja"),
      "コマンドリファレンス",
    );
  });

  test("builds command text from user-selected builder values", () => {
    const [ajsshow, ajsprint] = buildAjsCommandBuilders(unit);

    assert.strictEqual(
      buildCommandLine(ajsshow, {
        outputMode: "resultList",
        recursive: false,
        generations: "a",
        userName: "jp1admin",
      }),
      "ajsshow -l -g a -u jp1admin /root/job1",
    );
    assert.strictEqual(
      buildCommandLine(ajsprint, {
        outputMode: "format",
        formatIndicator: "%J",
        sortRelations: "yes",
        unitType: "jobnet",
        recursive: false,
      }),
      "ajsprint -f %J -s yes -N /root/job1",
    );
  });

  test("builds raw data and command text from a normalized unit", () => {
    const definition = buildUnitDefinition(unit);

    assert.strictEqual(definition.absolutePath, "/root/job1");
    assert.strictEqual(definition.rawData, "ty=j\ncm=example");
    assert.deepStrictEqual(definition.commands, [
      {
        id: "ajsshow",
        label: "ajsshow",
        value: "ajsshow -R /root/job1",
      },
      {
        id: "ajsprint",
        label: "ajsprint",
        value: "ajsprint -a -R /root/job1",
      },
    ]);
    assert.deepStrictEqual(
      definition.commandBuilders.map((builder) => buildCommandLine(builder)),
      ["ajsshow -R /root/job1", "ajsprint -a -R /root/job1"],
    );
  });

  test("builds dialog DTOs by absolute path from normalized units only", () => {
    const child: AjsUnit = {
      ...unit,
      id: "u2",
      name: "job2",
      absolutePath: "/root/job1/job2",
      parentId: "u1",
      depth: 2,
      parameters: [{ key: "ty", value: "j" }],
      children: [],
    };
    const document: AjsDocument = {
      rootUnits: [{ ...unit, children: [child] }],
      warnings: [],
    };

    const definitions = buildUnitDefinitionByPath(document);

    const rootDefinition = definitions.get("/root/job1");
    const childDefinition = definitions.get("/root/job1/job2");

    assert.strictEqual(rootDefinition?.absolutePath, "/root/job1");
    assert.strictEqual(rootDefinition?.rawData, "ty=j\ncm=example");
    assert.deepStrictEqual(rootDefinition?.commands, [
      {
        id: "ajsshow",
        label: "ajsshow",
        value: "ajsshow -R /root/job1",
      },
      {
        id: "ajsprint",
        label: "ajsprint",
        value: "ajsprint -a -R /root/job1",
      },
    ]);
    assert.deepStrictEqual(
      rootDefinition?.commandBuilders.map((builder) =>
        buildCommandLine(builder),
      ),
      ["ajsshow -R /root/job1", "ajsprint -a -R /root/job1"],
    );

    assert.strictEqual(childDefinition?.absolutePath, "/root/job1/job2");
    assert.strictEqual(childDefinition?.rawData, "ty=j");
    assert.deepStrictEqual(childDefinition?.commands, [
      {
        id: "ajsshow",
        label: "ajsshow",
        value: "ajsshow -R /root/job1/job2",
      },
      {
        id: "ajsprint",
        label: "ajsprint",
        value: "ajsprint -a -R /root/job1/job2",
      },
    ]);
    assert.deepStrictEqual(
      childDefinition?.commandBuilders.map((builder) =>
        buildCommandLine(builder),
      ),
      ["ajsshow -R /root/job1/job2", "ajsprint -a -R /root/job1/job2"],
    );
  });
});
