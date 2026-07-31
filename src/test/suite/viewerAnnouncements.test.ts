import * as assert from "assert";
import {
  applyViewerAnnouncement,
  type ViewerAnnouncement,
} from "../../presentation/webview/editor/shared/viewerAnnouncements";

suite("Viewer announcements", () => {
  test("suppresses repeated events without changing the revision", () => {
    const first = applyViewerAnnouncement(undefined, {
      eventKey: "flow:selected:job-1",
      message: "Selected job-1.",
    });
    const repeated = applyViewerAnnouncement(first, {
      eventKey: "flow:selected:job-1",
      message: "Selected job-1.",
    });

    assert.deepStrictEqual(repeated, first);
  });

  test("increments the live-region revision for a new event", () => {
    const first = applyViewerAnnouncement(undefined, {
      eventKey: "table:search:1",
      message: "One result.",
    });
    const next = applyViewerAnnouncement(first, {
      eventKey: "table:search:2",
      message: "Two results.",
      politeness: "assertive",
    });

    assert.deepStrictEqual(next, {
      eventKey: "table:search:2",
      message: "Two results.",
      politeness: "assertive",
      revision: 2,
    } satisfies ViewerAnnouncement);
  });

  test("ignores empty messages", () => {
    const previous = {
      eventKey: "previous",
      message: "Previous.",
      politeness: "polite" as const,
      revision: 1,
    };
    assert.strictEqual(
      applyViewerAnnouncement(previous, {
        eventKey: "empty",
        message: "",
      }),
      previous,
    );
  });
});
