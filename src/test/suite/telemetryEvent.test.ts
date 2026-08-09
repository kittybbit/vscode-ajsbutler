import * as assert from "assert";
import {
  allowTelemetryProperties,
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryProperties,
  type TelemetryPropertyKey,
} from "../../application/telemetry/telemetryEvent";
import type { ValidatedTelemetryEvent } from "../../application/telemetry/TelemetryPort";

type RawTelemetryEvent = Readonly<{
  name: string;
  properties: TelemetryProperties;
}>;

type RawEventIsValidated = RawTelemetryEvent extends ValidatedTelemetryEvent
  ? true
  : false;

suite("Telemetry event schema", () => {
  test("requires factory validation for telemetry event assignment", () => {
    const rawEventIsValidated: RawEventIsValidated = false;
    const mutateValidatedProperties = (
      event: ValidatedTelemetryEvent,
    ): void => {
      // @ts-expect-error Validated properties must remain immutable after filtering.
      event.properties.filePath = "/secret/example.ajs";
    };

    assert.strictEqual(rawEventIsValidated, false);
    assert.strictEqual(typeof mutateValidatedProperties, "function");
  });

  test("preserves the exact legacy event and property baseline", () => {
    const events = [
      createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyExtensionDeactivated, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyTableViewerOpened, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyFlowViewerOpened, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyWebviewOperation, {
        development: false,
        viewType: "ajsbutler.tableViewer",
        operation: "copy.csv",
        filePath: "/secret/example.ajs",
      }),
    ];

    assert.deepStrictEqual(events, [
      { name: "ext.activate", properties: { development: "false" } },
      { name: "ext.deactivate", properties: { development: "false" } },
      {
        name: "ajsbutler.tableViewer",
        properties: { development: "false" },
      },
      {
        name: "ajsbutler.flowViewer",
        properties: { development: "false" },
      },
      {
        name: "operation",
        properties: {
          development: "false",
          viewType: "ajsbutler.tableViewer",
          operation: "copy.csv",
        },
      },
    ]);
  });

  test("preserves the complete event-name catalog", () => {
    assert.deepStrictEqual(
      Object.values(telemetryEvents).map(({ name }) => name),
      [
        "ext.activate",
        "ext.deactivate",
        "ajsbutler.tableViewer",
        "ajsbutler.flowViewer",
        "operation",
        "extension.lifecycle.activated",
        "extension.lifecycle.deactivated",
        "extension.lifecycle.telemetry_initialized",
        "viewer.table.open_started",
        "viewer.table.ready",
        "viewer.table.closed",
        "viewer.flow.open_started",
        "viewer.flow.ready",
        "viewer.flow.closed",
        "webapi_import.workflow.started",
        "webapi_import.workflow.cancelled",
        "webapi_import.workflow.failed",
        "webapi_import.workflow.completed",
        "webapi_import.workflow.unsupported_host",
        "viewer.table.csv_copied",
        "viewer.table.csv_saved",
        "viewer.table.unit_selected",
        "viewer.table.definition_opened",
        "viewer.table.navigate_to_flow",
        "viewer.flow.unit_selected",
        "viewer.flow.definition_opened",
        "viewer.flow.scope_opened",
        "viewer.flow.nested_expansion_toggled",
        "viewer.flow.relationship_focus_toggled",
        "viewer.flow.minimap_toggled",
        "viewer.flow.navigate_to_table",
        "search.table.submitted",
        "search.table.navigated",
        "search.table.cleared",
        "search.flow.submitted",
        "search.flow.navigated",
        "search.flow.cleared",
        "editor.diagnostics.evaluated",
        "editor.diagnostics.reported",
        "editor.hover.requested",
        "editor.hover.resolved",
        "performance.unit_list_build.completed",
        "performance.parse.completed",
        "performance.flow_graph_build.completed",
        "performance.table_render.ready",
        "performance.flow_render.ready",
        "performance.csv_export.completed",
      ],
    );
  });

  test("creates an event with only allowlisted string properties", () => {
    const event = createTelemetryEvent(
      telemetryEvents.extensionLifecycleActivated,
      {
        development: false,
        host: "desktop",
        result: "success",
        extra: "ignored",
      },
    );

    assert.deepStrictEqual(event, {
      name: "extension.lifecycle.activated",
      properties: {
        development: "false",
        host: "desktop",
        result: "success",
      },
    });
  });

  test("omits null and undefined properties", () => {
    const properties = allowTelemetryProperties(
      [telemetryPropertyKeys.host, telemetryPropertyKeys.errorCode],
      {
        host: undefined,
        errorCode: null,
      },
    );

    assert.deepStrictEqual(properties, {});
  });

  test("omits forbidden content keys even when mixed with approved metadata", () => {
    const properties = allowTelemetryProperties(
      [
        telemetryPropertyKeys.host,
        telemetryPropertyKeys.result,
        telemetryPropertyKeys.durationBucket,
      ],
      {
        command: "unit-command",
        filePath: "/secret/example.ajs",
        host: "web",
        result: "failed",
        searchText: "raw query",
        durationBucket: "100_499ms",
        unitName: "sensitive-unit",
      },
    );

    assert.deepStrictEqual(properties, {
      host: "web",
      result: "failed",
      durationBucket: "100_499ms",
    });
  });

  test("omits forbidden content keys even if a schema accidentally allows them", () => {
    const properties = allowTelemetryProperties(
      ["filePath", telemetryPropertyKeys.host] as TelemetryPropertyKey[],
      {
        filePath: "/secret/example.ajs",
        host: "desktop",
      },
    );

    assert.deepStrictEqual(properties, {
      host: "desktop",
    });
  });

  test("omits the complete forbidden content, path, identifier, and error set", () => {
    const properties = allowTelemetryProperties(
      [
        "baseUrl",
        "comment",
        "command",
        "credential",
        "credentialRef",
        "definition",
        "definitionContent",
        "fileName",
        "filePath",
        "fileUri",
        "jobName",
        "location",
        "manager",
        "managerName",
        "organizationName",
        "orgName",
        "password",
        "path",
        "prompt",
        "rawError",
        "rawResponse",
        "response",
        "searchText",
        "serverName",
        "service",
        "serviceName",
        "stack",
        "stackTrace",
        "token",
        "unitName",
        "url",
        "userName",
        "username",
        telemetryPropertyKeys.host,
      ] as TelemetryPropertyKey[],
      {
        baseUrl: "https://example.invalid",
        comment: "secret comment",
        command: "open.command",
        credential: "secret credential",
        credentialRef: "secret-ref",
        definition: "definition content",
        definitionContent: "definition content",
        fileName: "example.ajs",
        filePath: "/secret/example.ajs",
        fileUri: "file:///secret/example.ajs",
        jobName: "secret-job",
        location: "secret-location",
        manager: "secret-manager",
        managerName: "secret-manager",
        organizationName: "secret-org",
        orgName: "secret-org",
        password: "secret-password",
        path: "/secret/example.ajs",
        prompt: "secret-prompt",
        rawError: "Error: secret",
        rawResponse: "secret response",
        response: "secret response",
        searchText: "secret query",
        serverName: "secret-server",
        service: "secret-service",
        serviceName: "secret-service",
        stack: "secret stack",
        stackTrace: "secret stack",
        token: "secret-token",
        unitName: "secret-unit",
        url: "https://example.invalid/secret",
        userName: "secret-user",
        username: "secret-user",
        host: "desktop",
      },
    );

    assert.deepStrictEqual(properties, { host: "desktop" });
  });
});
