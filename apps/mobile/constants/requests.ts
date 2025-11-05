export const REQUEST_CATEGORIES = [
  'Bricolage',
  'Courses',
  'Conseil',
  'Services',
  'Discussion',
] as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];
