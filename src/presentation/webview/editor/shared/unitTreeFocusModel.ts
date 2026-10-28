export const resolveUnitTreeFocusCandidate = (
  visibleUnitIds: readonly string[],
  focusedUnitId: string | undefined,
  selectedUnitId: string | undefined,
): string | undefined => {
  if (focusedUnitId && visibleUnitIds.includes(focusedUnitId)) {
    return focusedUnitId;
  }
  return (
    visibleUnitIds.find((unitId) => unitId === selectedUnitId) ??
    visibleUnitIds[0]
  );
};

export const resolveUnitTreeFocusRequestTarget = (
  visibleUnitIds: readonly string[],
  requestedUnitId: string | undefined,
): string | undefined => {
  if (requestedUnitId && !visibleUnitIds.includes(requestedUnitId)) {
    return undefined;
  }
  return requestedUnitId ?? visibleUnitIds[0];
};

export const shouldRestoreUnitTreeFallbackFocus = (
  focusedUnitId: string | undefined,
  fallbackUnitId: string | undefined,
  focusWasInsideFocusedRow: boolean,
): boolean =>
  Boolean(
    focusedUnitId &&
      fallbackUnitId &&
      focusedUnitId !== fallbackUnitId &&
      focusWasInsideFocusedRow,
  );
