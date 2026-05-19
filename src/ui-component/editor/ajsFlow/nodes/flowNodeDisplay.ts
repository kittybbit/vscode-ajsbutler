export const shouldRenderNodeComment = (
  label?: string,
  comment?: string,
): boolean => !!comment && comment !== label;
