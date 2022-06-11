export const only = <T>(arr: (T | null | undefined | false)[]): T[] => arr.filter(
  (value): value is T => value !== null && value !== undefined && value !== false
);
