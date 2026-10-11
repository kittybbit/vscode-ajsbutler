/* eslint-disable @typescript-eslint/no-unused-vars */
import * as path from "path";
import Mocha from "mocha";
import { glob } from "glob";
import { JSDOM } from "jsdom";
import { register as registerPaths } from "tsconfig-paths";

const domGlobalNames = [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "DocumentFragment",
  "Node",
  "Element",
  "SVGElement",
  "Event",
  "MessageEvent",
  "KeyboardEvent",
  "MouseEvent",
  "MutationObserver",
  "ResizeObserver",
  "IntersectionObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT",
] as const;

const testGlobalNames = [
  "DEVELOPMENT",
  "CONNECTION_STRING",
  ...domGlobalNames,
] as const;

export function run(): Promise<void> {
  const originalDescriptors = new Map<string, PropertyDescriptor | undefined>(
    testGlobalNames.map(
      (name) =>
        [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const,
    ),
  );
  let ownedDom: JSDOM | undefined;

  const restoreGlobals = (): void => {
    const failures: string[] = [];
    for (const name of testGlobalNames) {
      const descriptor = originalDescriptors.get(name);
      const restored =
        descriptor === undefined
          ? Reflect.deleteProperty(globalThis, name)
          : Reflect.defineProperty(globalThis, name, descriptor);
      if (!restored) {
        failures.push(name);
      }
    }
    if (failures.length > 0) {
      throw new Error(`Could not restore test globals: ${failures.join(", ")}`);
    }
  };

  let unregisterPaths: (() => void) | undefined;
  const cleanUp = (): unknown[] => {
    const failures: unknown[] = [];
    const unregister = unregisterPaths;
    unregisterPaths = undefined;
    if (unregister !== undefined) {
      try {
        unregister();
      } catch (error) {
        failures.push(error);
      }
    }
    try {
      restoreGlobals();
    } catch (error) {
      failures.push(error);
    }
    const dom = ownedDom;
    ownedDom = undefined;
    if (dom !== undefined) {
      try {
        dom.window.close();
      } catch (error) {
        failures.push(error);
      }
    }
    return failures;
  };

  const rejectAfterCleanUp = (failure: unknown): Promise<never> => {
    const cleanupFailures = cleanUp();
    if (cleanupFailures.length === 0) {
      return Promise.reject(failure);
    }
    return Promise.reject(
      new AggregateError(
        [failure, ...cleanupFailures],
        `Test run failed: ${String(failure)}; cleanup failed: ${cleanupFailures
          .map(String)
          .join("; ")}`,
      ),
    );
  };

  const resolveAfterCleanUp = (): void => {
    const cleanupFailures = cleanUp();
    if (cleanupFailures.length > 0) {
      throw new AggregateError(
        cleanupFailures,
        `Test run completed but cleanup failed: ${cleanupFailures
          .map(String)
          .join("; ")}`,
      );
    }
  };

  console.log("[desktop-test] initializing aliases, defines and DOM");
  try {
    ownedDom = new JSDOM("<!doctype html><html><body></body></html>", {
      url: "http://localhost/",
    });
    const domWindow = ownedDom.window;
    const requestAnimationFrame = (callback: FrameRequestCallback): number =>
      domWindow.setTimeout(() => callback(domWindow.performance.now()), 0);
    const cancelAnimationFrame = (handle: number): void =>
      domWindow.clearTimeout(handle);
    domWindow.requestAnimationFrame = requestAnimationFrame;
    domWindow.cancelAnimationFrame = cancelAnimationFrame;
    domWindow.HTMLElement.prototype.scrollIntoView = () => undefined;
    domWindow.HTMLElement.prototype.scrollTo = () => undefined;
    Object.defineProperty(domWindow, "matchMedia", {
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
    const noOpObserver = class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    };
    const globalOverrides: Record<string, unknown> = {
      DEVELOPMENT: true,
      CONNECTION_STRING: "",
      window: domWindow,
      document: domWindow.document,
      navigator: domWindow.navigator,
      HTMLElement: domWindow.HTMLElement,
      DocumentFragment: domWindow.DocumentFragment,
      Node: domWindow.Node,
      Element: domWindow.Element,
      SVGElement: domWindow.SVGElement,
      Event: domWindow.Event,
      MessageEvent: domWindow.MessageEvent,
      KeyboardEvent: domWindow.KeyboardEvent,
      MouseEvent: domWindow.MouseEvent,
      MutationObserver: domWindow.MutationObserver,
      ResizeObserver: noOpObserver,
      IntersectionObserver: noOpObserver,
      getComputedStyle: domWindow.getComputedStyle.bind(domWindow),
      requestAnimationFrame,
      cancelAnimationFrame,
      IS_REACT_ACT_ENVIRONMENT: true,
    };
    for (const name of testGlobalNames) {
      const value = globalOverrides[name];
      if (
        !Reflect.defineProperty(globalThis, name, {
          configurable: true,
          enumerable: true,
          writable: true,
          value,
        })
      ) {
        throw new Error(`Could not initialize test global: ${name}`);
      }
    }
    unregisterPaths = registerPaths({
      baseUrl: path.resolve(__dirname, "../.."),
      paths: {
        "@resource/*": ["resource/*"],
        "@generate/*": ["generate/*"],
      },
      addMatchAll: false,
    });
  } catch (error) {
    console.error("[desktop-test] initialization failed", error);
    return rejectAfterCleanUp(error);
  }

  const runTests = async (): Promise<void> => {
    const mocha = new Mocha({
      ui: "tdd",
      color: true,
    });

    const testsRoot = path.resolve(__dirname, "..");
    const files = await glob("**/**.test.js", { cwd: testsRoot });
    files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)));
    console.log(`[desktop-test] loading ${files.length} test files`);
    try {
      // Mocha exposes synchronous loading at runtime; its declarations mark it protected.
      (mocha as unknown as { loadFiles(): void }).loadFiles();
    } catch (error) {
      console.error("[desktop-test] test-file loading failed", error);
      throw error;
    }
    console.log("[desktop-test] executing test cases");

    await new Promise<void>((resolve, reject) => {
      try {
        mocha.run((failures) => {
          console.log(`[desktop-test] cases completed: ${failures} failures`);
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  return runTests().then(
    () => {
      resolveAfterCleanUp();
      console.log("[desktop-test] suite completed and resources restored");
    },
    (error: unknown) => rejectAfterCleanUp(error),
  );
}
