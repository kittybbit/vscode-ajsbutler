import * as assert from "assert";
import {
  SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES,
  createScheduleImpactCalendarCloseMessage,
  createScheduleImpactCalendarError,
  createScheduleImpactCalendarFailureMessage,
  createScheduleImpactCalendarReadyRequest,
  createScheduleImpactCalendarSessionMessage,
  parseScheduleImpactCalendarHostMessage,
  parseScheduleImpactCalendarRequest,
  serializeScheduleImpactCalendarMessage,
  validateScheduleImpactCalendarMessage,
} from "../../presentation/vscode/webview/scheduleImpactCalendar/scheduleImpactCalendarTransport";

suite("Schedule impact calendar transport", () => {
  test("accepts only the closed request and response envelopes", () => {
    const request = createScheduleImpactCalendarReadyRequest("calendar-1", 1);
    assert.deepStrictEqual(request, {
      type: "ready",
      sessionId: "calendar-1",
      requestId: 1,
    });
    assert.ok(parseScheduleImpactCalendarRequest(request));
    assert.strictEqual(
      parseScheduleImpactCalendarRequest({ ...request, extra: true }),
      undefined,
    );
    const session = createScheduleImpactCalendarSessionMessage(
      "calendar-1",
      1,
      {} as never,
    );
    assert.ok(
      parseScheduleImpactCalendarHostMessage(session, {
        expectedSessionId: "calendar-1",
      }),
    );
    assert.strictEqual(
      parseScheduleImpactCalendarHostMessage({ ...session, error: {} }),
      undefined,
    );
    const failure = createScheduleImpactCalendarFailureMessage(
      null,
      null,
      createScheduleImpactCalendarError("unknown-session"),
    );
    assert.ok(parseScheduleImpactCalendarHostMessage(failure));
  });

  test("dispatches each closed host type and rejects unrecognized discriminants", () => {
    const messages = [
      createScheduleImpactCalendarCloseMessage("calendar-1"),
      createScheduleImpactCalendarSessionMessage("calendar-1", 1, {
        value: "ok",
      } as never),
      createScheduleImpactCalendarFailureMessage(
        null,
        null,
        createScheduleImpactCalendarError("unknown-session"),
      ),
    ];
    messages.forEach((message) => {
      const result = validateScheduleImpactCalendarMessage(message);
      assert.strictEqual(result.ok, true);
    });

    ["unknown", "__proto__", "valueOf", "constructor", 42, {}].forEach(
      (type) => {
        const result = validateScheduleImpactCalendarMessage({
          type,
          sessionId: "calendar-1",
          requestId: null,
          ok: true,
          payload: null,
          error: null,
        });
        assert.deepStrictEqual(result, { ok: false, code: "invalid-request" });
      },
    );
  });

  test("rejects stale, malformed, and oversized messages before transport", () => {
    const request = createScheduleImpactCalendarReadyRequest("calendar-1", 2);
    assert.strictEqual(
      parseScheduleImpactCalendarRequest(request, { minimumRequestId: 2 }),
      undefined,
    );
    const stale = validateScheduleImpactCalendarMessage(request, {
      minimumRequestId: 2,
    });
    assert.strictEqual(stale.ok, false);
    if (!stale.ok) assert.strictEqual(stale.code, "stale-request");
    assert.strictEqual(
      parseScheduleImpactCalendarRequest({ ...request, requestId: Number.NaN }),
      undefined,
    );
    const oversized = createScheduleImpactCalendarSessionMessage(
      "calendar-1",
      1,
      {
        value: "x".repeat(SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES),
      } as never,
    );
    const serialized = serializeScheduleImpactCalendarMessage(oversized);
    assert.strictEqual(serialized.ok, false);
    if (!serialized.ok)
      assert.strictEqual(serialized.error.code, "payload-too-large");
  });

  test("accepts the inclusive encoded byte boundary", () => {
    const empty = createScheduleImpactCalendarSessionMessage("calendar-1", 1, {
      value: "",
    } as never);
    const baseBytes = new TextEncoder().encode(
      JSON.stringify(empty),
    ).byteLength;
    const exact = createScheduleImpactCalendarSessionMessage("calendar-1", 1, {
      value: "x".repeat(SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES - baseBytes),
    } as never);
    const serialized = serializeScheduleImpactCalendarMessage(exact);
    assert.strictEqual(serialized.ok, true);
    if (serialized.ok) {
      assert.strictEqual(
        serialized.bytes,
        SCHEDULE_IMPACT_CALENDAR_MAX_MESSAGE_BYTES,
      );
    }
  });

  test("rejects non-JSON values recursively before serialization", () => {
    const malformedPayloads = [
      { nested: { missing: undefined } },
      { nested: ["ok", undefined] },
      { callback: () => undefined },
      { symbol: Symbol("payload") },
      { bigint: BigInt(1) },
      { cyclic: undefined as unknown },
    ];
    const cyclic = malformedPayloads.at(-1) as { cyclic: unknown };
    cyclic.cyclic = cyclic;

    malformedPayloads.forEach((payload) => {
      const message = createScheduleImpactCalendarSessionMessage(
        "calendar-1",
        1,
        payload as never,
      );
      assert.strictEqual(
        parseScheduleImpactCalendarHostMessage(message),
        undefined,
      );
      const serialized = serializeScheduleImpactCalendarMessage(message);
      assert.strictEqual(serialized.ok, false);
      if (!serialized.ok)
        assert.strictEqual(serialized.error.code, "invalid-request");
    });
  });

  test("preserves strict container rules and validation error precedence", () => {
    const inherited = Object.create({ inherited: true }) as {
      value?: string;
    };
    inherited.value = "not plain";
    const sparse = [] as unknown[];
    sparse.length = 1;
    const payloads = [
      inherited,
      { toJSON: () => ({}) },
      { [Symbol("payload")]: "symbol" },
      sparse,
      { number: Number.POSITIVE_INFINITY },
    ];
    payloads.forEach((payload) => {
      const message = createScheduleImpactCalendarSessionMessage(
        "calendar-1",
        1,
        payload as never,
      );
      assert.strictEqual(
        parseScheduleImpactCalendarHostMessage(message),
        undefined,
      );
      const serialized = serializeScheduleImpactCalendarMessage(message);
      assert.strictEqual(serialized.ok, false);
      if (!serialized.ok)
        assert.strictEqual(serialized.error.code, "invalid-request");
    });

    const oversized = createScheduleImpactCalendarSessionMessage(
      "calendar-1",
      1,
      { value: "x".repeat(100) } as never,
    );
    const tooLarge = validateScheduleImpactCalendarMessage(oversized, {
      expectedSessionId: "other-session",
      maxBytes: 10,
    });
    assert.strictEqual(tooLarge.ok, false);
    if (!tooLarge.ok) assert.strictEqual(tooLarge.code, "payload-too-large");
    const unknown = validateScheduleImpactCalendarMessage(oversized, {
      expectedSessionId: "other-session",
    });
    assert.strictEqual(unknown.ok, false);
    if (!unknown.ok) assert.strictEqual(unknown.code, "unknown-session");
    const stale = validateScheduleImpactCalendarMessage(oversized, {
      minimumRequestId: 1,
    });
    assert.strictEqual(stale.ok, false);
    if (!stale.ok) assert.strictEqual(stale.code, "stale-request");
  });

  test("rejects reserved host type names as malformed messages", () => {
    ["__proto__", "valueOf", "constructor"].forEach((type) => {
      const result = parseScheduleImpactCalendarHostMessage({
        type,
        sessionId: "calendar-1",
        requestId: null,
        ok: true,
        payload: null,
        error: null,
      });
      assert.strictEqual(result, undefined);
    });
  });
});
