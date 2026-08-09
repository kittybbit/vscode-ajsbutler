import * as assert from "assert";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  createViewerDocumentChangedMessage,
  createViewerResourceStateMessage,
  createViewerRevealUnitMessage,
  parseViewerHostMessage,
  viewerHostMessageTypes,
  type ViewerHostMessage,
} from "../../presentation/webview/viewerHostMessages";
import { assertPlainJsonValue } from "../support/plainJson";

const document: AjsDocument = {
  rootUnits: [
    {
      id: "root-id",
      name: "root",
      unitAttribute: "root,,jp1admin,",
      unitType: "n",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      isRootJobnet: true,
      hasSchedule: false,
      hasWaitedFor: false,
      layout: { h: 0, v: 0 },
      parameters: [{ key: "ty", value: "n" }],
      relations: [],
      children: [],
    },
  ],
  warnings: [],
};

const createEveryViewerHostMessage = (): ViewerHostMessage[] => [
  createViewerResourceStateMessage({
    isDarkMode: true,
    lang: "ja",
    scrollType: "table",
  }),
  createViewerDocumentChangedMessage(toUnitListDocumentDto(document)),
  createViewerRevealUnitMessage("/root"),
];

const messagesResourceData = (): Record<string, unknown> => ({
  isDarkMode: true,
  lang: "ja",
  scrollType: "table",
});

suite("Viewer host messages", () => {
  test("inventories every builder and round-trips plain JSON", () => {
    const messages = createEveryViewerHostMessage();

    assert.deepStrictEqual(
      messages.map(({ type }) => type),
      viewerHostMessageTypes,
    );
    messages.forEach((message) => {
      assertPlainJsonValue(message);
      const restored = JSON.parse(JSON.stringify(message)) as unknown;
      assert.deepStrictEqual(restored, message);
      assert.deepStrictEqual(parseViewerHostMessage(restored), message);
    });
  });

  test("uses explicit null for an unavailable document", () => {
    const message = createViewerDocumentChangedMessage(undefined);

    assert.deepStrictEqual(message, { type: "changeDocument", data: null });
    assertPlainJsonValue(message);
    assert.deepStrictEqual(parseViewerHostMessage(message), message);
  });

  test("round-trips a bounded large document as plain JSON", () => {
    const childCount = 500;
    const rootUnit = document.rootUnits[0]!;
    const largeDocument: AjsDocument = {
      ...document,
      rootUnits: [
        {
          ...rootUnit,
          children: Array.from({ length: childCount }, (_, index) => ({
            ...rootUnit,
            id: `job-${index}`,
            name: `job-${index}`,
            unitAttribute: `job-${index},,jp1admin,`,
            unitType: "j",
            absolutePath: `/root/job-${index}`,
            depth: 1,
            parentId: rootUnit.id,
            isRoot: false,
            isRootJobnet: false,
            parameters: [{ key: "ty", value: "j" }],
            children: [],
          })),
        },
      ],
    };
    const message = createViewerDocumentChangedMessage(
      toUnitListDocumentDto(largeDocument),
    );
    const payload = message.data;
    assert.ok(payload);
    assert.strictEqual(payload.rootUnits[0]?.children.length, childCount);
    assert.strictEqual(payload.unitList.rows.length, childCount + 1);
    assert.strictEqual(payload.unitList.units.length, childCount + 1);

    assertPlainJsonValue(message);
    const restored = JSON.parse(JSON.stringify(message)) as unknown;
    assert.deepStrictEqual(parseViewerHostMessage(restored), message);
  });

  test("rejects unknown, malformed, and non-plain envelopes", () => {
    class MessageEnvelope {
      readonly type = "revealUnit";
      readonly data = { absolutePath: "/root" };
    }

    for (const value of [
      undefined,
      { type: "unknown", data: {} },
      { type: "resource", data: { ...messagesResourceData(), extra: true } },
      { type: "revealUnit", data: {} },
      { type: "revealUnit", data: { absolutePath: "/root", extra: true } },
      { type: "resource", data: {} },
      { type: "changeDocument", data: [] },
      { type: "changeDocument", data: {} },
      {
        type: "changeDocument",
        data: {
          rootUnits: ["not-a-unit"],
          warnings: [],
          unitDefinitions: [],
          unitList: { rows: [], units: [] },
        },
      },
      new MessageEnvelope(),
    ]) {
      assert.strictEqual(parseViewerHostMessage(value), undefined);
    }

    class NestedPayload {}
    const validMessage = createViewerDocumentChangedMessage(
      toUnitListDocumentDto(document),
    );
    const invalidNestedPayload = {
      type: "changeDocument",
      data: {
        ...validMessage.data,
        warnings: [new NestedPayload()],
      },
    };
    assert.strictEqual(parseViewerHostMessage(invalidNestedPayload), undefined);
  });

  test("plain JSON assertion rejects prohibited runtime values", () => {
    class Payload {}
    const circular: { self?: unknown } = {};
    circular.self = circular;

    for (const value of [
      { value: undefined },
      { value: Number.NaN },
      { value: BigInt(1) },
      { value: () => undefined },
      { value: Symbol("value") },
      { value: new Payload() },
      circular,
    ]) {
      assert.throws(() => assertPlainJsonValue(value));
    }
  });
});
