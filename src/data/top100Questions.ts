import { TOP_100_PART_1, Top100Category, Top100Question } from './top100Part1';
import { TOP_100_PART_2 } from './top100Part2';

export type { Top100Category, Top100Level, Top100Question } from './top100Part1';

export const TOP_100_CATEGORIES: Top100Category[] = [
  'Salary & Ranking',
  'Sorting & Filtering',
  'Joins & Sets',
  'Grouping & Subqueries',
  'DDL, DML & TCL',
  'Design, Functions & Modern SQL',
];

export const TOP_100_QUESTIONS: Top100Question[] = [
  ...TOP_100_PART_1,
  ...TOP_100_PART_2,
];
