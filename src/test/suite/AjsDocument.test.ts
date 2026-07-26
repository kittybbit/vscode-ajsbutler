import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryProperties } from "../../application/telemetry/telemetryEvent";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  createDebouncedAjsDocumentChange,
  createReadyAjsDocument,
} from "../../presentation/vscode/webview/ajsDocument";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { CHANGE_DOCUMENT } from "../../presentation/webview/viewerHostMessages";

suite("ajsDocument", () => {
  const buildUnitList = () => ({ errors: [], document: undefined });
  const normalizedDocument: AjsDocument = {
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
    warnings: [
      {
        code: "missing_relation_target",
        message: "relation target was not found",
        unitPath: "/root",
      },
    ],
  };
  const documentDto = toUnitListDocumentDto(normalizedDocument);

  test("posts the normalized document on ready", () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    const telemetryEvents: Array<{
      eventName: string;
      properties?: TelemetryProperties;
    }> = [];
    const document = {
      getText() {
        return "";
      },
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage(message: { type: string; data: unknown }) {
          posted.push(message);
        },
      },
    } as vscode.WebviewPanel;
    const buildDocument = () => ({ errors: [], document: documentDto });

    createReadyAjsDocument(buildDocument, {
      report: (event) => {
        telemetryEvents.push({
          eventName: event.name,
          properties: event.properties,
        });
      },
      dispose() {},
    })(document, panel);

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
    assert.deepStrictEqual(posted[0]?.data, documentDto);
    assert.deepStrictEqual(
      documentDto.unitList.rows.map((row) => row.id),
      ["root-id"],
    );
    assert.deepStrictEqual(
      documentDto.unitList.units[0]?.parameterSearchValues,
      ["n"],
    );
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(posted[0]?.data)),
      documentDto,
    );
    assert.deepStrictEqual(
      {
        ...telemetryEvents[0]?.properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        operation: "unit_list_build",
        result: "success",
        durationBucket: "<bucket>",
      },
    );
    assert.strictEqual(
      telemetryEvents[0]?.eventName,
      "performance.unit_list_build.completed",
    );
    assert.ok(telemetryEvents[0]?.properties?.durationBucket);
  });

  test("debounces repeated change events for the same document", async () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    const document = {
      getText() {
        return "";
      },
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage(message: { type: string; data: unknown }) {
          posted.push(message);
        },
      },
    } as vscode.WebviewPanel;

    const onChange = createDebouncedAjsDocumentChange(buildUnitList, 5);
    onChange(document, panel);
    onChange(document, panel);

    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
    assert.strictEqual(posted[0]?.data, null);
  });
});
