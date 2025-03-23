export const LEETCODE_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'C#',
  'Ruby',
  'Swift',
  'Kotlin',
  'Rust',
  'PHP',
  'C',
  'Scala',
  'Dart',
] as const;

export type LeetCodeLanguage = (typeof LEETCODE_LANGUAGES)[number];

export const CONFIDENCE_LEVELS = {
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5,
} as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[keyof typeof CONFIDENCE_LEVELS];

export const SORT_OPTIONS = {
  DIFFICULTY: 'difficulty',
  LAST_SOLVED: 'lastSolved',
  TIMES_SOLVED: 'timesSolved',
  TITLE: 'title',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

export const MOOD_OPTIONS = ['😊', '😐', '😕', '😫', '🤯'] as const;
export type MoodOption = (typeof MOOD_OPTIONS)[number];
