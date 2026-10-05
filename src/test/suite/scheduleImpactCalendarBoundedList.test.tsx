import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import { VirtuosoMockContext } from "react-virtuoso";
import { ScheduleImpactCalendarBoundedList } from "../../presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList";
import { SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD } from "../../presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel";

type GlobalValue = {
  key: string;
  descriptor: PropertyDescriptor | undefined;
};

const installDom = (): { dom: JSDOM; globals: GlobalValue[] } => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const globals: GlobalValue[] = [];
  const resizeObserver = class {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  };
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    dom.window.setTimeout(() => callback(dom.window.performance.now()), 0);
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    DocumentFragment: dom.window.DocumentFragment,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: resizeObserver,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame,
    cancelAnimationFrame: (handle: number): void =>
      dom.window.clearTimeout(handle),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  dom.window.requestAnimationFrame = requestAnimationFrame;
  dom.window.cancelAnimationFrame = values.cancelAnimationFrame as (
    handle: number,
  ) => void;
  Object.defineProperty(dom.window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  Object.entries(values).forEach(([key, value]) => {
    globals.push({
      key,
      descriptor: Object.getOwnPropertyDescriptor(globalThis, key),
    });
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  });
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  Object.defineProperties(dom.window.HTMLElement.prototype, {
    clientHeight: {
      configurable: true,
      get: () => 480,
    },
    offsetHeight: {
      configurable: true,
      get: () => 480,
    },
    scrollHeight: {
      configurable: true,
      get: () => 480_000,
    },
  });
  dom.window.HTMLElement.prototype.scrollTo = function scrollTo(
    optionsOrX?: ScrollToOptions | number,
    y?: number,
  ): void {
    const top = typeof optionsOrX === "number" ? y : optionsOrX?.top;
    if (typeof top !== "number") return;
    this.scrollTop = top;
    this.dispatchEvent(new dom.window.Event("scroll"));
  };
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const createItems = (count: number): React.ReactElement[] =>
  Array.from({ length: count }, (_, index) => (
    <li id={`item-${index}`} key={index}>
      Item {index}
    </li>
  ));

const boundedList = (
  items: readonly React.ReactElement[],
): React.ReactElement => (
  <ScheduleImpactCalendarBoundedList ariaLabel="Schedule items" items={items} />
);

suite("Schedule impact calendar bounded list", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(async () => {
    cleanup();
    await new Promise<void>((resolve) => setImmediate(resolve));
    restoreDom(dom, globals);
  });

  test("preserves small-list semantics and chains original handlers", () => {
    let focused = 0;
    let keyed = 0;
    const items = [
      <li
        id="first"
        key="first"
        onFocus={() => {
          focused += 1;
        }}
        onKeyDown={() => {
          keyed += 1;
        }}
      >
        First
      </li>,
      <li id="second" key="second">
        Second
      </li>,
    ];
    const view = render(boundedList(items));
    const list = view.getByRole("list", { name: "Schedule items" });
    const first = view.container.querySelector("#first") as HTMLElement;
    const second = view.container.querySelector("#second") as HTMLElement;

    assert.strictEqual(list.tagName, "UL");
    assert.strictEqual(
      list.getAttribute("data-schedule-impact-calendar-list-count"),
      "2",
    );
    assert.strictEqual(first.tabIndex, 0);
    assert.strictEqual(first.getAttribute("aria-posinset"), "1");
    assert.strictEqual(first.getAttribute("aria-setsize"), "2");
    assert.strictEqual(second.tabIndex, -1);

    act(() => {
      first.focus();
      fireEvent.keyDown(first, { key: "ArrowDown" });
    });
    assert.ok(dom.window.document.activeElement === second);
    assert.strictEqual(focused, 1);
    assert.strictEqual(keyed, 1);
  });

  test("clamps the active item when a nonempty list shrinks", async () => {
    const view = render(boundedList(createItems(4)));
    const last = view.container.querySelector("#item-3") as HTMLElement;
    act(() => last.focus());
    assert.strictEqual(last.tabIndex, 0);

    view.rerender(boundedList(createItems(2)));
    await waitFor(() => {
      const first = view.container.querySelector("#item-0") as HTMLElement;
      const second = view.container.querySelector("#item-1") as HTMLElement;
      assert.strictEqual(first.tabIndex, -1);
      assert.strictEqual(second.tabIndex, 0);
      assert.strictEqual(second.getAttribute("aria-posinset"), "2");
      assert.strictEqual(second.getAttribute("aria-setsize"), "2");
    });
  });

  test("switches to virtualization only above the configured threshold", async () => {
    const view = render(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 48, viewportHeight: 480 }}
      >
        {boundedList(
          createItems(SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD),
        )}
      </VirtuosoMockContext.Provider>,
    );
    const smallList = view.getByRole("list", { name: "Schedule items" });
    assert.strictEqual(smallList.tagName, "UL");
    assert.strictEqual(
      smallList.getAttribute("data-schedule-impact-calendar-list-count"),
      String(SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD),
    );

    view.rerender(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 48, viewportHeight: 480 }}
      >
        {boundedList(
          createItems(SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD + 1),
        )}
      </VirtuosoMockContext.Provider>,
    );
    await waitFor(() => {
      const virtualizedList = view.getByRole("list", {
        name: "Schedule items",
      });
      assert.strictEqual(virtualizedList.tagName, "DIV");
      assert.strictEqual(
        virtualizedList.getAttribute(
          "data-schedule-impact-calendar-list-count",
        ),
        String(SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD + 1),
      );
      assert.ok(
        view.container.querySelector(
          `[aria-setsize='${SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD + 1}']`,
        ),
      );
    });
  });

  test("moves focus to virtualized End and Home rows", async () => {
    const itemCount = SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD + 2;
    const view = render(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 48, viewportHeight: 480 }}
      >
        {boundedList(createItems(itemCount))}
      </VirtuosoMockContext.Provider>,
    );
    await waitFor(() => assert.ok(view.container.querySelector("#item-0")));

    const first = view.container.querySelector("#item-0") as HTMLElement;
    act(() => {
      first.focus();
      fireEvent.keyDown(first, { key: "End" });
    });
    await waitFor(
      () => {
        const last = view.container.querySelector(
          `#item-${itemCount - 1}`,
        ) as HTMLElement | null;
        assert.ok(last);
        assert.ok(
          dom.window.document.activeElement === last,
          "End focuses the last virtual row",
        );
        assert.strictEqual(last.tabIndex, 0);
      },
      { timeout: 3_000 },
    );

    const last = view.container.querySelector(
      `#item-${itemCount - 1}`,
    ) as HTMLElement;
    act(() => fireEvent.keyDown(last, { key: "Home" }));
    await waitFor(
      () => {
        const firstAgain = view.container.querySelector(
          "#item-0",
        ) as HTMLElement | null;
        assert.ok(firstAgain);
        assert.ok(
          dom.window.document.activeElement === firstAgain,
          "Home focuses the first virtual row",
        );
        assert.strictEqual(firstAgain.tabIndex, 0);
      },
      { timeout: 3_000 },
    );
  }).timeout(10_000);
});
