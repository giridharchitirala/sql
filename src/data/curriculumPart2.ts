import { Topic } from '../types/sqlCurriculum';

export const MODULE_2_TOPICS: Topic[] = [
  {
    id: 'm2-t1',
    number: 16,
    moduleId: 2,
    chapterId: 'ch4',
    chapterTitle: 'CH 4: AGGREGATE FUNCTIONS & GROUPING',
    title: 'Aggregate Functions (COUNT, SUM, AVG, MAX, MIN)',
    shortTitle: 'Aggregate Functions & COUNT(*) vs COUNT(col)',
    summary: 'How the 5 group functions summarize data and how they treat NULL values.',
    intro:
      'Aggregate (Group) functions perform calculations across multiple rows and return a single summary value. Knowing the difference between COUNT(*) and COUNT(column) is a classic SQL interview question.',
    keyPoints: [
      '5 Group Functions: SUM(), MAX(), MIN(), AVG(), COUNT().',
      'COUNT(*) counts ALL rows in a table or group, including rows with NULL values.',
      'COUNT(column) counts only NON-NULL values in that column (e.g., COUNT(comm) returns 4 out of 14 employees).',
      'SUM(), AVG(), MAX(), and MIN() also ignore NULL values automatically.',
    ],
    examples: [
      {
        title: 'COUNT(*) vs COUNT(comm) on EMP',
        query: 'SELECT COUNT(*) AS total_rows, COUNT(comm) AS with_comm, MAX(sal) AS high, MIN(sal) AS low, SUM(sal) AS total_sal FROM emp;',
        explanation: 'EMP has 14 rows total, but only 4 employees have a non-null commission (including Turner who has 0).',
        result: {
          columns: ['TOTAL_ROWS', 'WITH_COMM', 'HIGH', 'LOW', 'TOTAL_SAL'],
          rows: [[14, 4, 5000, 800, 29025]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
        answer:
          'COUNT(*) counts every row including NULLs, whereas COUNT(column_name) counts only rows where that specific column is NOT NULL.',
      },
      {
        question: 'Does AVG(comm) divide by 14 or by 4 in the EMP table?',
        answer:
          'It divides by 4! Aggregate functions ignore NULLs, so AVG(comm) sums the 4 non-null commissions (300+500+1400+0 = 2200) and divides by 4 (= 550).',
        tip: 'To treat NULL commissions as 0 in the average, use AVG(NVL(comm, 0)) or AVG(COALESCE(comm, 0)).',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t2',
    number: 17,
    moduleId: 2,
    chapterId: 'ch4',
    chapterTitle: 'CH 4: AGGREGATE FUNCTIONS & GROUPING',
    title: 'GROUP BY Clause & Multi-Column Grouping',
    shortTitle: 'GROUP BY & Multi-Column Grouping',
    summary: 'Aggregating rows per category such as total salary per department or per job role.',
    intro:
      'GROUP BY splits a table into logical buckets based on one or more column values and runs aggregate functions independently inside each bucket.',
    keyPoints: [
      'GROUP BY groups rows that share the same value(s) in the specified column(s).',
      'Multi-column grouping (GROUP BY deptno, job) creates hierarchical buckets (e.g., Clerks in Dept 10 vs Clerks in Dept 20).',
      'Combine with ORDER BY at the end to sort the summarized groups.',
    ],
    syntax: `SELECT column1, aggregate_function(column2)
FROM table_name
WHERE row_filter
GROUP BY column1
ORDER BY column1;`,
    examples: [
      {
        title: 'Total Salary per Department',
        query: 'SELECT deptno, COUNT(*) AS emp_count, SUM(sal) AS total_sal FROM emp GROUP BY deptno ORDER BY deptno;',
        explanation: 'Aggregates employee count and salary separately for departments 10, 20, and 30.',
        result: {
          columns: ['DEPTNO', 'EMP_COUNT', 'TOTAL_SAL'],
          rows: [
            [10, 3, 8750],
            [20, 5, 10875],
            [30, 6, 9400],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How does GROUP BY handle NULL values in the grouping column?',
        answer: 'All rows with NULL in the grouped column are placed together into a single NULL group.',
      },
    ],
  },
  {
    id: 'm2-t3',
    number: 18,
    moduleId: 2,
    chapterId: 'ch4',
    chapterTitle: 'CH 4: AGGREGATE FUNCTIONS & GROUPING',
    title: 'HAVING vs WHERE & Grouping Restrictions (ORA-00979)',
    shortTitle: 'HAVING vs WHERE & ORA-00979 Rule',
    summary: 'Why WHERE cannot filter aggregates, when to use HAVING, and avoiding ORA-00979 errors.',
    intro:
      'One of the top 5 SQL interview questions is "What is the difference between WHERE and HAVING?" In short: WHERE filters individual rows BEFORE grouping; HAVING filters entire groups AFTER GROUP BY.',
    keyPoints: [
      'WHERE filters non-grouped raw rows and appears BEFORE GROUP BY.',
      'HAVING filters grouped/aggregated results and appears AFTER GROUP BY.',
      'ORA-00979 ("not a GROUP BY expression"): Any non-aggregated column in SELECT MUST appear in GROUP BY. However, columns in GROUP BY do not have to appear in SELECT.',
      'Performance tip: Always filter non-aggregate conditions in WHERE rather than HAVING so fewer rows need to be grouped.',
    ],
    examples: [
      {
        title: 'Combining WHERE, GROUP BY, HAVING, and ORDER BY',
        query: 'SELECT job, MAX(sal) AS max_sal FROM emp WHERE deptno <> 30 GROUP BY job HAVING MAX(sal) > 1500 ORDER BY 2;',
        explanation: 'Excludes dept 30 rows first (WHERE), groups by job, keeps groups with max salary > 1500 (HAVING), then sorts.',
        result: {
          columns: ['JOB', 'MAX_SAL'],
          rows: [
            ['MANAGER', 2975],
            ['ANALYST', 3000],
            ['PRESIDENT', 5000],
          ],
        },
      },
    ],
    comparison: {
      title: 'WHERE vs HAVING',
      headers: ['Feature', 'WHERE', 'HAVING'],
      rows: [
        ['Operates On', 'Individual rows (before grouping)', 'Summary groups (after GROUP BY)'],
        ['Can Use Aggregates?', 'No (causes an error)', 'Yes (SUM, COUNT, AVG, etc.)'],
        ['Requires GROUP BY?', 'No', 'Usually paired with GROUP BY'],
        ['Placement', 'Before GROUP BY', 'After GROUP BY, before ORDER BY'],
      ],
    },
    interviewQuestions: [
      {
        question: 'Why does SELECT deptno, job, SUM(sal) FROM emp GROUP BY deptno throw ORA-00979?',
        answer:
          'Because "job" is selected without an aggregate function and is missing from the GROUP BY clause. Either add "job" to GROUP BY (GROUP BY deptno, job) or wrap it in an aggregate.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t4',
    number: 19,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'Types of SQL Commands (DQL, DDL, DML, DCL, TCL)',
    shortTitle: '5 Types of SQL Commands',
    summary: 'Clear classification of all SQL sub-languages and which commands auto-commit.',
    intro:
      'SQL commands are organized into 5 sub-languages based on whether they query data, define table structure, modify rows, manage permissions, or control transactions.',
    keyPoints: [
      'DQL (Data Query Language): SELECT — retrieves data without changing anything.',
      'DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE, RENAME — modifies database structure and auto-commits.',
      'DML (Data Manipulation Language): INSERT, UPDATE, DELETE — modifies table records (can be rolled back).',
      'DCL (Data Control Language): GRANT, REVOKE — controls user access and permissions.',
      'TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT — permanently saves or undoes DML transactions.',
    ],
    examples: [
      {
        title: 'One-Glance Example Across All 5 SQL Sub-Languages',
        query:
          "-- DDL: CREATE TABLE demo (id INT PRIMARY KEY);\n-- DML: INSERT INTO demo VALUES (1);\n-- TCL: COMMIT;\n-- DQL: SELECT * FROM demo;\n-- DCL: GRANT SELECT ON demo TO analyst;",
        explanation: 'Illustrates how DDL defines structure, DML manipulates data, TCL saves, DQL reads, and DCL secures access.',
      },
    ],
    comparison: {
      title: 'SQL Command Sub-Languages',
      headers: ['Category', 'Full Name', 'Commands', 'Auto-Commit?'],
      rows: [
        ['DQL', 'Data Query Language', 'SELECT', 'N/A (read-only)'],
        ['DDL', 'Data Definition Language', 'CREATE, DROP, ALTER, TRUNCATE, RENAME', 'Yes (implicit commit)'],
        ['DML', 'Data Manipulation Language', 'INSERT, UPDATE, DELETE', 'No (requires COMMIT)'],
        ['DCL', 'Data Control Language', 'GRANT, REVOKE', 'Yes'],
        ['TCL', 'Transaction Control Language', 'COMMIT, ROLLBACK, SAVEPOINT', 'Controls transactions'],
      ],
    },
    interviewQuestions: [
      {
        question: 'Under which SQL category does SELECT fall—DDL or DML?',
        answer:
          'Neither! SELECT belongs to DQL (Data Query Language) because it only reads and displays data without altering structure or rows.',
      },
    ],
  },
  {
    id: 'm2-t5',
    number: 20,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'DDL Commands: CREATE, ALTER, RENAME & INDEX',
    shortTitle: 'CREATE, ALTER, RENAME & INDEX',
    summary: 'Defining tables, adding/dropping/renaming columns, renaming tables, and indexing for speed.',
    intro:
      'DDL commands define and evolve the schema of your database. Because DDL statements alter metadata, they execute an implicit commit and cannot be undone with ROLLBACK.',
    keyPoints: [
      'CREATE TABLE: Defines table name, columns, data types, and constraints.',
      'ALTER TABLE: Adds columns (ADD), drops columns (DROP COLUMN), or renames columns (RENAME COLUMN old TO new).',
      'RENAME old_table TO new_table: Renames an existing table.',
      'CREATE INDEX / DROP INDEX: Speeds up SELECT lookups on frequently searched columns (at a slight write cost).',
    ],
    syntax: `ALTER TABLE products ADD model_no VARCHAR2(10) NOT NULL;
ALTER TABLE products RENAME COLUMN qty TO qty_available;
ALTER TABLE products DROP COLUMN model_no;
CREATE INDEX idx_emp_name ON emp (ename);`,
    examples: [
      {
        title: 'Creating Related Master-Child Tables',
        query:
          'CREATE TABLE products (\n  prodid NUMBER(4) PRIMARY KEY,\n  prodname VARCHAR2(10) NOT NULL,\n  qty NUMBER(3) CHECK (qty > 0)\n);',
        explanation: 'Creates the parent products table with Primary Key, NOT NULL, and CHECK constraints.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does creating an index speed up SELECT queries?',
        answer:
          'An index creates a sorted lookup structure (like a book’s index) so the database can jump directly to matching rows instead of scanning the entire table row by row.',
      },
    ],
  },
  {
    id: 'm2-t6',
    number: 21,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'CTAS (Duplicate 1M Rows) & TRUNCATE vs DROP vs DELETE',
    shortTitle: 'CTAS & DELETE vs TRUNCATE vs DROP',
    summary: 'How to clone a 1-million-row table without INSERT, and the #1 SQL comparison: DELETE vs TRUNCATE vs DROP.',
    intro:
      'Interviewers almost always test whether you know the exact difference between DELETE, TRUNCATE, and DROP—and how to clone a massive table in a single statement using CTAS (Create Table As Select).',
    keyPoints: [
      'CTAS (CREATE TABLE temp AS SELECT * FROM dept): Copies structure, all rows, and NOT NULL constraints—but NEVER copies PK, FK, or CHECK constraints.',
      'Clone structure only (0 rows): CREATE TABLE temp AS SELECT * FROM dept WHERE 1 = 2;',
      'DELETE (DML): Removes specific rows (with WHERE) or all rows; slower (row-by-row logging) and CAN be rolled back.',
      'TRUNCATE (DDL): Removes ALL rows instantaneously while keeping table structure intact; CANNOT be rolled back.',
      'DROP (DDL): Removes BOTH data and table structure completely from the database.',
    ],
    examples: [
      {
        title: 'Duplicating 1 Million Records Without INSERT',
        query: 'CREATE TABLE emp_backup AS SELECT * FROM emp;',
        explanation: 'Creates emp_backup and populates all rows in one bulk operation. Note: PK/FK/CHECK constraints are not copied.',
      },
    ],
    comparison: {
      title: 'DELETE vs TRUNCATE vs DROP',
      headers: ['Property', 'DELETE', 'TRUNCATE', 'DROP'],
      rows: [
        ['Command Type', 'DML', 'DDL', 'DDL'],
        ['Can Filter Rows?', 'Yes (supports WHERE)', 'No (removes all rows)', 'No (removes entire table)'],
        ['Table Structure', 'Remains intact', 'Remains intact', 'Completely removed'],
        ['Can Rollback?', 'Yes (before COMMIT)', 'No (auto-commits)', 'No (Oracle 10g uses Recycle Bin)'],
        ['Speed', 'Slower (logs each row)', 'Very fast (deallocates pages)', 'Instant'],
      ],
    },
    interviewQuestions: [
      {
        question: 'I have a table with 1 million rows. How do I copy all rows to a new table without using INSERT?',
        answer:
          'Use CTAS: CREATE TABLE new_table AS SELECT * FROM old_table;. Mention that it copies columns, rows, and NOT NULL constraints, but not Primary Key, Foreign Key, or CHECK constraints.',
      },
      {
        question: 'What is the difference between DELETE and TRUNCATE?',
        answer:
          'DELETE is a DML command that can remove specific rows using WHERE and can be undone with ROLLBACK. TRUNCATE is a DDL command that removes all rows at once, keeps the structure, and cannot be rolled back.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t7',
    number: 22,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'Oracle 10g Recycle Bin (FLASHBACK & PURGE)',
    shortTitle: 'Oracle Recycle Bin (FLASHBACK)',
    summary: 'How dropped tables enter the Recycle Bin and how to restore or permanently purge them.',
    intro:
      'Introduced in Oracle 10g ("g" stands for Grid), the Recycle Bin acts as a safety net for accidental DROP TABLE commands—allowing recovery via FLASHBACK or permanent deletion via PURGE.',
    keyPoints: [
      'When you run DROP TABLE test2, Oracle moves it into the Recycle Bin rather than erasing it immediately.',
      'FLASHBACK TABLE test2 TO BEFORE DROP restores the table and its data.',
      'PURGE TABLE test2 (or DROP TABLE test2 PURGE) permanently removes it and frees disk space.',
    ],
    syntax: `DROP TABLE test2;
FLASHBACK TABLE test2 TO BEFORE DROP;
PURGE RECYCLEBIN;`,
    examples: [
      {
        title: 'Recovering an Accidentally Dropped Table',
        query: 'DROP TABLE temp_dept;\n-- Oops! Restore it:\nFLASHBACK TABLE temp_dept TO BEFORE DROP;',
        explanation: 'Restores the dropped table cleanly in Oracle 10g+ without needing a full backup restore.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Can a dropped table ever be recovered in Oracle?',
        answer:
          'Yes, from Oracle 10g onward, dropped tables go to the Recycle Bin and can be restored using FLASHBACK TABLE table_name TO BEFORE DROP unless purged.',
      },
    ],
  },
  {
    id: 'm2-t8',
    number: 23,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'DML Commands: INSERT, UPDATE & DELETE',
    shortTitle: 'DML: INSERT, UPDATE & DELETE',
    summary: 'Modifying table rows safely while respecting constraints and WHERE conditions.',
    intro:
      'DML (Data Manipulation Language) handles day-to-day data changes: adding rows (INSERT), modifying existing rows (UPDATE), and removing rows (DELETE). All DML changes remain temporary until committed.',
    keyPoints: [
      'INSERT INTO table (cols) VALUES (vals): Column count and data types must match; strings go in single quotes.',
      'UPDATE table SET col = new_val WHERE condition: Always verify the WHERE clause—omitting WHERE updates EVERY row in the table!',
      'DELETE FROM table WHERE condition: Deletes matching rows; omitting WHERE deletes every row.',
    ],
    examples: [
      {
        title: 'Updating a Single Employee vs All Employees',
        query: 'UPDATE emp SET sal = sal + 200, comm = 100 WHERE empno = 7369;\n-- Increase everyone by 10%:\nUPDATE emp SET sal = sal + sal * 0.10;',
        explanation: 'The first query updates only SMITH (7369); the second omits WHERE and updates all 14 rows.',
      },
      {
        title: 'Deleting a Specific Record',
        query: 'DELETE FROM test WHERE empno = 7934;',
        explanation: 'Removes only MILLER (7934) from the test table.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What happens if you run UPDATE emp SET sal = 5000 without a WHERE clause?',
        answer:
          'Every single row in the EMP table will have its salary updated to 5000. Unless auto-commit is on, you can recover with ROLLBACK.',
      },
    ],
  },
  {
    id: 'm2-t9',
    number: 24,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'DCL Security: GRANT and REVOKE Privileges',
    shortTitle: 'DCL: GRANT & REVOKE',
    summary: 'Controlling user access rights on tables and views using GRANT and REVOKE.',
    intro:
      'DCL (Data Control Language) manages database security by granting specific permissions (SELECT, INSERT, UPDATE, DELETE) to users or roles and revoking them when no longer needed.',
    keyPoints: [
      'GRANT privilege ON object TO user_or_role gives access rights.',
      'REVOKE privilege ON object FROM user_or_role removes previously granted rights.',
      'Principle of Least Privilege: Analysts often receive only SELECT permission so they cannot alter production records.',
    ],
    syntax: `GRANT SELECT, INSERT ON Employees TO Analyst;
REVOKE INSERT ON Employees FROM Analyst;`,
    examples: [
      {
        title: 'Read-Only Access for an Analyst Role',
        query: 'GRANT SELECT ON Employees TO Analyst;',
        explanation: 'Allows Analyst to query Employees without permitting UPDATE or DELETE.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the two main DCL commands and what syntax do they use?',
        answer:
          'GRANT (GRANT privilege ON object TO user) and REVOKE (REVOKE privilege ON object FROM user).',
      },
    ],
  },
  {
    id: 'm2-t10',
    number: 25,
    moduleId: 2,
    chapterId: 'ch5',
    chapterTitle: 'CH 5: DDL, DML, DCL & TCL COMMANDS',
    title: 'TCL Transactions: COMMIT, ROLLBACK & SAVEPOINT',
    shortTitle: 'TCL: COMMIT, ROLLBACK & SAVEPOINT',
    summary: 'Transaction boundaries, partial rollbacks with SAVEPOINT, and the DDL auto-commit trap.',
    intro:
      'A transaction groups one or more SQL statements into a single atomic unit of work. TCL ensures data consistency: either commit everything permanently, roll back everything, or roll back partway to a named SAVEPOINT.',
    keyPoints: [
      'COMMIT: Permanently saves all pending DML changes since the last COMMIT/ROLLBACK.',
      'ROLLBACK: Undoes all uncommitted DML changes. Has zero effect after a COMMIT has already run!',
      'SAVEPOINT name: Places a named bookmark inside a transaction so ROLLBACK TO name undoes only changes after that point.',
      'DDL Auto-Commit Trap: Running a DDL command (like ALTER or CREATE) implicitly commits all prior pending DML statements!',
    ],
    examples: [
      {
        title: 'Partial Rollback with SAVEPOINT',
        query:
          'BEGIN;\nUPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 123;\nSAVEPOINT before_credit;\nUPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 456;\n-- Error on credit, undo only second update:\nROLLBACK TO before_credit;\nCOMMIT;',
        explanation: 'Only the second update is undone; the first update remains intact and is committed.',
      },
    ],
    interviewQuestions: [
      {
        question: 'If you execute INSERT, UPDATE, ALTER, DELETE, and then ROLLBACK—which statements are undone?',
        answer:
          'Only DELETE is rolled back! Because ALTER is a DDL command, it implicitly commits the INSERT and UPDATE before it.',
        tip: 'This exact sequence from the notes is a famous Oracle/SQL interview trick question.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t11',
    number: 26,
    moduleId: 2,
    chapterId: 'ch6',
    chapterTitle: 'CH 6: SUBQUERIES (NESTED QUERIES)',
    title: 'Subquery Fundamentals: Inner vs Outer Query',
    shortTitle: 'Subqueries: Inner vs Outer Query',
    summary: 'How nested queries break complex multi-step questions into an inner query feeding an outer query.',
    intro:
      'A subquery (nested query or inner query) is a SELECT statement inside another SQL query. The inner query executes first, and its result is passed as input to the outer query.',
    keyPoints: [
      'Execution flow: Inner query runs FIRST -> produces value(s) -> Outer query uses those value(s) to filter.',
      'To connect two tables with a subquery, they must share at least one common/related column (e.g., deptno).',
      'Subqueries can be placed inside WHERE, FROM (inline views), SELECT, or HAVING.',
    ],
    syntax: `SELECT columns
FROM table1
WHERE column OPERATOR (
  SELECT column FROM table2 WHERE condition
);`,
    examples: [
      {
        title: 'Employees Working in the RESEARCH Department',
        query: "SELECT empno, ename, job, sal FROM emp WHERE deptno = (SELECT deptno FROM dept WHERE dname = 'RESEARCH');",
        explanation: 'Inner query finds deptno = 20 for RESEARCH; outer query fetches all employees in dept 20.',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
          rows: [
            [7369, 'SMITH', 'CLERK', 800],
            [7566, 'JONES', 'MANAGER', 2975],
            [7788, 'SCOTT', 'ANALYST', 3000],
            [7876, 'ADAMS', 'CLERK', 1100],
            [7902, 'FORD', 'ANALYST', 3000],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'In a standard (non-correlated) subquery, which query executes first?',
        answer: 'The inner query executes first, and its output is supplied to the outer query.',
      },
    ],
  },
  {
    id: 'm2-t12',
    number: 27,
    moduleId: 2,
    chapterId: 'ch6',
    chapterTitle: 'CH 6: SUBQUERIES (NESTED QUERIES)',
    title: 'Single-Row vs Multi-Row Subqueries (= vs IN / NOT IN)',
    shortTitle: 'Single-Row vs Multi-Row Subqueries',
    summary: 'Avoiding ORA-01427 single-row subquery errors by picking IN / NOT IN for multi-row results.',
    intro:
      'If an inner query returns more than one row, using = or > throws an error. Choosing between single-row operators (=, >, <) and multi-row operators (IN, NOT IN, ANY, ALL) is essential.',
    keyPoints: [
      'Single-row operators (=, <>, >, <, >=, <=): Inner query MUST return at most 1 row.',
      'Multi-row operators (IN, NOT IN, ANY, ALL): Inner query may return 0, 1, or many rows.',
      'NOT IN NULL Trap: If a subquery used with NOT IN returns even one NULL value, the entire NOT IN condition returns 0 rows! Filter out NULLs in the subquery or use NOT EXISTS.',
    ],
    examples: [
      {
        title: 'Departments With No Employees (NOT IN)',
        query: 'SELECT * FROM dept WHERE deptno NOT IN (SELECT deptno FROM emp WHERE deptno IS NOT NULL);',
        explanation: 'Finds departments 40 (OPERATIONS) that have zero matching employees in EMP.',
        result: {
          columns: ['DEPTNO', 'DNAME', 'LOC'],
          rows: [[40, 'OPERATIONS', 'BOSTON']],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What happens if the inner query of a NOT IN subquery returns a NULL value?',
        answer:
          'NOT IN evaluates as x <> val1 AND x <> val2 AND x <> NULL. Since x <> NULL is UNKNOWN, the whole condition never evaluates to TRUE and returns 0 rows!',
        tip: 'Always add WHERE col IS NOT NULL inside a NOT IN subquery, or prefer NOT EXISTS.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t13',
    number: 28,
    moduleId: 2,
    chapterId: 'ch6',
    chapterTitle: 'CH 6: SUBQUERIES (NESTED QUERIES)',
    title: 'Subqueries with GROUP BY & HAVING',
    shortTitle: 'Subqueries with GROUP BY & HAVING',
    summary: 'Finding departments based on employee headcount or role counts using nested aggregation.',
    intro:
      'Combining GROUP BY and HAVING inside the inner query lets you answer multi-table questions like "Which departments have at least 4 employees?" or "Which departments have at least 2 clerks?" without writing joins.',
    keyPoints: [
      'Inner query groups EMP by deptno and filters with HAVING COUNT(*) >= 4.',
      'Outer query maps those surviving deptnos to department names from DEPT.',
    ],
    examples: [
      {
        title: 'Departments Having At Least 4 Employees',
        query: 'SELECT dname FROM dept WHERE deptno IN (SELECT deptno FROM emp GROUP BY deptno HAVING COUNT(*) >= 4);',
        explanation: 'Inner query returns deptno 20 (5 employees) and 30 (6 employees); outer query fetches RESEARCH and SALES.',
        result: {
          columns: ['DNAME'],
          rows: [['RESEARCH'], ['SALES']],
        },
      },
      {
        title: 'Departments With 2 Clerks',
        query: "SELECT dname FROM dept WHERE deptno IN (SELECT deptno FROM emp WHERE job = 'CLERK' GROUP BY deptno HAVING COUNT(*) = 2);",
        explanation: 'Filters clerks first, groups by department, checks count = 2, then looks up department name.',
        result: {
          columns: ['DNAME'],
          rows: [['RESEARCH']],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you display department names that have at least 1 employee?',
        answer: 'SELECT dname FROM dept WHERE deptno IN (SELECT DISTINCT deptno FROM emp);',
      },
    ],
  },
  {
    id: 'm2-t14',
    number: 29,
    moduleId: 2,
    chapterId: 'ch6',
    chapterTitle: 'CH 6: SUBQUERIES (NESTED QUERIES)',
    title: 'Nth Highest & Lowest Salary via Nested Subqueries',
    shortTitle: '2nd / 3rd Max Salary (Nested)',
    summary: 'Finding 2nd and 3rd maximum salaries with MAX(sal) < (...) and understanding the 32-level nesting limit.',
    intro:
      'Finding the 2nd highest salary is perhaps the single most famous SQL interview question. Using nested MAX() subqueries is intuitive for 2nd or 3rd salary, though it hits a wall for the 100th salary.',
    keyPoints: [
      '1st Max: SELECT MAX(sal) FROM emp -> 5000.',
      '2nd Max: SELECT MAX(sal) FROM emp WHERE sal < (SELECT MAX(sal) FROM emp) -> 3000.',
      '3rd Max: Nest one more level -> 2975.',
      'Limitation: Oracle allows at most 32 levels of subquery nesting in a WHERE clause—making this inefficient for 50th or 100th max salary (where correlated subqueries or DENSE_RANK() win).',
    ],
    examples: [
      {
        title: '2nd & 3rd Maximum Salary',
        query:
          'SELECT MAX(sal) AS third_max\nFROM emp\nWHERE sal < (\n  SELECT MAX(sal) FROM emp\n  WHERE sal < (SELECT MAX(sal) FROM emp)\n);',
        explanation: 'Innermost finds 5000; middle finds 3000; outer finds max strictly below 3000 = 2975.',
        result: {
          columns: ['THIRD_MAX'],
          rows: [[2975]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Why shouldn’t you use nested MAX() subqueries to find the 100th highest salary?',
        answer:
          'Oracle limits nested subqueries in WHERE to 32 levels, and writing 99 nested subqueries is unreadable and slow. Instead, use a correlated subquery or DENSE_RANK() OVER (ORDER BY sal DESC).',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm2-t15',
    number: 30,
    moduleId: 2,
    chapterId: 'ch6',
    chapterTitle: 'CH 6: SUBQUERIES (NESTED QUERIES)',
    title: 'Module 2 Interview Drill: Grouping, TCL & Subqueries',
    shortTitle: 'Module 2 Interview Drill',
    summary: 'High-frequency scenario questions testing HAVING, TRUNCATE vs DELETE, SAVEPOINT, and Subqueries.',
    intro:
      'Review the rapid-fire interview scenarios for Module 2 to cement the rules before moving into Module 3 (Joins, Functions, and Normalization).',
    keyPoints: [
      'Know why HAVING cannot replace WHERE for row-level speed, and why WHERE cannot use COUNT().',
      'Always mention CTAS constraint limitations (copies NOT NULL only, not PK/FK/CHECK).',
      'Remember both ways to find the 2nd highest salary and the NOT IN + NULL pitfall.',
    ],
    examples: [
      {
        title: 'Departments With Departmental Salary Over 9000',
        query: 'SELECT deptno, SUM(sal) AS total_sal FROM emp GROUP BY deptno HAVING SUM(sal) > 9000 ORDER BY 1;',
        explanation: 'Computes departmental totals and keeps only departments exceeding 9000.',
        result: {
          columns: ['DEPTNO', 'TOTAL_SAL'],
          rows: [
            [20, 10875],
            [30, 9400],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Can we have a GROUP BY without an aggregate function?',
        answer:
          'Yes! SELECT deptno FROM emp GROUP BY deptno works and returns distinct department numbers, behaving similarly to SELECT DISTINCT deptno.',
      },
      {
        question: 'Which executes faster on a 10-million-row table: DELETE FROM table or TRUNCATE TABLE table?',
        answer:
          'TRUNCATE TABLE is vastly faster because it deallocates data pages as a single DDL operation rather than logging each individual row deletion.',
      },
    ],
  },
];
