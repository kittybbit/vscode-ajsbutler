export type FlowViewerShortcut = "detail" | "selector";

const flowViewerShortcutsByKey: Readonly<Record<string, FlowViewerShortcut>> = {
  d: "detail",
  l: "selector",
};

type FlowViewerShortcutContext = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export const resolveFlowViewerShortcut = ({
  altKey = false,
  ctrlKey = false,
  key,
  metaKey = false,
  shiftKey = false,
}: FlowViewerShortcutContext): FlowViewerShortcut | undefined => {
  if (altKey || ctrlKey || metaKey || shiftKey) {
    return undefined;
  }
  const normalizedKey = key.toLowerCase();
  return Object.prototype.hasOwnProperty.call(
    flowViewerShortcutsByKey,
    normalizedKey,
  )
    ? flowViewerShortcutsByKey[normalizedKey]
    : undefined;
};
