import * as assert from "assert";
import {
  pickSemanticDiffOutputMode,
  semanticDiffOutputModeItems,
} from "../../presentation/vscode/semantic-diff/report/semanticDiffOutputModePicker";

suite("Semantic diff output mode picker", () => {
  test("keeps the existing mode order and default placeholder", async () => {
    let receivedPlaceholder: string | undefined;
    const selected = await pickSemanticDiffOutputMode(
      async (items, options) => {
        receivedPlaceholder = options?.placeHolder;
        assert.deepStrictEqual(
          items.map(({ mode }) => mode),
          ["full", "summary", "audit", "json"],
        );
        return items[0];
      },
    );

    assert.strictEqual(receivedPlaceholder, "Select Semantic Diff Output");
    assert.strictEqual(selected, "full");
  });

  test("returns undefined when the chooser is cancelled", async () => {
    const selected = await pickSemanticDiffOutputMode(async (items) => {
      assert.strictEqual(items, semanticDiffOutputModeItems);
      return undefined;
    });

    assert.strictEqual(selected, undefined);
  });
});
