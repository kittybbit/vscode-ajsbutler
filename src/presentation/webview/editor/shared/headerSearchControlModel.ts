export type HeaderSearchDirection = "previous" | "next";

export type HeaderSearchResultPosition = {
  current: number;
  total: number;
};

export type HeaderSearchHelperTextLabels = {
  noResults: string;
  matched: string;
  idle: string;
};

export type HeaderSearchNavigationLabels = {
  resultAriaLabel: (position: HeaderSearchResultPosition) => string;
  previousTooltip: string;
  previousAriaLabel: string;
  nextTooltip: string;
  nextAriaLabel: string;
};

export type HeaderSearchControlLabels = {
  helperText: HeaderSearchHelperTextLabels;
  navigation: HeaderSearchNavigationLabels;
};

export type HeaderSearchControlProps<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = {
  matchedTargetId?: string;
  resultPosition?: HeaderSearchResultPosition;
  placeholderLabel: string;
  labels: HeaderSearchControlLabels;
  onSearchNavigate: (query: string, direction: TDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
};

export type HeaderSearchControlStateParams<
  TDirection extends HeaderSearchDirection = HeaderSearchDirection,
> = Pick<
  HeaderSearchControlProps<TDirection>,
  "onSearchClear" | "onSearchNavigate" | "onSearchSubmit"
>;

type SearchShortcutEvent = Pick<
  globalThis.KeyboardEvent,
  "ctrlKey" | "key" | "metaKey"
>;

export type HeaderSearchInputRef = {
  current: { focus: () => void } | null;
};

export const isHeaderSearchShortcut = (
  event: SearchShortcutEvent,
  isMac: boolean,
): boolean => (isMac ? event.metaKey : event.ctrlKey) && event.key === "f";

export const isMacBrowserPlatform = (platform: string | undefined): boolean =>
  platform?.toLowerCase().startsWith("mac") ?? false;

export const formatHeaderSearchPlaceholder = (
  label: string,
  isMac: boolean,
): string => `${label}...(${isMac ? "\u2318" : "CTRL+"}F)`;

export const focusHeaderSearchFromShortcut = (
  event: globalThis.KeyboardEvent,
  isMac: boolean,
  inputRef: HeaderSearchInputRef,
): boolean => {
  if (!isHeaderSearchShortcut(event, isMac)) {
    return false;
  }
  event.preventDefault();
  inputRef.current?.focus();
  return true;
};

export const resolveHeaderSearchHelperText = (
  matchedTargetId: string | undefined,
  resultPosition: HeaderSearchResultPosition | undefined,
  labels: HeaderSearchHelperTextLabels,
): string => {
  if (resultPosition?.total === 0) {
    return labels.noResults;
  }
  return matchedTargetId ? labels.matched : labels.idle;
};
