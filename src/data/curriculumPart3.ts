import { Topic } from '../types/sqlCurriculum';

export const MODULE_3_TOPICS: Topic[] = [
  {
    id: 'm3-t1',
    number: 31,
    moduleId: 3,
    chapterId: 'ch7',
    chapterTitle: 'CH 7: JOINS & CORRELATED SUBQUERIES',
    title: 'Cartesian (CROSS) Join & Why Join Conditions Matter',
    shortTitle: 'CROSS Join (Cartesian Product)',
    summary: 'Understanding M × N Cartesian products and why forgetting a JOIN condition causes multiplied rows.',
    intro:
      'A Cartesian Join (or CROSS JOIN) pairs every single row of the first table with every single row of the second table. If EMP has 14 rows and DEPT has 4 rows, a cross join produces 14 × 4 = 56 rows—mixing valid and invalid pairings.',
    keyPoints: [
      'Cartesian Product math: If Table A has m rows and Table B has n rows, CROSS JOIN returns m × n rows.',
      'Requires NO join condition (no ON or WHERE join predicate).',
      'Rarely used in production reporting except for generating combinations (e.g., all Students × all Courses, or Calendar × Products).',
    ],
    syntax: `SELECT s.StudentName, c.CourseName
FROM Students s
CROSS JOIN Courses c;`,
    examples: [
      {
        title: 'Accidental Cartesian Join on EMP and DEPT',
        query: 'SELECT A.ename, A.sal, B.dname FROM emp A, dept B;',
        explanation: 'Without WHERE A.deptno = B.deptno, all 14 employees combine with all 4 departments = 56 rows.',
        result: {
          columns: ['ENAME', 'SAL', 'DNAME'],
          rows: [
            ['SMITH', 800, 'ACCOUNTING'],
            ['SMITH', 800, 'RESEARCH'],
            ['SMITH', 800, 'SALES'],
            ['SMITH', 800, 'OPERATIONS'],
          ],
          caption: 'First 4 of 56 Cartesian rows (only RESEARCH is SMITH’s real dept)',
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Table A has 10 rows and Table B has 6 rows. How many rows does a CROSS JOIN return?',
        answer: '10 × 6 = 60 rows (Cartesian product).',
      },
    ],
  },
  {
    id: 'm3-t2',
    number: 32,
    moduleId: 3,
    chapterId: 'ch7',
    chapterTitle: 'CH 7: JOINS & CORRELATED SUBQUERIES',
    title: 'INNER JOIN (Equi-Join), ANSI Syntax & N − 1 Rule',
    shortTitle: 'INNER JOIN & ANSI ON Syntax',
    summary: 'Fetching matching rows across tables using ANSI JOIN...ON syntax and joining N tables with N − 1 conditions.',
    intro:
      'INNER JOIN (also called Equi-Join when matching with =) keeps only the rows where the join condition matches in both tables, eliminating incorrect Cartesian combinations.',
    keyPoints: [
      'Returns only matching rows across both participating tables.',
      'ANSI style (Oracle 9i+ standard): Uses INNER JOIN ... ON instead of comma-separated tables in FROM and join logic in WHERE.',
      'N − 1 Rule: To join N tables cleanly without a Cartesian product, you generally need at least N − 1 join conditions (e.g., 3 tables -> 2 join conditions, or number of common columns).',
    ],
    syntax: `SELECT e.ename, e.job, d.dname, d.loc
FROM emp e
INNER JOIN dept d ON e.deptno = d.deptno
WHERE e.job = 'MANAGER' AND d.loc IN ('NEW YORK', 'CHICAGO');`,
    examples: [
      {
        title: 'Employees Earning > 2000 With Department Name',
        query: 'SELECT e.ename, e.sal, d.dname FROM emp e INNER JOIN dept d ON e.deptno = d.deptno WHERE e.sal > 2000 ORDER BY e.sal;',
        explanation: 'Separates the join condition (ON) from the filter condition (WHERE) cleanly.',
        result: {
          columns: ['ENAME', 'SAL', 'DNAME'],
          rows: [
            ['CLARK', 2450, 'ACCOUNTING'],
            ['BLAKE', 2850, 'SALES'],
            ['JONES', 2975, 'RESEARCH'],
            ['FORD', 3000, 'RESEARCH'],
            ['SCOTT', 3000, 'RESEARCH'],
            ['KING', 5000, 'ACCOUNTING'],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'If you need to join 4 related tables, how many join conditions are minimally required?',
        answer: 'N − 1 = 3 join conditions (assuming each table links via a single common key).',
      },
    ],
    interactiveDemo: 'joins',
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t3',
    number: 33,
    moduleId: 3,
    chapterId: 'ch7',
    chapterTitle: 'CH 7: JOINS & CORRELATED SUBQUERIES',
    title: 'OUTER JOINS: LEFT, RIGHT & FULL OUTER JOIN',
    shortTitle: 'LEFT, RIGHT & FULL OUTER JOIN',
    summary: 'Preserving unmatched rows with NULL padding—and calculating exact row counts for interview puzzles.',
    intro:
      'Outer Join = Inner Join + non-matching rows. While INNER JOIN drops rows that have no match (such as Dept 40 OPERATIONS with zero employees), OUTER JOINS keep them and fill missing partner columns with NULL.',
    keyPoints: [
      'LEFT OUTER JOIN: All rows from the left table + matching rows from the right table (NULL if no match).',
      'RIGHT OUTER JOIN: All rows from the right table + matching rows from the left table (NULL if no match).',
      'FULL OUTER JOIN: All rows from BOTH tables—preserving unmatched rows on both sides with NULLs.',
      'Row Count Formula (A has 10 rows, B has 6 rows, 3 match): Inner = 3; Left = 10; Right = 6; Full = 3 + 7 + 3 = 13; Cross = 60.',
    ],
    examples: [
      {
        title: 'All Departments Including Empty Dept 40 (RIGHT JOIN)',
        query: 'SELECT e.ename, e.job, d.dname, d.loc FROM emp e RIGHT JOIN dept d ON e.deptno = d.deptno;',
        explanation: 'OPERATIONS (BOSTON) appears at the bottom with NULL ename and job because it has no employees.',
        result: {
          columns: ['ENAME', 'JOB', 'DNAME', 'LOC'],
          rows: [
            ['CLARK', 'MANAGER', 'ACCOUNTING', 'NEW YORK'],
            ['JONES', 'MANAGER', 'RESEARCH', 'DALLAS'],
            ['ALLEN', 'SALESMAN', 'SALES', 'CHICAGO'],
            [null, null, 'OPERATIONS', 'BOSTON'],
          ],
          caption: 'Showing representative rows including unmatched Dept 40',
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Table A has 10 unique rows and Table B has 6 unique rows, with 3 rows matching. How many rows do INNER, LEFT, RIGHT, FULL, and CROSS joins return?',
        answer: 'INNER = 3, LEFT = 10, RIGHT = 6, FULL = 13 (3 + 7 + 3), CROSS = 60.',
        tip: 'Note: If keys have duplicates, outer/inner join counts multiply for those duplicate keys—clarify uniqueness in interviews!',
      },
    ],
    interactiveDemo: 'joins',
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t4',
    number: 34,
    moduleId: 3,
    chapterId: 'ch7',
    chapterTitle: 'CH 7: JOINS & CORRELATED SUBQUERIES',
    title: 'SELF JOIN: Employee-Manager & Duplicate Salaries',
    shortTitle: 'SELF JOIN (Manager & Same Salary)',
    summary: 'Joining a table to itself using two distinct aliases to query hierarchies and peer comparisons.',
    intro:
      'A SELF JOIN joins a table with itself by treating it as two virtual copies using aliases (e.g., e1 for employee and e2 for manager). It is essential whenever rows inside one table reference other rows in the same table.',
    keyPoints: [
      'Employee-Manager Hierarchy: Connect e1.mgr = e2.empno (use LEFT JOIN if you also want KING who has mgr IS NULL!).',
      'Finding Employees With Same Salary: Join on A.sal = B.sal AND A.empno <> B.empno so an employee does not match themselves.',
    ],
    examples: [
      {
        title: 'Display Employee Name Along With Their Manager Name',
        query: 'SELECT e1.ename AS employee, e2.ename AS manager\nFROM emp e1\nINNER JOIN emp e2 ON e1.mgr = e2.empno;',
        explanation: 'Matches each employee’s mgr code against the manager’s empno in the same EMP table.',
        result: {
          columns: ['EMPLOYEE', 'MANAGER'],
          rows: [
            ['SMITH', 'FORD'],
            ['ALLEN', 'BLAKE'],
            ['JONES', 'KING'],
            ['SCOTT', 'JONES'],
            ['FORD', 'JONES'],
          ],
          caption: '13 rows returned (KING excluded unless LEFT JOIN is used)',
        },
      },
      {
        title: 'Employees Earning the Same Salary',
        query: 'SELECT A.ename, A.sal FROM emp A JOIN emp B ON A.sal = B.sal AND A.empno <> B.empno;',
        explanation: 'A.empno <> B.empno prevents each row from matching itself.',
        result: {
          columns: ['ENAME', 'SAL'],
          rows: [
            ['MARTIN', 1250],
            ['WARD', 1250],
            ['FORD', 3000],
            ['SCOTT', 3000],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Why did KING disappear in the INNER SELF JOIN of employees and managers?',
        answer:
          'Because KING has mgr = NULL, which matches no empno in e2. Use LEFT JOIN emp e2 ON e1.mgr = e2.empno to keep KING with a NULL manager.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t5',
    number: 35,
    moduleId: 3,
    chapterId: 'ch7',
    chapterTitle: 'CH 7: JOINS & CORRELATED SUBQUERIES',
    title: 'Correlated Subqueries & Nth Max Salary (n − 1) Logic',
    shortTitle: 'Correlated Subqueries & Nth Salary',
    summary: 'How outer-inner interdependent queries work and how to trace the famous (n − 1) Nth highest salary query.',
    intro:
      'In a correlated subquery, the inner query references a column from the outer query—meaning the inner query re-executes once for every row of the outer query. This is the classic, limit-free interview solution for finding the Nth highest or Nth lowest salary.',
    keyPoints: [
      'Interdependent execution: Outer row is picked -> inner query runs using outer row’s value -> repeated for every outer row.',
      'Formula for Nth Highest Salary: Pass (n - 1) on the left side -> WHERE (n - 1) = (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal).',
      'Formula for Nth Lowest Salary: Flip < to > -> WHERE (n - 1) = (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal > B.sal).',
      'Top 3 Salaries: WHERE 2 >= (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal).',
    ],
    examples: [
      {
        title: 'Finding the 3rd Highest Salary (n − 1 = 2)',
        query: 'SELECT * FROM emp A\nWHERE 2 = (\n  SELECT COUNT(DISTINCT B.sal)\n  FROM emp B\n  WHERE A.sal < B.sal\n);',
        explanation: 'A salary is 3rd highest when exactly 2 distinct salaries in the table are strictly greater than it (5000 and 3000 -> 2975!).',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
          rows: [[7566, 'JONES', 'MANAGER', 2975]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Explain why COUNT(DISTINCT B.sal) is used instead of COUNT(*) in the Nth highest salary correlated subquery.',
        answer:
          'Because duplicate salaries exist (both SCOTT and FORD earn 3000). Without DISTINCT, 2975 would count both 3000s plus 5000 = 3 salaries higher, skipping 2nd/3rd ranks incorrectly.',
      },
    ],
    interactiveDemo: 'nth-salary',
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t6',
    number: 36,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Set Operations: UNION, UNION ALL, INTERSECT & EXCEPT',
    shortTitle: 'Set Operations (UNION / INTERSECT / MINUS)',
    summary: 'Combining vertical result sets from multiple SELECT queries and handling duplicate rows.',
    intro:
      'Set operations stack the result sets of two or more SELECT statements vertically. All participating SELECT queries MUST return the same number of columns with compatible data types.',
    keyPoints: [
      'UNION: Combines rows from both queries and REMOVES duplicates (slower due to sort/distinct).',
      'UNION ALL: Combines all rows and KEEPS duplicates (fastest!).',
      'INTERSECT: Returns only common distinct rows present in BOTH queries.',
      'EXCEPT (or MINUS in Oracle): Returns distinct rows from the 1st query that do NOT exist in the 2nd query.',
    ],
    examples: [
      {
        title: '1st and 4th Highest Salaries in One Query (UNION)',
        query:
          'SELECT ename, sal FROM emp A WHERE 0 = (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal)\nUNION\nSELECT ename, sal FROM emp A WHERE 3 = (SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal);',
        explanation: 'Combines the 1st highest (KING, 5000) and 4th highest (BLAKE, 2850) into one result set.',
        result: {
          columns: ['ENAME', 'SAL'],
          rows: [
            ['KING', 5000],
            ['BLAKE', 2850],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between UNION and UNION ALL, and which is faster?',
        answer:
          'UNION removes duplicate rows (which requires sorting/hashing), while UNION ALL keeps all rows including duplicates. UNION ALL is faster when duplicates are impossible or acceptable.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t7',
    number: 37,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Joins vs Set Operations vs Subqueries Comparison',
    shortTitle: 'Joins vs Set Ops vs Subqueries',
    summary: 'Master comparison matrices interviewers use to test architectural judgment.',
    intro:
      'Knowing syntax is only half the interview; senior and entry-level interviews alike ask you to compare Joins, Set Operations, and Subqueries across purpose, column rules, and performance.',
    keyPoints: [
      'Joins combine columns HORIZONTALLY from related tables using ON conditions.',
      'Set Operations combine rows VERTICALLY from independent SELECTs with matching column counts and types.',
      'Subqueries feed inner query output into an outer query for filtering or scalar evaluation (often less efficient than Joins on huge tables).',
    ],
    comparison: {
      title: 'Set Operations vs Joins vs Subqueries',
      headers: ['Aspect', 'Set Operations', 'Joins', 'Subqueries'],
      rows: [
        ['Direction', 'Vertical (stacks rows)', 'Horizontal (merges columns)', 'Nested filter / value feed'],
        ['Column Requirement', 'Exact same column count & compatible types', 'Any columns from joined tables', 'Usually scalar or single-column list'],
        ['Condition Needed', 'No join condition required', 'Requires ON join condition (except CROSS)', 'Comparison operator (=, IN, EXISTS)'],
        ['Duplicate Handling', 'UNION removes; UNION ALL keeps', 'Depends on key multiplicity & join type', 'Used to filter outer rows'],
        ['Large Scale Perf', 'Fast for simple unions', 'Generally most efficient for multi-table links', 'Correlated subqueries can be slower on large tables'],
      ],
    },
    examples: [
      {
        title: 'Same Goal via Join vs Subquery',
        query: "-- Using Subquery:\nSELECT ename FROM emp WHERE deptno = (SELECT deptno FROM dept WHERE dname = 'SALES');\n\n-- Using Join:\nSELECT e.ename FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE d.dname = 'SALES';",
        explanation: 'Both return the 6 employees in SALES; the JOIN also lets you project columns from DEPT easily.',
      },
    ],
    interviewQuestions: [
      {
        question: 'When would you choose a JOIN over a Subquery?',
        answer:
          'Use a JOIN when you need columns from multiple tables in the output or when joining large datasets where query optimizers execute hash/merge joins more efficiently than correlated subqueries.',
      },
    ],
  },
  {
    id: 'm3-t8',
    number: 38,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Character Functions: UPPER, LOWER, LENGTH, REPLACE & CONCAT',
    shortTitle: 'Character Functions (UPPER/REPLACE/CONCAT)',
    summary: 'Transforming text, measuring string length, replacing characters, and concatenating with ||.',
    intro:
      'SQL provides built-in single-row character functions that transform each row’s string value independently—making case-insensitive matching, formatting, and cleanup effortless.',
    keyPoints: [
      'UPPER(str) / LOWER(str): Converts text to uppercase or lowercase (great for case-insensitive WHERE filters).',
      'LENGTH(str): Returns total character count.',
      'REPLACE(str, old, new): Replaces all occurrences of old with new (passing NULL or \'\' as new strips old completely!).',
      'CONCAT(a, b) or || operator: Joins strings together (e.g., ename || \' Works as \' || job).',
    ],
    examples: [
      {
        title: 'Stripping "A" from Employee Names & String Concatenation',
        query: "SELECT ename, REPLACE(ename, 'A', '') AS no_a, ename || ' - ' || job AS summary FROM emp WHERE deptno = 10;",
        explanation: 'Demonstrates REPLACE removing characters and || concatenating columns with literal text.',
        result: {
          columns: ['ENAME', 'NO_A', 'SUMMARY'],
          rows: [
            ['CLARK', 'CLRK', 'CLARK - MANAGER'],
            ['KING', 'KING', 'KING - PRESIDENT'],
            ['MILLER', 'MILLER', 'MILLER - CLERK'],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How can you count how many times the letter "A" appears in an employee name using SQL functions?',
        answer: "Compare original length with length after removing 'A': LENGTH(ename) - LENGTH(REPLACE(ename, 'A', '')).",
      },
    ],
  },
  {
    id: 'm3-t9',
    number: 39,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Substring & Position Search: SUBSTR & INSTR',
    shortTitle: 'SUBSTR & INSTR Pattern Tricks',
    summary: 'Extracting slices from positive/negative offsets and finding exact character occurrence counts.',
    intro:
      'SUBSTR extracts a slice of characters from a string, while INSTR returns the 1-based position of a character or substring. Together, they solve advanced string interview questions without regex.',
    keyPoints: [
      'SUBSTR(str, start, len): Extracts len characters starting at 1-based position start. Negative start counts backward from the end (e.g., SUBSTR(job, -3) = last 3 chars).',
      'INSTR(str, search_char, start_pos, occurrence): Returns the index of the Nth occurrence, or 0 if not found.',
      'Interview Trick (Exactly 1 "L" in name): INSTR(ename, \'L\', 1, 1) > 0 AND INSTR(ename, \'L\', 1, 2) = 0 -> returns BLAKE and CLARK!',
    ],
    examples: [
      {
        title: 'Finding Jobs Ending With "MAN" & Names With Exactly 1 "L"',
        query: "-- Jobs ending with MAN:\nSELECT ename, job FROM emp WHERE SUBSTR(job, -3) = 'MAN';\n\n-- Names with exactly 1 'L':\nSELECT ename FROM emp WHERE INSTR(ename, 'L', 1, 1) > 0 AND INSTR(ename, 'L', 1, 2) = 0;",
        explanation: 'Negative offset -3 inspects the last 3 characters (SALESMAN); INSTR checks 1st occurrence exists and 2nd does not.',
        result: {
          columns: ['ENAME (EXACTLY 1 L)'],
          rows: [['BLAKE'], ['CLARK']],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you find employees whose name has at least 2 "A"s using INSTR?',
        answer: "WHERE INSTR(ename, 'A', 1, 2) > 0 (meaning a 2nd occurrence of 'A' exists at position > 0).",
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t10',
    number: 40,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Numeric & Date Functions: MOD, ROUND, TRUNC & SYSTIMESTAMP',
    shortTitle: 'MOD, ROUND, TRUNC & SYSTIMESTAMP',
    summary: 'Modulo odd/even checks, rounding vs truncating decimals, and fractional-second timestamps.',
    intro:
      'Numeric and Date functions handle math rounding, remainder arithmetic, and system time lookups. Knowing ROUND vs TRUNC and SYSDATE vs SYSTIMESTAMP catches frequent multiple-choice and whiteboard questions.',
    keyPoints: [
      'MOD(m, n): Returns remainder of m / n. Odd salaries: WHERE MOD(sal, 2) <> 0 (returns JONES: 2975).',
      'ROUND(34.76, 1) -> 34.8 (rounds to nearest decimal), whereas TRUNC(34.76, 1) -> 34.7 (chops off without rounding).',
      'SYSDATE: Returns database date & time (default display dd-mon-yy).',
      'SYSTIMESTAMP (Oracle 9i+): Returns date, time with fractional seconds (microseconds), and timezone.',
    ],
    examples: [
      {
        title: 'ROUND vs TRUNC and Odd-Salary Filter',
        query: 'SELECT ROUND(34.76, 1) AS rounded, TRUNC(34.76, 1) AS truncated, MOD(7, 2) AS rem FROM dual;',
        explanation: 'ROUND rounds up at >= 5; TRUNC strictly discards trailing digits.',
        result: {
          columns: ['ROUNDED', 'TRUNCATED', 'REM'],
          rows: [[34.8, 34.7, 1]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Which Oracle function returns fractional seconds along with the system time and timezone?',
        answer: 'SYSTIMESTAMP (introduced in Oracle 9i).',
      },
    ],
  },
  {
    id: 'm3-t11',
    number: 41,
    moduleId: 3,
    chapterId: 'ch8',
    chapterTitle: 'CH 8: SET OPERATIONS & FUNCTIONS',
    title: 'Special Functions: TO_CHAR, NVL & DECODE',
    shortTitle: 'TO_CHAR, NVL & DECODE',
    summary: 'Formatting dates, substituting NULL values safely, and writing inline conditional logic.',
    intro:
      'Special functions bridge formatting, NULL safety, and conditional branching inside a single SELECT expression.',
    keyPoints: [
      'TO_CHAR(date, format): Formats dates into custom strings like TO_CHAR(hiredate, \'mm/dd/yyyy\') or \'day, dd-month\'.',
      'NVL(expr, fallback): Replaces NULL with a fallback value (e.g., sal + NVL(comm, 0) prevents NULL total salary!). Standard ANSI equivalent is COALESCE.',
      'DECODE(col, val1, res1, val2, res2, default): Oracle’s compact if-then-else expression (modern ANSI equivalent is CASE WHEN ... END).',
    ],
    examples: [
      {
        title: 'Handling NULL Commission with NVL & Mapping Jobs with DECODE',
        query: "SELECT ename, sal, NVL(comm, 0) AS comm_val, sal + NVL(comm, 0) AS total_sal,\n  DECODE(job, 'CLERK', 'C', 'SALESMAN', 'S', 'O') AS code\nFROM emp;",
        explanation: 'Prevents NULL arithmetic contamination and maps job titles to single-letter codes.',
        result: {
          columns: ['ENAME', 'SAL', 'COMM_VAL', 'TOTAL_SAL', 'CODE'],
          rows: [
            ['SMITH', 800, 0, 800, 'C'],
            ['ALLEN', 1600, 300, 1900, 'S'],
            ['JONES', 2975, 0, 2975, 'O'],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you display -100 wherever commission is NULL while keeping valid commissions intact?',
        answer: 'SELECT ename, NVL(comm, -100) FROM emp; (or COALESCE(comm, -100) in standard SQL/MySQL/Postgres).',
      },
    ],
  },
  {
    id: 'm3-t12',
    number: 42,
    moduleId: 3,
    chapterId: 'ch9',
    chapterTitle: 'CH 9: NORMALIZATION & DATABASE DESIGN',
    title: 'Normalization Advantages & Anomalies (Insert, Update, Delete)',
    shortTitle: 'Normalization & Data Anomalies',
    summary: 'Why giant flat tables break in production and how normalization fixes redundancy and anomalies.',
    intro:
      'Normalization is the structured process of splitting a large, redundant table into smaller, well-linked tables during the design phase of SDLC—without losing any data or functionality.',
    keyPoints: [
      'Reduces Data Redundancy: Avoids repeating student details or book details on every library checkout row.',
      'Eliminates Delete Anomaly: Deleting the only library checkout of a student shouldn’t accidentally erase the student’s profile!',
      'Eliminates Update Anomaly: Changing a student’s phone number requires updating 1 row in STUDENTS instead of 20 borrow records.',
      'Eliminates Insert Anomaly: You can register a new Book even before any student borrows it.',
    ],
    examples: [
      {
        title: 'Flat Unnormalized Table Problem',
        query: '-- Imagine COLLEGE(RegNo, Sname, Phone, BookNo, Bname, DOI, DOR)\n-- Deleting a checkout row wipes out Book details & Student details!',
        explanation: 'Mixing two independent entities (Students & Books) with a transaction (Library) creates severe anomalies.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What are the main advantages—and the single minor disadvantage—of Normalization?',
        answer:
          'Advantages: Eliminates data redundancy and Insert/Update/Delete anomalies. Disadvantage: Queries become slightly more complex and slower because you must JOIN multiple smaller tables.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t13',
    number: 43,
    moduleId: 3,
    chapterId: 'ch9',
    chapterTitle: 'CH 9: NORMALIZATION & DATABASE DESIGN',
    title: '1NF, 2NF & 3NF Step-by-Step (College Library Schema)',
    shortTitle: '1NF, 2NF & 3NF Step-by-Step',
    summary: 'Decomposing a monolithic COLLEGE table cleanly into STUDENTS, BOOKS, and LIBRARY.',
    intro:
      'Walk through the three core normal forms step by step: 1NF ensures atomic rows and probable keys, 2NF removes partial dependencies on composite keys, and 3NF isolates transitive/non-key dependencies into clean entity tables.',
    keyPoints: [
      '1NF (First Normal Form): Atomic column values, no repeating groups/duplicate records, and identify probable primary keys (RegNo, BookNo).',
      '2NF (Second Normal Form): Must be in 1NF; separate complete entity dependencies into dedicated tables (split STUDENTS from BOOKS/Borrowing).',
      '3NF (Third Normal Form): Must be in 2NF; remove transitive/partial entity attributes into their own table -> producing STUDENTS(RegNo PK), BOOKS(BookNo PK), and LIBRARY(RegNo FK, BookNo FK, DOI, DOR, Fine).',
    ],
    examples: [
      {
        title: 'Final 3NF Normalized Tables',
        query:
          'CREATE TABLE students (regno NUMBER PRIMARY KEY, sname VARCHAR2(50) NOT NULL, semester NUMBER, phone VARCHAR2(15));\nCREATE TABLE books (bookno NUMBER PRIMARY KEY, bname VARCHAR2(80), author VARCHAR2(60));\nCREATE TABLE library (regno NUMBER REFERENCES students(regno), bookno NUMBER REFERENCES books(bookno), doi DATE, dor DATE, fine NUMBER);',
        explanation: 'Every entity lives once in its master table; LIBRARY records only checkout transactions via Foreign Keys.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Briefly summarize 1NF, 2NF, and 3NF in one sentence each.',
        answer:
          '1NF: Atomic values and no duplicate rows. 2NF: In 1NF with no partial dependency on a composite primary key. 3NF: In 2NF with no transitive dependency (non-key columns depend only on the primary key).',
      },
    ],
    interactiveDemo: 'normalization',
    isInterviewFavorite: true,
  },
  {
    id: 'm3-t14',
    number: 44,
    moduleId: 3,
    chapterId: 'ch9',
    chapterTitle: 'CH 9: NORMALIZATION & DATABASE DESIGN',
    title: 'Denormalization, ERD Diagrams & Oracle 9i/10g Features',
    shortTitle: 'Denormalization, ERD & Oracle Features',
    summary: 'When combining tables improves read speed, reading Entity Relationship Diagrams, and key Oracle milestone features.',
    intro:
      'While normalization protects write integrity, analytical dashboards sometimes intentionally combine tables back together—a technique called Denormalization. Meanwhile, an ERD visually maps all entities and Foreign Key links.',
    keyPoints: [
      'Denormalization: Combining multiple normalized tables into a single wider table to reduce expensive JOINs in read-heavy reporting.',
      'ERD (Entity Relationship Diagram): Pictorial diagram showing tables (entities), Primary Keys, Foreign Keys, and relationships.',
      'Oracle 9i ("i" = Internet) Features: TIMESTAMP datatype, SYSTIMESTAMP function, ANSI-style JOINs, Renaming a column.',
      'Oracle 10g ("g" = Grid) Features: Recycle Bin (FLASHBACK & PURGE).',
    ],
    examples: [
      {
        title: 'Denormalized Reporting View Concept',
        query: 'CREATE VIEW emp_dept_report AS\nSELECT e.empno, e.ename, e.job, e.sal, d.dname, d.loc\nFROM emp e JOIN dept d ON e.deptno = d.deptno;',
        explanation: 'A database View exposes a denormalized read interface without physically duplicating underlying table data.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is Denormalization and why would anyone use it after normalizing a database?',
        answer:
          'Denormalization intentionally merges normalized tables back together to minimize multi-table JOINs and dramatically speed up read-heavy analytics and reporting queries.',
      },
    ],
  },
  {
    id: 'm3-t15',
    number: 45,
    moduleId: 3,
    chapterId: 'ch9',
    chapterTitle: 'CH 9: NORMALIZATION & DATABASE DESIGN',
    title: 'Top SQL Interview Questions & Live Query Practice',
    shortTitle: 'Final Interview Questions & Live Practice',
    summary: 'End-to-end interview checklist combining EMP/DEPT queries, joins, correlated subqueries, and theory.',
    intro:
      'You’ve covered the complete SQL & RDBMS syllabus! Use this final topic to review the highest-probability interview questions and run live practice queries against the EMP and DEPT datasets.',
    keyPoints: [
      'Always clarify edge cases in interviews: NULL handling, duplicate ties in Nth salary, and whether unmatched rows should appear (INNER vs LEFT JOIN).',
      'Keep SQL logical execution order in mind when debugging WHERE vs HAVING vs ORDER BY errors.',
    ],
    examples: [
      {
        title: 'Employee Earning 1st Max Salary With Department Name',
        query: 'SELECT e.ename, d.dname, e.sal FROM emp e JOIN dept d ON e.deptno = d.deptno WHERE e.sal = (SELECT MAX(sal) FROM emp);',
        explanation: 'Combines an INNER JOIN with a scalar subquery to return KING and ACCOUNTING.',
        result: {
          columns: ['ENAME', 'DNAME', 'SAL'],
          rows: [['KING', 'ACCOUNTING', 5000]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Display the department name(s) having no employees at all—using a JOIN instead of NOT IN.',
        answer:
          'SELECT d.dname FROM dept d LEFT JOIN emp e ON d.deptno = e.deptno WHERE e.empno IS NULL;',
        tip: 'LEFT JOIN + WHERE right_pk IS NULL is often preferred over NOT IN because it is immune to NULL bugs!',
      },
      {
        question: 'How do you find duplicate records in a table?',
        answer: 'SELECT col, COUNT(*) FROM table_name GROUP BY col HAVING COUNT(*) > 1;',
      },
    ],
    interactiveDemo: 'emp-sandbox',
    isInterviewFavorite: true,
  },
];
