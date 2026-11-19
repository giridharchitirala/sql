export type Top100Category =
  | 'Salary & Ranking'
  | 'Sorting & Filtering'
  | 'Joins & Sets'
  | 'Grouping & Subqueries'
  | 'DDL, DML & TCL'
  | 'Design, Functions & Modern SQL';

export type Top100Level = 'Core' | 'Intermediate' | 'Advanced';

export interface Top100Question {
  id: string;
  number: number;
  category: Top100Category;
  level: Top100Level;
  question: string;
  answer: string;
  sql?: string;
  tip?: string;
}

export const TOP_100_PART_1: Top100Question[] = [
  // 1 - 15: Salary & Ranking
  {
    id: 'q1',
    number: 1,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you find the 2nd highest salary in a table?',
    answer:
      'There are multiple ways: (1) Using a nested MAX() subquery, (2) Using DENSE_RANK() window function (recommended when ties exist), or (3) Using ORDER BY with LIMIT/OFFSET.',
    sql: `-- Method 1: Subquery (works in all SQL DBs)
SELECT MAX(sal) AS second_highest_sal
FROM emp
WHERE sal < (SELECT MAX(sal) FROM emp);

-- Method 2: Window Function (best for ties)
SELECT DISTINCT sal FROM (
  SELECT sal, DENSE_RANK() OVER (ORDER BY sal DESC) AS rnk FROM emp
) t WHERE rnk = 2;`,
    tip: 'Always clarify whether duplicate highest salaries should share rank 1 (use DENSE_RANK) or count as 2nd.',
  },
  {
    id: 'q2',
    number: 2,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'How do you find the Nth highest salary without using LIMIT, TOP, or window functions?',
    answer:
      'Use a correlated subquery with the (N - 1) rule: count how many distinct salaries are strictly greater than the current row’s salary. When that count equals N - 1, you have found the Nth highest salary.',
    sql: `-- Example: 3rd highest salary (N - 1 = 2)
SELECT * FROM emp A
WHERE 2 = (
  SELECT COUNT(DISTINCT B.sal)
  FROM emp B
  WHERE A.sal < B.sal
);`,
    tip: 'COUNT(DISTINCT B.sal) is essential so tied salaries do not skip ranks.',
  },
  {
    id: 'q3',
    number: 3,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?',
    answer:
      'For tied values (e.g., 5000, 3000, 3000, 2975): ROW_NUMBER() assigns unique sequential numbers (1, 2, 3, 4); RANK() gives ties the same rank and skips the next rank (1, 2, 2, 4); DENSE_RANK() gives ties the same rank without gaps (1, 2, 2, 3).',
    sql: `SELECT ename, sal,
  ROW_NUMBER() OVER (ORDER BY sal DESC) AS rn,
  RANK()       OVER (ORDER BY sal DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY sal DESC) AS drnk
FROM emp;`,
  },
  {
    id: 'q4',
    number: 4,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'How do you find the 2nd highest salary in EACH department?',
    answer:
      'Use DENSE_RANK() with PARTITION BY deptno ORDER BY sal DESC inside a CTE or subquery, then filter where the rank equals 2.',
    sql: `WITH ranked AS (
  SELECT deptno, ename, sal,
    DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS drnk
  FROM emp
)
SELECT deptno, ename, sal
FROM ranked
WHERE drnk = 2;`,
  },
  {
    id: 'q5',
    number: 5,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you display the top 3 highest-paid employees?',
    answer:
      'In MySQL/PostgreSQL use ORDER BY sal DESC LIMIT 3. In Oracle 12c+ use FETCH FIRST 3 ROWS ONLY. With a correlated subquery, filter where count of higher distinct salaries <= 2.',
    sql: `-- Modern ANSI SQL / PostgreSQL / Oracle 12c+
SELECT ename, sal FROM emp ORDER BY sal DESC FETCH FIRST 3 ROWS ONLY;

-- Correlated Subquery (includes ties for top 3)
SELECT * FROM emp A
WHERE 2 >= (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal);`,
  },
  {
    id: 'q6',
    number: 6,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you find the Nth lowest (least) salary?',
    answer:
      'Flip the comparison operator in the correlated subquery from < to >: count distinct salaries smaller than A.sal. For the 4th least salary, use 3 = COUNT(...).',
    sql: `-- 4th lowest salary (N - 1 = 3)
SELECT * FROM emp A
WHERE 3 = (
  SELECT COUNT(DISTINCT B.sal)
  FROM emp B
  WHERE A.sal > B.sal
);`,
  },
  {
    id: 'q7',
    number: 7,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you find employees earning more than their own manager?',
    answer:
      'Perform a Self Join matching each employee’s mgr column to the manager’s empno, then filter where e.sal > m.sal.',
    sql: `SELECT e.ename AS employee, e.sal AS emp_sal,
       m.ename AS manager, m.sal AS mgr_sal
FROM emp e
JOIN emp m ON e.mgr = m.empno
WHERE e.sal > m.sal;`,
  },
  {
    id: 'q8',
    number: 8,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'How do you find employees earning more than the average salary of their own department?',
    answer:
      'Use a correlated subquery comparing e.sal against AVG(sal) for e.deptno, or use AVG(sal) OVER (PARTITION BY deptno).',
    sql: `SELECT e.ename, e.deptno, e.sal
FROM emp e
WHERE e.sal > (
  SELECT AVG(sal) FROM emp d WHERE d.deptno = e.deptno
);`,
  },
  {
    id: 'q9',
    number: 9,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you display the 1st and 4th highest salaries in a single query?',
    answer:
      'Combine two correlated subqueries (0 = ... and 3 = ...) using UNION, or use DENSE_RANK() IN (1, 4).',
    sql: `SELECT ename, sal FROM (
  SELECT ename, sal, DENSE_RANK() OVER (ORDER BY sal DESC) AS rnk FROM emp
) t WHERE rnk IN (1, 4);`,
  },
  {
    id: 'q10',
    number: 10,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you find employees who get the exact same salary as someone else?',
    answer:
      'Self-join EMP on A.sal = B.sal AND A.empno <> B.empno, or group by sal with HAVING COUNT(*) > 1.',
    sql: `SELECT ename, sal FROM emp
WHERE sal IN (
  SELECT sal FROM emp GROUP BY sal HAVING COUNT(*) > 1
);`,
  },
  {
    id: 'q11',
    number: 11,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'How do you find the department with the highest total salary expense?',
    answer:
      'Group by deptno, sum salaries, sort descending, and fetch the first row (or compare against MAX of summed salaries).',
    sql: `SELECT deptno, SUM(sal) AS total_sal
FROM emp
GROUP BY deptno
ORDER BY total_sal DESC
LIMIT 1;`,
  },
  {
    id: 'q12',
    number: 12,
    category: 'Salary & Ranking',
    level: 'Core',
    question: 'How do you calculate total compensation (salary + commission) when commission can be NULL?',
    answer:
      'Use NVL(comm, 0) in Oracle or COALESCE(comm, 0) in standard SQL; otherwise sal + NULL becomes NULL.',
    sql: `SELECT ename, sal, comm, sal + COALESCE(comm, 0) AS total_comp
FROM emp;`,
  },
  {
    id: 'q13',
    number: 13,
    category: 'Salary & Ranking',
    level: 'Advanced',
    question: 'How do you calculate a running (cumulative) total of salaries ordered by hiredate?',
    answer:
      'Use SUM(sal) OVER (ORDER BY hiredate, empno) so each row accumulates previous rows cleanly.',
    sql: `SELECT empno, ename, hiredate, sal,
  SUM(sal) OVER (ORDER BY hiredate, empno) AS running_total
FROM emp;`,
  },
  {
    id: 'q14',
    number: 14,
    category: 'Salary & Ranking',
    level: 'Advanced',
    question: 'How do you find the difference between each employee’s salary and the previous employee’s salary?',
    answer:
      'Use the LAG() window function to peek at the previous row’s value in the ordered result set without self-joining.',
    sql: `SELECT ename, sal,
  sal - LAG(sal) OVER (ORDER BY sal) AS diff_from_prev
FROM emp;`,
  },
  {
    id: 'q15',
    number: 15,
    category: 'Salary & Ranking',
    level: 'Intermediate',
    question: 'Why does LIMIT/OFFSET fail for 2nd highest salary if there are duplicate top salaries?',
    answer:
      'If two employees both earn 5000, ORDER BY sal DESC LIMIT 1 OFFSET 1 returns 5000 again instead of 3000. Adding DISTINCT or using DENSE_RANK() fixes this.',
    sql: `SELECT DISTINCT sal FROM emp ORDER BY sal DESC LIMIT 1 OFFSET 1;`,
  },

  // 16 - 30: Sorting & Filtering
  {
    id: 'q16',
    number: 16,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'What is the logical execution order of a SQL SELECT statement?',
    answer:
      'FROM (and JOINs) -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT / OFFSET.',
    tip: 'This explains why SELECT aliases work in ORDER BY but fail in WHERE.',
  },
  {
    id: 'q17',
    number: 17,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'How do NULL values behave in ORDER BY ASC vs DESC across databases?',
    answer:
      'Oracle and PostgreSQL treat NULL as largest (last in ASC, first in DESC). MySQL and SQL Server treat NULL as smallest (first in ASC, last in DESC). Use NULLS FIRST or NULLS LAST in Oracle/Postgres for explicit control.',
    sql: `SELECT ename, comm FROM emp ORDER BY comm DESC NULLS LAST;`,
  },
  {
    id: 'q18',
    number: 18,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'Can you sort by multiple columns in different directions?',
    answer:
      'Yes. Specify ASC or DESC per column in the ORDER BY list, e.g., ascending department and descending salary within each department.',
    sql: `SELECT deptno, ename, sal FROM emp ORDER BY deptno ASC, sal DESC;`,
  },
  {
    id: 'q19',
    number: 19,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'What does ORDER BY 2 DESC mean in SQL?',
    answer:
      'It sorts the result set in descending order using the 2nd column (or expression) listed in the SELECT clause.',
    sql: `SELECT ename, sal, job FROM emp ORDER BY 2 DESC; -- sorts by sal DESC`,
  },
  {
    id: 'q20',
    number: 20,
    category: 'Sorting & Filtering',
    level: 'Intermediate',
    question: 'How do you perform custom sorting (for example, putting PRESIDENT first, then MANAGER, then others)?',
    answer:
      'Use a CASE expression inside ORDER BY to assign numeric priority weights.',
    sql: `SELECT ename, job, sal FROM emp
ORDER BY CASE job
  WHEN 'PRESIDENT' THEN 1
  WHEN 'MANAGER' THEN 2
  WHEN 'ANALYST' THEN 3
  ELSE 4
END, sal DESC;`,
  },
  {
    id: 'q21',
    number: 21,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'How do you sort rows with NULLs at the end in MySQL (which lacks NULLS LAST)?',
    answer:
      'Sort by `comm IS NULL ASC, comm DESC`—non-nulls have `IS NULL = 0` so they appear before NULLs (`1`).',
    sql: `SELECT ename, comm FROM emp ORDER BY comm IS NULL ASC, comm DESC;`,
  },
  {
    id: 'q22',
    number: 22,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'What is the difference between % and _ wildcards in LIKE?',
    answer:
      '`%` matches zero, one, or any number of characters, while `_` matches exactly one single character.',
    sql: `-- Starts with S: 'S%'
-- 2nd char is L: '_L%'
-- Exactly 5 chars: '_____'`,
  },
  {
    id: 'q23',
    number: 23,
    category: 'Sorting & Filtering',
    level: 'Intermediate',
    question: 'How do you search for a literal % or _ character inside a LIKE pattern?',
    answer:
      'Use the ESCAPE keyword to define an escape character (such as `\\`) before the literal `%` or `_`.',
    sql: `SELECT * FROM discounts WHERE code LIKE '50\\%' ESCAPE '\\';`,
  },
  {
    id: 'q24',
    number: 24,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'Is the BETWEEN operator inclusive of both start and end values?',
    answer:
      'Yes, BETWEEN a AND b is equivalent to >= a AND <= b. Always place the smaller boundary first.',
    sql: `SELECT ename, sal FROM emp WHERE sal BETWEEN 1000 AND 3000;`,
  },
  {
    id: 'q25',
    number: 25,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'Why does WHERE comm = NULL fail, and how do you check NULLs properly?',
    answer:
      'NULL represents an unknown value, so `= NULL` evaluates to UNKNOWN (never TRUE). Always use `IS NULL` or `IS NOT NULL`.',
    sql: `SELECT ename FROM emp WHERE comm IS NULL;`,
  },
  {
    id: 'q26',
    number: 26,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'What happens if you combine AND and OR without parentheses?',
    answer:
      'AND has higher operator precedence than OR and executes first, which can return unexpected rows. Always wrap OR conditions in parentheses when mixing with AND.',
    sql: `SELECT * FROM emp WHERE deptno = 30 AND (job = 'SALESMAN' OR sal > 2500);`,
  },
  {
    id: 'q27',
    number: 27,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'What is the difference between IN and BETWEEN?',
    answer:
      'IN checks membership against a discrete list of values (`IN (10, 20)`), whereas BETWEEN checks a continuous inclusive range (`BETWEEN 1000 AND 3000`).',
  },
  {
    id: 'q28',
    number: 28,
    category: 'Sorting & Filtering',
    level: 'Intermediate',
    question: 'How do you fetch odd-numbered or even-numbered rows (empno or row index)?',
    answer:
      'Use `MOD(col, 2) = 1` (or `col % 2 = 1`) for odd and `= 0` for even. For positional rows, combine `ROW_NUMBER()` with `MOD`.',
    sql: `SELECT * FROM (
  SELECT emp.*, ROW_NUMBER() OVER (ORDER BY empno) AS rn FROM emp
) t WHERE MOD(rn, 2) = 1;`,
  },
  {
    id: 'q29',
    number: 29,
    category: 'Sorting & Filtering',
    level: 'Core',
    question: 'Are SQL keywords and string values case sensitive?',
    answer:
      'SQL keywords (SELECT, FROM, WHERE) are NOT case sensitive. String literals inside single quotes ARE case sensitive in Oracle and PostgreSQL (though case-insensitive by default in standard MySQL collations).',
  },
  {
    id: 'q30',
    number: 30,
    category: 'Sorting & Filtering',
    level: 'Intermediate',
    question: 'What is the difference between DISTINCT and GROUP BY for getting unique values?',
    answer:
      'Both can return unique values for a column, though DISTINCT simply deduplicates the projected columns while GROUP BY prepares buckets for aggregate functions.',
    sql: `SELECT DISTINCT deptno FROM emp;
SELECT deptno FROM emp GROUP BY deptno;`,
  },

  // 31 - 48: Joins & Sets
  {
    id: 'q31',
    number: 31,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'Explain INNER, LEFT, RIGHT, FULL OUTER, and CROSS JOINs.',
    answer:
      'INNER returns only matching rows; LEFT returns all left rows + matches; RIGHT returns all right rows + matches; FULL OUTER returns all rows from both sides with NULLs for non-matches; CROSS returns every possible m × n pair.',
  },
  {
    id: 'q32',
    number: 32,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'Table A has [1, 1, 2, NULL] and Table B has [1, 2, 2, NULL]. How many rows does INNER JOIN vs LEFT JOIN return?',
    answer:
      'NULL never matches NULL in an equality join! Key 1 matches 2×1 = 2 rows; key 2 matches 1×2 = 2 rows. INNER JOIN = 4 rows. LEFT JOIN keeps A’s unmatched NULL = 5 rows.',
    tip: 'This duplicate + NULL join count puzzle is asked constantly in data & backend interviews!',
  },
  {
    id: 'q33',
    number: 33,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is a SELF JOIN and give two classic interview use cases?',
    answer:
      'A SELF JOIN joins a table to itself using two aliases. Classic use cases: (1) Employee-Manager reporting hierarchy (`e.mgr = m.empno`), and (2) Finding employees with the same salary (`a.sal = b.sal AND a.empno <> b.empno`).',
  },
  {
    id: 'q34',
    number: 34,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'How do you find departments that have ZERO employees using a JOIN?',
    answer:
      'Use a LEFT JOIN from DEPT to EMP and filter where the child table’s primary key (`e.empno`) IS NULL.',
    sql: `SELECT d.deptno, d.dname
FROM dept d
LEFT JOIN emp e ON d.deptno = e.deptno
WHERE e.empno IS NULL;`,
  },
  {
    id: 'q35',
    number: 35,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'What happens if you put a filter on the right table in WHERE instead of ON during a LEFT JOIN?',
    answer:
      'Filtering the right table in WHERE turns the LEFT JOIN into an INNER JOIN because NULL-padded unmatched rows fail the WHERE condition! Keep right-table filters in the ON clause if you want to preserve unmatched left rows.',
    sql: `-- Keeps all departments, matching only CLERKs:
SELECT d.dname, e.ename
FROM dept d
LEFT JOIN emp e ON d.deptno = e.deptno AND e.job = 'CLERK';`,
  },
  {
    id: 'q36',
    number: 36,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is the N − 1 rule for joining multiple tables?',
    answer:
      'To join N related tables without producing a Cartesian product, you generally need at least N − 1 join conditions.',
  },
  {
    id: 'q37',
    number: 37,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is the difference between UNION and UNION ALL?',
    answer:
      'UNION merges two result sets and removes duplicate rows (requires sorting/hashing). UNION ALL merges all rows including duplicates and is significantly faster.',
  },
  {
    id: 'q38',
    number: 38,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What rules must SELECT queries follow for UNION, INTERSECT, or EXCEPT/MINUS?',
    answer:
      'Both queries must return the exact same number of columns, and corresponding columns must have compatible data types (column names come from the first query).',
  },
  {
    id: 'q39',
    number: 39,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is the difference between INTERSECT and INNER JOIN?',
    answer:
      'INTERSECT compares full rows vertically across two result sets and returns unique common rows (treating NULL = NULL in set ops). INNER JOIN combines columns horizontally based on an ON condition and does not match NULLs.',
  },
  {
    id: 'q40',
    number: 40,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What does EXCEPT (or MINUS in Oracle) do?',
    answer:
      'It returns distinct rows present in the first SELECT result set that do not exist in the second SELECT result set.',
    sql: `SELECT deptno FROM dept
EXCEPT
SELECT deptno FROM emp; -- Returns 40`,
  },
  {
    id: 'q41',
    number: 41,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'Can MySQL run FULL OUTER JOIN directly?',
    answer:
      'No—MySQL does not have a native FULL OUTER JOIN keyword. Simulate it by combining a LEFT JOIN and a RIGHT JOIN with UNION.',
    sql: `SELECT c.CustomerName, o.Product FROM Customers c LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
UNION
SELECT c.CustomerName, o.Product FROM Customers c RIGHT JOIN Orders o ON c.CustomerID = o.CustomerID;`,
  },
  {
    id: 'q42',
    number: 42,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is a NATURAL JOIN and why do senior engineers avoid it?',
    answer:
      'NATURAL JOIN automatically joins on all columns sharing identical names. It is risky in production because adding an unrelated column like `updated_at` to both tables silently changes the join condition!',
  },
  {
    id: 'q43',
    number: 43,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'What is an Equi-Join vs a Non-Equi Join?',
    answer:
      'An Equi-Join uses `=` in the join condition (e.g., `e.deptno = d.deptno`). A Non-Equi Join uses range/comparison operators like `BETWEEN`, `>`, or `<` (e.g., matching `emp.sal BETWEEN salgrade.losal AND salgrade.hisal`).',
  },
  {
    id: 'q44',
    number: 44,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'How does CROSS APPLY / LATERAL JOIN differ from a normal JOIN?',
    answer:
      'LATERAL (PostgreSQL/MySQL 8+) or CROSS APPLY (SQL Server/Oracle 12c+) lets the right-hand subquery reference columns from each row of the left table—great for fetching Top-N items per group.',
  },
  {
    id: 'q45',
    number: 45,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'Difference between Set Operations and Joins?',
    answer:
      'Set Operations combine rows vertically from independent SELECTs (requiring matching column count & types). Joins combine columns horizontally from related tables using ON conditions.',
  },
  {
    id: 'q46',
    number: 46,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'How do you find employees who have NO subordinates (are not managers of anyone)?',
    answer:
      'Use `NOT EXISTS` or `LEFT JOIN emp sub ON e.empno = sub.mgr WHERE sub.empno IS NULL` (safer than `NOT IN (SELECT mgr FROM emp)` because KING has `mgr IS NULL`!).',
    sql: `SELECT e.empno, e.ename
FROM emp e
WHERE NOT EXISTS (
  SELECT 1 FROM emp sub WHERE sub.mgr = e.empno
);`,
  },
  {
    id: 'q47',
    number: 47,
    category: 'Joins & Sets',
    level: 'Core',
    question: 'If Table A has 10 rows and Table B has 4 rows, what is the maximum and minimum number of rows an INNER JOIN can return?',
    answer:
      'Minimum is 0 (if no keys match). Maximum is 40 (if every row in A matches every row in B—e.g., all rows share the same key value).',
  },
  {
    id: 'q48',
    number: 48,
    category: 'Joins & Sets',
    level: 'Intermediate',
    question: 'How do you write an Anti-Join in SQL?',
    answer:
      'An Anti-Join returns rows from Table A with no match in Table B, written either with `LEFT JOIN ... WHERE b.id IS NULL` or `WHERE NOT EXISTS (...)`.',
  },

  // 49 - 50: Start of Grouping & Subqueries
  {
    id: 'q49',
    number: 49,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'What is the difference between COUNT(*), COUNT(1), and COUNT(column_name)?',
    answer:
      'COUNT(*) and COUNT(1) both count every row in the table including NULLs (modern optimizers execute them identically). COUNT(column_name) counts only non-NULL values in that column.',
  },
  {
    id: 'q50',
    number: 50,
    category: 'Grouping & Subqueries',
    level: 'Core',
    question: 'What is the difference between WHERE and HAVING?',
    answer:
      'WHERE filters individual rows BEFORE GROUP BY and cannot contain aggregate functions. HAVING filters summarized groups AFTER GROUP BY and is designed for aggregate conditions like `HAVING COUNT(*) > 4`.',
  },
];
