import { ModuleInfo, Topic } from '../types/sqlCurriculum';
import { MODULE_1_TOPICS } from './curriculumPart1';
import { MODULE_2_TOPICS } from './curriculumPart2';
import { MODULE_3_TOPICS } from './curriculumPart3';

export const MODULES: ModuleInfo[] = [
  {
    id: 1,
    shortName: 'Mod 1',
    label: 'MODULE 1',
    title: 'RDBMS Foundations, Constraints & Querying',
    subtitle: 'Database fundamentals, data types, keys, filtering, wildcards & sorting',
    overviewIntro:
      'Start here to master the core building blocks every technical interviewer tests first: how relational tables connect via Primary and Foreign Keys, why CHAR vs VARCHAR matters in memory, how NULL behaves in arithmetic, and how to filter and sort data cleanly using WHERE, LIKE, IN, BETWEEN, and ORDER BY.',
    learningGoals: [
      'Distinguish DBMS vs RDBMS and recite Codd’s 5 core rules clearly',
      'Explain CHAR vs VARCHAR memory allocation and NUMBER(p, s) precision/scale',
      'Design Master-Child tables using Primary, Composite, Foreign, Unique, and CHECK constraints',
      'Write accurate filtering queries with LIKE (% and _), IN, BETWEEN, IS NULL, and ORDER BY',
    ],
    chapters: [
      { id: 'ch1', label: 'CH 1', title: 'RDBMS Concepts & Constraints' },
      { id: 'ch2', label: 'CH 2', title: 'DQL Basics & Filtering' },
      { id: 'ch3', label: 'CH 3', title: 'Special Operators & Sorting' },
    ],
  },
  {
    id: 2,
    shortName: 'Mod 2',
    label: 'MODULE 2',
    title: 'Grouping, SQL Commands & Subqueries',
    subtitle: 'Aggregate functions, HAVING vs WHERE, DDL/DML/DCL/TCL & nested queries',
    overviewIntro:
      'Move into intermediate SQL mastery: summarizing tables with GROUP BY and HAVING, knowing the exact differences between DELETE, TRUNCATE, and DROP, controlling transactions with COMMIT, ROLLBACK, and SAVEPOINT, and solving nested subquery problems.',
    learningGoals: [
      'Compare COUNT(*) vs COUNT(col) and WHERE vs HAVING without ORA-00979 errors',
      'Contrast DELETE vs TRUNCATE vs DROP and recover dropped tables via Oracle Recycle Bin',
      'Clone million-row tables instantly using CTAS and manage partial rollbacks with SAVEPOINT',
      'Write single-row, multi-row, and grouped subqueries—and avoid the NOT IN + NULL trap',
    ],
    chapters: [
      { id: 'ch4', label: 'CH 4', title: 'Aggregate Functions & Grouping' },
      { id: 'ch5', label: 'CH 5', title: 'DDL, DML, DCL & TCL Commands' },
      { id: 'ch6', label: 'CH 6', title: 'Subqueries (Nested Queries)' },
    ],
  },
  {
    id: 3,
    shortName: 'Mod 3',
    label: 'MODULE 3',
    title: 'Joins, Set Ops, Functions & Normalization',
    subtitle: 'INNER/OUTER/SELF joins, Nth salary trace, built-in functions & 1NF–3NF design',
    overviewIntro:
      'Conquer the highest-weight interview topics: multi-table JOINs (including Self Joins and Outer Join row counts), the famous Correlated Subquery for Nth Highest Salary, Set Operations (UNION vs UNION ALL), string/date functions (SUBSTR, INSTR, NVL, DECODE), and database Normalization from 1NF to 3NF.',
    learningGoals: [
      'Trace INNER, LEFT, RIGHT, FULL, CROSS, and SELF JOIN outputs accurately',
      'Explain and write the (n − 1) correlated subquery for any Nth highest or lowest salary',
      'Compare Joins, Set Operations (UNION/INTERSECT/MINUS), and Subqueries on performance',
      'Normalize a flat schema cleanly through 1NF, 2NF, and 3NF to eliminate anomalies',
    ],
    chapters: [
      { id: 'ch7', label: 'CH 7', title: 'Joins & Correlated Subqueries' },
      { id: 'ch8', label: 'CH 8', title: 'Set Operations & Functions' },
      { id: 'ch9', label: 'CH 9', title: 'Normalization & Database Design' },
    ],
  },
];

export const ALL_TOPICS: Topic[] = [
  ...MODULE_1_TOPICS,
  ...MODULE_2_TOPICS,
  ...MODULE_3_TOPICS,
];

export function getTopicsByModule(moduleId: number): Topic[] {
  return ALL_TOPICS.filter((t) => t.moduleId === moduleId);
}
