export type FlowViewerShortcut = "detail" | "selector";

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
  if (altKey || ctrlKey || metaKey || shiftKey) return undefined;
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "d") return "detail";
  if (normalizedKey === "l") return "selector";
  return undefined;
};
