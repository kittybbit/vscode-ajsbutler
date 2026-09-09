import { useEffect, useState } from "react";

export type SemanticDiffExplorerThemeMode = "light" | "dark";

export type SemanticDiffExplorerThemeModeEnvironment = Readonly<{
  document?: Document;
  matchMedia?: (query: string) => MediaQueryList;
  mutationObserver?: typeof MutationObserver;
}>;

const modeFromValue = (
  value: string | null | undefined,
): SemanticDiffExplorerThemeMode | undefined =>
  (["dark", "light"] as const).find((mode) =>
    value?.trim().toLowerCase().includes(mode),
  );

const modeFromElement = (
  element: Element | null,
): SemanticDiffExplorerThemeMode | undefined => {
  if (!element) return undefined;
  const attributeMode = [
    element.getAttribute("data-theme"),
    element.getAttribute("data-vscode-theme-kind"),
    element.getAttribute("data-color-scheme"),
  ]
    .map(modeFromValue)
    .find((mode): mode is SemanticDiffExplorerThemeMode => mode !== undefined);
  if (attributeMode) return attributeMode;
  return [...element.classList]
    .map(modeFromValue)
    .find((mode): mode is SemanticDiffExplorerThemeMode => mode !== undefined);
};

const browserDocument = (): Document | undefined =>
  typeof document === "undefined" ? undefined : document;

const browserMatchMedia = (query: string): MediaQueryList | undefined =>
  typeof window === "undefined" || typeof window.matchMedia !== "function"
    ? undefined
    : window.matchMedia(query);

const browserMutationObserver = (): typeof MutationObserver | undefined =>
  typeof MutationObserver === "undefined" ? undefined : MutationObserver;

const environmentDocument = (
  environment: SemanticDiffExplorerThemeModeEnvironment,
): Document | undefined => environment.document ?? browserDocument();

const environmentMatchMedia = (
  environment: SemanticDiffExplorerThemeModeEnvironment,
): ((query: string) => MediaQueryList) | undefined =>
  environment.matchMedia ?? browserMatchMedia;

const environmentMutationObserver = (
  environment: SemanticDiffExplorerThemeModeEnvironment,
): typeof MutationObserver | undefined =>
  environment.mutationObserver ?? browserMutationObserver();

const hostThemeMode = (
  documentValue: Document | undefined,
): SemanticDiffExplorerThemeMode | undefined => {
  if (!documentValue) return undefined;
  return (
    modeFromElement(documentValue.body) ??
    modeFromElement(documentValue.documentElement)
  );
};

export const resolveSemanticDiffExplorerThemeMode = (
  environment: SemanticDiffExplorerThemeModeEnvironment = {},
): SemanticDiffExplorerThemeMode => {
  const hostMode = hostThemeMode(environmentDocument(environment));
  if (hostMode) return hostMode;
  const mediaQuery = environmentMatchMedia(environment)?.(
    "(prefers-color-scheme: dark)",
  );
  return mediaQuery?.matches ? "dark" : "light";
};

type Cleanup = () => void;

const noCleanup: Cleanup = () => undefined;

type MediaModeSubscription = Readonly<{
  add: (listener: () => void) => void;
  remove: (listener: () => void) => void;
}>;

const modernMediaModeSubscription = (
  mediaQuery: MediaQueryList | undefined,
): MediaModeSubscription | undefined => {
  if (typeof mediaQuery?.addEventListener !== "function") return undefined;
  return {
    add: (listener) => mediaQuery.addEventListener("change", listener),
    remove: (listener) => mediaQuery.removeEventListener("change", listener),
  };
};

const legacyMediaModeSubscription = (
  mediaQuery: MediaQueryList | undefined,
): MediaModeSubscription | undefined => {
  if (typeof mediaQuery?.addListener !== "function") return undefined;
  return {
    add: mediaQuery.addListener.bind(mediaQuery),
    remove: mediaQuery.removeListener.bind(mediaQuery),
  };
};

const mediaModeSubscription = (
  mediaQuery: MediaQueryList | undefined,
): MediaModeSubscription | undefined =>
  [
    modernMediaModeSubscription(mediaQuery),
    legacyMediaModeSubscription(mediaQuery),
  ].find((subscription): subscription is MediaModeSubscription =>
    Boolean(subscription),
  );

const subscribeToMediaMode = (
  mediaQuery: MediaQueryList | undefined,
  emit: () => void,
): Cleanup => {
  const subscription = mediaModeSubscription(mediaQuery);
  subscription?.add(emit);
  return () => subscription?.remove(emit);
};

const subscribeToDocumentMode = (
  documentValue: Document | undefined,
  observerConstructor: typeof MutationObserver | undefined,
  emit: () => void,
): Cleanup => {
  if (!documentValue || !observerConstructor) return noCleanup;
  const observer = new observerConstructor(emit);
  const options: MutationObserverInit = {
    attributes: true,
    attributeFilter: [
      "class",
      "data-theme",
      "data-vscode-theme-kind",
      "data-color-scheme",
    ],
  };
  observer.observe(documentValue.documentElement, options);
  documentValue.body && observer.observe(documentValue.body, options);
  return () => observer.disconnect();
};

export const observeSemanticDiffExplorerThemeMode = (
  listener: (mode: SemanticDiffExplorerThemeMode) => void,
  environment: SemanticDiffExplorerThemeModeEnvironment = {},
): Cleanup => {
  const documentValue = environmentDocument(environment);
  const matchMedia = environmentMatchMedia(environment);
  const emit = (): void =>
    listener(resolveSemanticDiffExplorerThemeMode(environment));
  emit();
  const cleanups = [
    subscribeToDocumentMode(
      documentValue,
      environmentMutationObserver(environment),
      emit,
    ),
    subscribeToMediaMode(matchMedia?.("(prefers-color-scheme: dark)"), emit),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
};

export const useSemanticDiffExplorerThemeMode =
  (): SemanticDiffExplorerThemeMode => {
    const [mode, setMode] = useState<SemanticDiffExplorerThemeMode>(() =>
      resolveSemanticDiffExplorerThemeMode(),
    );
    useEffect(
      () =>
        observeSemanticDiffExplorerThemeMode((nextMode) => setMode(nextMode)),
      [],
    );
    return mode;
  };
