import { Top100Question } from './top100Part1';

export const TOP_100_PART_2: Top100Question[] = [
  // 51 - 64: Grouping & Subqueries
  {
    id: 'q51',
    number: 51,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'Why does SELECT deptno, job, SUM(sal) FROM emp GROUP BY deptno raise an error (ORA-00979)?',
    answer:
      'Every non-aggregated column in the SELECT list must be included in the GROUP BY clause. Fix it by writing `GROUP BY deptno, job`.',
  },
  {
    id: 'q52',
    number: 52,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'How do you find duplicate records in a table?',
    answer:
      'Group by the column(s) that define uniqueness and keep groups where `COUNT(*) > 1`.',
    sql: `SELECT ename, COUNT(*) AS occurrences
FROM emp
GROUP BY ename
HAVING COUNT(*) > 1;`,
  },
  {
    id: 'q53',
    number: 53,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'How do you DELETE duplicate rows while keeping one copy of each record?',
    answer:
      'Use `ROW_NUMBER() OVER (PARTITION BY duplicate_cols ORDER BY id)` in a CTE/subquery and delete rows where `rn > 1` (or in Oracle, compare `ROWID`).',
    sql: `-- Standard SQL / Postgres / SQL Server
WITH cte AS (
  SELECT empno, ROW_NUMBER() OVER (PARTITION BY email ORDER BY empno) AS rn
  FROM users
)
DELETE FROM users WHERE empno IN (SELECT empno FROM cte WHERE rn > 1);`,
  },
  {
    id: 'q54',
    number: 54,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'What happens to NULL values inside aggregate functions like SUM, AVG, MAX, MIN?',
    answer:
      'All standard aggregate functions (except COUNT(*)) ignore NULL values. Thus AVG(comm) divides only by the number of non-NULL commissions.',
  },
  {
    id: 'q55',
    number: 55,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'What is the difference between a standard Subquery and a Correlated Subquery?',
    answer:
      'A standard subquery executes ONCE before the outer query. A correlated subquery references a column from the outer query, so it re-executes once for EVERY candidate row of the outer query.',
  },
  {
    id: 'q56',
    number: 56,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'Why is NOT IN dangerous when used with a subquery?',
    answer:
      'If the subquery returns even a single NULL, `x NOT IN (10, 20, NULL)` evaluates to `UNKNOWN` for every row and returns 0 rows. Filter `IS NOT NULL` inside the subquery or use `NOT EXISTS`.',
    sql: `SELECT * FROM dept d
WHERE NOT EXISTS (
  SELECT 1 FROM emp e WHERE e.deptno = d.deptno
);`,
  },
  {
    id: 'q57',
    number: 57,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'Compare IN vs EXISTS performance.',
    answer:
      'EXISTS stops scanning as soon as it finds the first matching row (short-circuiting) and handles NULLs safely. IN evaluates the inner list first; EXISTS is typically faster when the outer table is small and the inner table is large and indexed.',
  },
  {
    id: 'q58',
    number: 58,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'How many levels of nested subqueries does Oracle allow in a WHERE clause?',
    answer:
      'Up to 32 levels in a WHERE clause (and unlimited/255 in FROM inline views). That is why nested MAX() subqueries cannot scale to 100th salary.',
  },
  {
    id: 'q59',
    number: 59,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'What is an Inline View (or Derived Table)?',
    answer:
      'A subquery placed inside the `FROM` clause that acts as a temporary virtual table for the outer query.',
    sql: `SELECT deptno, total_sal
FROM (
  SELECT deptno, SUM(sal) AS total_sal FROM emp GROUP BY deptno
) dept_totals
WHERE total_sal > 9000;`,
  },
  {
    id: 'q60',
    number: 60,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'How do you find department names having at least 2 clerks?',
    answer:
      'Filter `job = \'CLERK\'` in WHERE, group by `deptno`, filter `HAVING COUNT(*) >= 2`, then match `deptno` in `DEPT`.',
    sql: `SELECT dname FROM dept
WHERE deptno IN (
  SELECT deptno FROM emp
  WHERE job = 'CLERK'
  GROUP BY deptno
  HAVING COUNT(*) >= 2
);`,
  },
  {
    id: 'q61',
    number: 61,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'What do the ANY and ALL operators do with subqueries?',
    answer:
      '`> ANY (...)` means greater than at least one value (greater than MIN). `> ALL (...)` means greater than every value returned (greater than MAX).',
  },
  {
    id: 'q62',
    number: 62,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'Can you use a subquery inside a SELECT list (Scalar Subquery)?',
    answer:
      'Yes, as long as the subquery returns at most 1 row and 1 column per outer row.',
    sql: `SELECT ename, sal,
  (SELECT ROUND(AVG(sal), 2) FROM emp) AS company_avg
FROM emp;`,
  },
  {
    id: 'q63',
    number: 63,
    category: 'Grouping & Subqueries',
    level: 'Intermediate',
    question: 'How do you count rows conditionally in a single query (Pivot / Conditional Aggregation)?',
    answer:
      'Wrap a `CASE WHEN` expression inside `SUM()` or `COUNT()`.',
    sql: `SELECT
  SUM(CASE WHEN deptno = 10 THEN 1 ELSE 0 END) AS dept10_cnt,
  SUM(CASE WHEN deptno = 20 THEN 1 ELSE 0 END) AS dept20_cnt,
  SUM(CASE WHEN deptno = 30 THEN 1 ELSE 0 END) AS dept30_cnt
FROM emp;`,
  },
  {
    id: 'q64',
    number: 64,
    category: 'Grouping & Subqueries',
    level: 'Advanced',
    question: 'What is the difference between GROUP BY ROLLUP and GROUP BY CUBE?',
    answer:
      'ROLLUP generates hierarchical subtotals plus a grand total (N+1 grouping sets), while CUBE generates subtotals for every possible combination of the grouped columns (2^N sets).',
  },

  // 65 - 80: DDL, DML & TCL
  {
    id: 'q65',
    number: 65,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is the difference between DELETE, TRUNCATE, and DROP?',
    answer:
      'DELETE (DML) removes specific or all rows and can be rolled back. TRUNCATE (DDL) removes all rows instantaneously, keeps table structure, and auto-commits. DROP (DDL) removes both data and table definition.',
  },
  {
    id: 'q66',
    number: 66,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'How do you copy 1 million rows from one table to a new table without using INSERT?',
    answer:
      'Use CTAS: `CREATE TABLE new_tbl AS SELECT * FROM old_tbl;`. Note that it copies columns, data, and NOT NULL constraints only—not PK, FK, or CHECK constraints.',
    sql: `-- Copy data + structure:
CREATE TABLE emp_copy AS SELECT * FROM emp;

-- Copy structure only (0 rows):
CREATE TABLE emp_empty AS SELECT * FROM emp WHERE 1 = 2;`,
  },
  {
    id: 'q67',
    number: 67,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What are the 5 categories of SQL commands?',
    answer:
      'DQL (SELECT), DDL (CREATE, ALTER, DROP, TRUNCATE, RENAME), DML (INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE), and TCL (COMMIT, ROLLBACK, SAVEPOINT).',
  },
  {
    id: 'q68',
    number: 68,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'Why is SELECT neither DDL nor DML?',
    answer:
      'Because SELECT does not alter table structure (DDL) or modify stored records (DML)—it only reads data, placing it in DQL.',
  },
  {
    id: 'q69',
    number: 69,
    category: 'DDL, DML & TCL',
    level: 'Intermediate',
    question: 'In a transaction: INSERT, UPDATE, ALTER, DELETE, then ROLLBACK—what gets rolled back?',
    answer:
      'Only DELETE! Because ALTER is a DDL command, it implicitly commits the preceding INSERT and UPDATE before running.',
  },
  {
    id: 'q70',
    number: 70,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'How does SAVEPOINT work in SQL transactions?',
    answer:
      'SAVEPOINT creates a named bookmark inside an active transaction so `ROLLBACK TO savepoint_name` undoes only statements executed after that point.',
    sql: `BEGIN;
INSERT INTO logs VALUES (1, 'step1');
SAVEPOINT sp1;
DELETE FROM logs;
ROLLBACK TO sp1; -- Keeps the INSERT!
COMMIT;`,
  },
  {
    id: 'q71',
    number: 71,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'Does ROLLBACK have any effect after COMMIT?',
    answer:
      'No. Once COMMIT executes, changes are permanent in the database and a subsequent ROLLBACK has no effect.',
  },
  {
    id: 'q72',
    number: 72,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is the difference between CHAR and VARCHAR / VARCHAR2?',
    answer:
      'CHAR(n) allocates fixed length and pads unused bytes with non-reusable blank spaces. VARCHAR(n) allocates only the actual string length, leaving unused capacity free.',
  },
  {
    id: 'q73',
    number: 73,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is the difference between Primary Key, Unique Key, and Foreign Key?',
    answer:
      'Primary Key = NOT NULL + UNIQUE (1 per table). Unique Key prevents duplicates but allows NULLs (multiple per table). Foreign Key links a child column to a parent PK and allows both NULLs and duplicates.',
  },
  {
    id: 'q74',
    number: 74,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is a Composite Primary Key?',
    answer:
      'A single Primary Key built from two or more columns combined when no single column uniquely identifies a row (e.g., `PRIMARY KEY (regno, bookno, doi)`).',
  },
  {
    id: 'q75',
    number: 75,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is ON DELETE CASCADE in a Foreign Key?',
    answer:
      'It automatically deletes all referencing child rows whenever the corresponding parent row is deleted, preserving referential integrity.',
  },
  {
    id: 'q76',
    number: 76,
    category: 'DDL, DML & TCL',
    level: 'Intermediate',
    question: 'How do you restore a dropped table in Oracle 10g+?',
    answer:
      'Oracle places dropped tables in the Recycle Bin. Run `FLASHBACK TABLE table_name TO BEFORE DROP;` to restore it, or `PURGE` to remove permanently.',
  },
  {
    id: 'q77',
    number: 77,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'How do GRANT and REVOKE work?',
    answer:
      '`GRANT SELECT ON emp TO analyst;` provides privileges; `REVOKE SELECT ON emp FROM analyst;` removes them.',
  },
  {
    id: 'q78',
    number: 78,
    category: 'DDL, DML & TCL',
    level: 'Core',
    question: 'What is the difference between DBMS and RDBMS?',
    answer:
      'DBMS stores data without relational enforcement or Codd’s rules (e.g., FoxPro). RDBMS enforces table relationships, constraints, ACID properties, and Codd’s rules (e.g., Oracle, PostgreSQL, MySQL).',
  },
  {
    id: 'q79',
    number: 79,
    category: 'DDL, DML & TCL',
    level: 'Intermediate',
    question: 'What is the difference between Candidate Key, Primary Key, and Super Key?',
    answer:
      'A Super Key is any column set that uniquely identifies rows. A Candidate Key is a minimal Super Key (no redundant columns). The Primary Key is the single Candidate Key chosen as the table’s main identifier.',
  },
  {
    id: 'q80',
    number: 80,
    category: 'DDL, DML & TCL',
    level: 'Intermediate',
    question: 'What does MERGE (or UPSERT / ON CONFLICT) do in SQL?',
    answer:
      'It performs an atomic INSERT if a matching row does not exist, or UPDATE if it already exists—essential in ETL and sync pipelines.',
  },

  // 81 - 100: Design, Functions & Modern SQL
  {
    id: 'q81',
    number: 81,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is Normalization and what anomalies does it prevent?',
    answer:
      'Normalization splits large redundant tables into smaller linked tables to eliminate duplicate data and prevent Insert, Update, and Delete anomalies.',
  },
  {
    id: 'q82',
    number: 82,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'Explain 1NF, 2NF, 3NF, and BCNF concisely.',
    answer:
      '1NF: Atomic column values and no duplicate rows. 2NF: In 1NF with no partial dependency on a composite PK. 3NF: In 2NF with no transitive dependency (non-key columns depend only on the PK). BCNF: Every determinant is a candidate key.',
  },
  {
    id: 'q83',
    number: 83,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is Denormalization and when should you use it?',
    answer:
      'Denormalization intentionally combines normalized tables back together to reduce multi-table JOIN overhead in read-heavy analytics and reporting workloads.',
  },
  {
    id: 'q84',
    number: 84,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What are the 4 ACID properties of a database transaction?',
    answer:
      'Atomicity (all-or-nothing), Consistency (valid state transitions respecting constraints), Isolation (concurrent transactions don’t corrupt each other), and Durability (committed data survives crashes).',
  },
  {
    id: 'q85',
    number: 85,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is the DUAL table in Oracle?',
    answer:
      'A built-in 1-row, 1-column dummy table used to evaluate expressions or built-in functions not tied to a real table (e.g., `SELECT SYSDATE FROM dual;`).',
  },
  {
    id: 'q86',
    number: 86,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is the difference between ROUND and TRUNC?',
    answer:
      '`ROUND(34.76, 1)` rounds to the nearest decimal (`34.8`), whereas `TRUNC(34.76, 1)` simply cuts off extra digits without rounding (`34.7`).',
  },
  {
    id: 'q87',
    number: 87,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'Which Oracle function shows date, time with fractional seconds, and timezone?',
    answer:
      '`SYSTIMESTAMP` (introduced in Oracle 9i). `SYSDATE` returns date/time without fractional seconds or timezone.',
  },
  {
    id: 'q88',
    number: 88,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'How do you find names containing exactly 1 "L" using INSTR?',
    answer:
      'Check that the 1st occurrence exists (`> 0`) and the 2nd occurrence does not (`= 0`).',
    sql: `SELECT ename FROM emp
WHERE INSTR(ename, 'L', 1, 1) > 0
  AND INSTR(ename, 'L', 1, 2) = 0; -- Returns BLAKE, CLARK`,
  },
  {
    id: 'q89',
    number: 89,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'How do you count occurrences of a character in a string using SQL functions?',
    answer:
      'Subtract the string length after removing that character from the original length.',
    sql: `SELECT ename, LENGTH(ename) - LENGTH(REPLACE(ename, 'L', '')) AS l_count
FROM emp;`,
  },
  {
    id: 'q90',
    number: 90,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'Compare NVL, NVL2, COALESCE, and NULLIF.',
    answer:
      '`NVL(a, b)` returns b if a is NULL. `NVL2(a, x, y)` returns x if a is NOT NULL, else y. `COALESCE(a, b, c)` returns the first non-NULL value in ANSI SQL. `NULLIF(a, b)` returns NULL if `a = b`, else `a` (handy to prevent divide-by-zero!).',
  },
  {
    id: 'q91',
    number: 91,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'Difference between DECODE and CASE WHEN?',
    answer:
      'DECODE is Oracle-specific and only checks equality. CASE WHEN is ANSI standard, works across all databases, and supports complex conditions (`>`, `BETWEEN`, `AND`, `OR`).',
  },
  {
    id: 'q92',
    number: 92,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
    answer:
      'A Clustered Index determines the physical storage order of table rows (only 1 per table). A Non-Clustered Index is a separate lookup structure holding indexed values and pointers back to the table rows (many per table).',
  },
  {
    id: 'q93',
    number: 93,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'When can adding an Index actually hurt performance?',
    answer:
      'Indexes speed up SELECTs, but every INSERT, UPDATE, and DELETE must also update the index tree—slowing down write-heavy tables and consuming extra disk/memory.',
  },
  {
    id: 'q94',
    number: 94,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is the difference between a View and a Materialized View?',
    answer:
      'A regular View is a saved virtual query that computes fresh results every time it is queried. A Materialized View physically caches the query results on disk and refreshes periodically for fast analytics.',
  },
  {
    id: 'q95',
    number: 95,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'What is a CTE (Common Table Expression) and why use it over nested subqueries?',
    answer:
      'A CTE (`WITH name AS (...)`) defines a named temporary result set valid for one statement. It makes complex multi-step queries readable, reusable within the same query, and supports recursion.',
  },
  {
    id: 'q96',
    number: 96,
    category: 'Design, Functions & Modern SQL',
    level: 'Advanced',
    question: 'How do you traverse an Employee -> Manager org chart hierarchy dynamically?',
    answer:
      'Use a Recursive CTE (`WITH RECURSIVE` in Postgres/MySQL 8+, `WITH` in Oracle/SQL Server) starting from the root (`mgr IS NULL`) and joining child employees recursively.',
    sql: `WITH RECURSIVE org_tree AS (
  SELECT empno, ename, mgr, 1 AS level FROM emp WHERE mgr IS NULL
  UNION ALL
  SELECT e.empno, e.ename, e.mgr, t.level + 1
  FROM emp e JOIN org_tree t ON e.mgr = t.empno
)
SELECT * FROM org_tree;`,
  },
  {
    id: 'q97',
    number: 97,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'What causes an index on a column to be ignored (Non-SARGable queries)?',
    answer:
      'Wrapping an indexed column in a function or expression inside WHERE—such as `WHERE UPPER(ename) = \'SMITH\'` or `WHERE sal + 100 > 2000`—forces a full table scan unless a function-based index exists.',
  },
  {
    id: 'q98',
    number: 98,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'How do you retrieve the first 3 characters and last 3 characters of a string in SQL?',
    answer:
      'Use `SUBSTR(str, 1, 3)` for the first 3 characters and `SUBSTR(str, -3)` (Oracle/MySQL) or `RIGHT(str, 3)` for the last 3 characters.',
  },
  {
    id: 'q99',
    number: 99,
    category: 'Design, Functions & Modern SQL',
    level: 'Core',
    question: 'What is SQL Injection and how do you prevent it?',
    answer:
      'SQL Injection occurs when untrusted user input is concatenated directly into SQL strings, letting attackers alter query logic. Prevent it completely by using Parameterized Queries (Prepared Statements).',
  },
  {
    id: 'q100',
    number: 100,
    category: 'Design, Functions & Modern SQL',
    level: 'Intermediate',
    question: 'What are the top 5 steps to optimize a slow SQL query in production?',
    answer:
      '1. Inspect the execution plan (`EXPLAIN` / `EXPLAIN ANALYZE`) for full table scans. 2. Add appropriate indexes on JOIN, WHERE, and ORDER BY columns. 3. Replace `SELECT *` with explicit needed columns. 4. Filter early in WHERE before GROUP BY/JOINs and avoid functions on indexed columns. 5. Prefer `EXISTS` / `JOIN` over correlated `IN` subqueries on large datasets.',
  },
];
