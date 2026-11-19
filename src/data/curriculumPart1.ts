import { Topic } from '../types/sqlCurriculum';

export const MODULE_1_TOPICS: Topic[] = [
  {
    id: 'm1-t1',
    number: 1,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'Database, DBMS, RDBMS & Codd Rules',
    shortTitle: 'Database, DBMS, RDBMS & Codd Rules',
    summary: 'Core definitions of Database, DBMS vs RDBMS, and the Codd rules every interviewer asks first.',
    intro:
      'A database is an organized collection of interrelated data stored in tables so it can be retrieved and updated efficiently. Software used to create and manage databases is called a DBMS, while a Relational DBMS (RDBMS) organizes data into related tables and enforces E. F. Codd’s rules.',
    keyPoints: [
      'Database: Collection of 1 or more interrelated tables storing useful information.',
      'DBMS (Database Management System): Software to store and manage data in files/tables without strict relational rules (e.g., FoxPro, FoxBase, dBase).',
      'RDBMS (Relational DBMS): Organizes data into tables (relations) with rows (tuples) and columns (attributes), supporting high data volume, security, and relationships (e.g., Oracle, MySQL, PostgreSQL, SQL Server, DB2).',
      'Codd Rules: To qualify as an RDBMS, a system must support NULL values, table relationships, DDL/DML/TCL, constraints (PK, Unique, Check), and query techniques like subqueries, joins, and grouping.',
    ],
    examples: [
      {
        title: 'Checking Tables in Oracle / SQL Schema',
        query: 'SELECT * FROM tab;',
        explanation: 'Lists all user tables and database objects in the current Oracle schema.',
        result: {
          columns: ['TNAME', 'TABTYPE'],
          rows: [
            ['DEPT', 'TABLE'],
            ['EMP', 'TABLE'],
            ['BONUS', 'TABLE'],
            ['SALGRADE', 'TABLE'],
          ],
        },
      },
    ],
    comparison: {
      title: 'DBMS vs RDBMS',
      headers: ['Aspect', 'DBMS', 'RDBMS'],
      rows: [
        ['Data Storage', 'Stores data as files or disconnected tables', 'Stores data in related tables (relations)'],
        ['Relationships', 'No built-in referential integrity between tables', 'Enforces Primary Key & Foreign Key relationships'],
        ['Codd Rules', 'Does not satisfy Codd’s relational rules', 'Must satisfy Codd’s rules'],
        ['Data Volume & Security', 'Designed for small datasets, limited security', 'Handles large volumes, ACID transactions & strict security'],
        ['Examples', 'FoxPro, FoxBase, dBase', 'Oracle, MySQL, PostgreSQL, SQL Server, DB2'],
      ],
    },
    interviewQuestions: [
      {
        question: 'What is the difference between DBMS and RDBMS?',
        answer:
          'A DBMS stores data without enforcing relational links or Codd’s rules, whereas an RDBMS organizes data into tables linked by Primary and Foreign Keys, satisfies Codd’s rules, and provides stronger data integrity, performance, and security.',
        tip: 'Mention Codd’s rules and master-child relationships—interviewers look for those exact keywords.',
      },
      {
        question: 'What are the 5 Codd requirements commonly tested in interviews?',
        answer:
          'Supporting NULL values, creating relationships between tables, supporting DDL/DML/TCL, supporting constraints (PK, UNIQUE, CHECK), and supporting subqueries, joins, and grouping.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t2',
    number: 2,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'Tables, Tuples, Attributes & Master-Child Relationships',
    shortTitle: 'Tables, Rows, Columns & Relationships',
    summary: 'Relational terminology (Relation, Tuple, Attribute, Cell) and how Master (Parent) & Detail (Child) tables prevent invalid data.',
    intro:
      'In RDBMS terminology, a table is called an Entity or Relation, a row is a Record or Tuple, and a column is a Field or Attribute. Tables connect through Master (Parent) and Detail (Child) relationships so child rows cannot reference non-existent parent records.',
    keyPoints: [
      'Cell: Intersection of a single row and a single column.',
      'Column = Field / Attribute; Row = Record / Tuple; Table = Entity / Relation.',
      'Master (Parent) Table: Holds stable master data (e.g., DEPT with DeptNo 10, 20, 30, 40) that changes infrequently.',
      'Detail (Child) Table: Holds transactional data (e.g., EMP) that changes often and references the parent.',
      'Integrity Rule: Any foreign key value inserted into the child table must already exist in the master table—otherwise the database rejects the record.',
    ],
    examples: [
      {
        title: 'DEPT (Master Table) vs EMP (Child Table)',
        query: 'SELECT deptno, dname, loc FROM dept;',
        explanation: 'DEPT is the parent table. Every employee in EMP must belong to a valid deptno from DEPT.',
        result: {
          columns: ['DEPTNO', 'DNAME', 'LOC'],
          rows: [
            [10, 'ACCOUNTING', 'NEW YORK'],
            [20, 'RESEARCH', 'DALLAS'],
            [30, 'SALES', 'CHICAGO'],
            [40, 'OPERATIONS', 'BOSTON'],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What happens if you try to insert a record into a Child table with a DeptNo that does not exist in the Master table?',
        answer:
          'The RDBMS rejects the insert with a referential integrity (foreign key) violation error because every child foreign key value must match an existing parent primary key value (or be NULL if allowed).',
      },
    ],
  },
  {
    id: 'm1-t3',
    number: 3,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'SQL vs MySQL / SQL Server & CRUD Operations',
    shortTitle: 'SQL vs MySQL & CRUD Operations',
    summary: 'Why SQL is a query language (not a database), case sensitivity rules, and the 4 CRUD operations.',
    intro:
      'SQL (Structured Query Language) is the standard language used to store, manipulate, and retrieve data from an RDBMS. MySQL, Oracle, and SQL Server are database software systems that execute SQL—SQL itself is not a database.',
    keyPoints: [
      'SQL is a language; MySQL / Oracle / SQL Server / PostgreSQL are RDBMS software products.',
      'SQL keywords are NOT case sensitive (SELECT is identical to select), though string values inside single quotes are case sensitive in Oracle.',
      'CRUD stands for Create (CREATE/INSERT), Read (SELECT), Update (UPDATE), and Delete (DELETE/DROP).',
      'Database objects include Tables, Views, Indexes, Stored Procedures, Functions, and Triggers.',
    ],
    examples: [
      {
        title: 'Case-Insensitive Keywords vs Case-Sensitive Data',
        query: "select ename, job from emp where job = 'MANAGER';",
        explanation: "Keywords 'select', 'from', 'where' work in any case, but 'MANAGER' inside single quotes must match the stored case.",
        result: {
          columns: ['ENAME', 'JOB'],
          rows: [
            ['JONES', 'MANAGER'],
            ['BLAKE', 'MANAGER'],
            ['CLARK', 'MANAGER'],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Is SQL a database? What is the difference between SQL and MySQL (or SQL Server)?',
        answer:
          'No. SQL is a Structured Query Language used to interact with relational databases. MySQL and SQL Server are RDBMS software systems that store data and interpret SQL commands.',
      },
    ],
  },
  {
    id: 'm1-t4',
    number: 4,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'SQL Data Types & CHAR vs VARCHAR Memory',
    shortTitle: 'SQL Data Types (CHAR vs VARCHAR)',
    summary: 'CHAR vs VARCHAR memory allocation, NUMBER(precision, scale), DATE, BLOB, CLOB, and INT/FLOAT types.',
    intro:
      'Data types define the kind of values a column can hold. One of the most common interview questions is how CHAR wastes unused space with fixed blank padding while VARCHAR/VARCHAR2 uses variable-length memory.',
    keyPoints: [
      'CHAR(n): Fixed-length string. Storing "TOM" in CHAR(6) allocates all 6 bytes (3 characters + 3 non-reusable blank spaces). Max 255 in MySQL / 2000 in Oracle.',
      'VARCHAR(n) / VARCHAR2(n): Variable-length string. Storing "TOM" in VARCHAR(6) uses only 3 bytes; remaining space stays reusable/NULL. Max 4000 bytes in Oracle.',
      'NUMBER(p, s): Precision (p) = total digits; Scale (s) = digits after decimal. Example: NUMBER(6,2) holds up to 9999.99.',
      'DATE & TIME: Stores dates (YYYY-MM-DD in MySQL, DD-MON-YY default in Oracle); TIMESTAMP adds fractional seconds.',
      'BLOB & CLOB: Binary Large Object (images/audio/video) and Character Large Object (large text up to 4GB).',
    ],
    syntax: `CREATE TABLE sample_types (
  code CHAR(6),
  name VARCHAR(50),
  salary NUMBER(8, 2),
  joined DATE
);`,
    examples: [
      {
        title: 'Precision and Scale in NUMBER(p, s)',
        query: '-- NUMBER(4, 3) max value: 9.999\n-- NUMBER(2, 2) max value: .99\n-- NUMBER(6, 2) max value: 9999.99',
        explanation: 'Precision counts total digits including decimals; scale counts digits strictly to the right of the decimal point.',
      },
    ],
    comparison: {
      title: 'CHAR vs VARCHAR / VARCHAR2',
      headers: ['Feature', 'CHAR(n)', 'VARCHAR(n) / VARCHAR2(n)'],
      rows: [
        ['Length Type', 'Fixed length', 'Variable length'],
        ['Memory for "TOM" in (6)', '6 bytes (padded with 3 blanks)', '3 bytes (remaining memory reusable)'],
        ['LENGTH("TOM")', '6 (includes blank padding)', '3 (actual characters stored)'],
        ['Best Used For', 'Fixed-size codes (State, Gender, PIN)', 'Names, emails, descriptions'],
      ],
    },
    interviewQuestions: [
      {
        question: 'Why is VARCHAR preferred over CHAR for names and addresses?',
        answer:
          'CHAR allocates fixed memory and pads unused characters with blank spaces that cannot be reused, wasting storage. VARCHAR allocates only the exact length of the inserted string.',
      },
    ],
    interactiveDemo: 'char-varchar',
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t5',
    number: 5,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'Constraints: NULL, NOT NULL & UNIQUE',
    shortTitle: 'NULL Properties, NOT NULL & UNIQUE',
    summary: 'Understanding what NULL really means in SQL arithmetic and how NOT NULL and UNIQUE validate columns.',
    intro:
      'Constraints restrict invalid data from entering a table. Before using constraints, you must understand NULL: NULL is neither zero nor a blank space—it represents an unknown value that occupies no space.',
    keyPoints: [
      'NULL is neither 0 nor space; two NULLs are never equal to each other in Oracle (so use IS NULL, never = NULL).',
      'Any arithmetic operation with NULL produces NULL (e.g., 100000 + NULL = NULL; 100000 * NULL = NULL).',
      'NOT NULL ensures a column cannot be left empty—at least some value must be provided.',
      'UNIQUE prevents duplicate values in a column, yet allows multiple NULL values (since two NULLs are not considered equal).',
    ],
    examples: [
      {
        title: 'Arithmetic with NULL Commission in EMP',
        query: 'SELECT ename, sal, comm, sal + comm AS total FROM emp WHERE ename IN (\'SMITH\', \'ALLEN\');',
        explanation: 'SMITH has NULL commission so sal + comm becomes NULL unless handled with NVL/COALESCE.',
        result: {
          columns: ['ENAME', 'SAL', 'COMM', 'TOTAL'],
          rows: [
            ['SMITH', 800, null, null],
            ['ALLEN', 1600, 300, 1900],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Can a UNIQUE column contain multiple NULL values?',
        answer:
          'Yes (in Oracle, PostgreSQL, and MySQL). Because NULL represents an unknown value and two NULLs are never considered equal, multiple NULLs do not violate uniqueness.',
      },
      {
        question: 'What is the output of 5000 + NULL in SQL?',
        answer: 'NULL. Any arithmetic expression involving NULL evaluates to NULL.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t6',
    number: 6,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'Primary Key, Composite Key & Foreign Key',
    shortTitle: 'Primary Key, Composite & Foreign Key',
    summary: 'How PK uniquely identifies every row, composite keys span multiple columns, and FK enforces referential integrity.',
    intro:
      'Primary Key (PK) and Foreign Key (FK) are the backbone of relational database design. A Primary Key combines NOT NULL and UNIQUE to guarantee row identity, while a Foreign Key links a child table back to a parent table.',
    keyPoints: [
      'Primary Key = NOT NULL + UNIQUE. Only ONE Primary Key is allowed per table (though it can span multiple columns as a Composite Primary Key).',
      'Composite Primary Key: Created on 2 or more columns together when a single column is not unique (e.g., PRIMARY KEY (regno, bookno, doi)).',
      'Foreign Key (Referential Integrity Constraint): Created on the child table referencing a Primary Key (or Unique Key) on the master table.',
      'Unlike a Primary Key, a Foreign Key CAN accept both NULL and duplicate values, and a table can have multiple Foreign Keys.',
    ],
    syntax: `CREATE TABLE orders (
  orderid NUMBER(4) PRIMARY KEY,
  prodid  NUMBER(4) REFERENCES products(prodid),
  qty_sold NUMBER(3) CHECK (qty_sold > 0)
);`,
    examples: [
      {
        title: 'Adding a Composite Primary Key via ALTER TABLE',
        query: 'ALTER TABLE library ADD PRIMARY KEY (regno, bookno, doi);',
        explanation: 'Ensures the same student cannot borrow the same book twice on the same issue date.',
      },
    ],
    comparison: {
      title: 'Primary Key vs Foreign Key vs Unique',
      headers: ['Rule', 'Primary Key', 'Unique', 'Foreign Key'],
      rows: [
        ['Allows NULL?', 'No', 'Yes (multiple in Oracle/MySQL)', 'Yes'],
        ['Allows Duplicates?', 'No', 'No', 'Yes'],
        ['Max per Table', 'Only 1', 'Multiple', 'Multiple'],
        ['Purpose', 'Uniquely identifies each row', 'Prevents duplicate values', 'Links child table to parent PK'],
      ],
    },
    interviewQuestions: [
      {
        question: 'Can a table have more than one Primary Key or more than one Foreign Key?',
        answer:
          'A table can have only ONE Primary Key (which may be composite across multiple columns), but it can have MULTIPLE Foreign Keys referencing different parent tables.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t7',
    number: 7,
    moduleId: 1,
    chapterId: 'ch1',
    chapterTitle: 'CH 1: RDBMS CONCEPTS & CONSTRAINTS',
    title: 'CHECK Constraint & Named Constraints',
    shortTitle: 'CHECK Constraint & Validations',
    summary: 'Adding custom business validation rules (e.g., sal > 0) and managing constraints with ALTER TABLE.',
    intro:
      'The CHECK constraint enforces domain-specific business rules directly at the database level—so invalid salaries, negative quantities, or out-of-range commissions can never be saved.',
    keyPoints: [
      'CHECK validates every inserted or updated value against a boolean condition.',
      'Common examples: CHECK (sal > 0), CHECK (qty > 0), CHECK (commission BETWEEN 1000 AND 5000).',
      'Named constraints let you drop or alter specific rules cleanly later using ALTER TABLE ... DROP CONSTRAINT.',
    ],
    syntax: `CREATE TABLE products (
  prodid NUMBER(4) PRIMARY KEY,
  prodname VARCHAR2(20) NOT NULL,
  qty NUMBER(3) CONSTRAINT chk_qty_pos CHECK (qty > 0)
);`,
    examples: [
      {
        title: 'Adding and Dropping Named Constraints',
        query:
          'ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id);\nALTER TABLE orders DROP CONSTRAINT fk_customer;',
        explanation: 'Naming constraints makes schema maintenance predictable in production.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you restrict a column so only positive salaries are inserted?',
        answer: 'Attach a CHECK constraint on the column: sal NUMBER(8,2) CHECK (sal > 0).',
      },
    ],
  },
  {
    id: 'm1-t8',
    number: 8,
    moduleId: 1,
    chapterId: 'ch2',
    chapterTitle: 'CH 2: DQL BASICS & FILTERING',
    title: 'SELECT, DESC, DUAL & EMP/DEPT Schema',
    shortTitle: 'SELECT, DESC, DUAL & EMP Schema',
    summary: 'Anatomy of SELECT queries, describing table structures with DESC, and using the Oracle DUAL dummy table.',
    intro:
      'SELECT is the foundation of DQL (Data Query Language). It retrieves specific columns or all columns (*) from tables without altering stored data. Understanding the classic 14-row EMP and 4-row DEPT tables makes almost every SQL interview problem effortless.',
    keyPoints: [
      'SELECT * retrieves all columns; listing explicit column names (SELECT ename, job, sal) is faster and cleaner.',
      'DESC table_name displays column names, NULLability, and data types.',
      'DUAL is a 1-row, 1-column dummy table in Oracle used to evaluate expressions or functions not tied to a real table (e.g., SELECT 100 + 200 FROM dual).',
      'Note: SELECT is strictly DQL (neither DDL nor DML) because it displays data without modifying structure or records.',
    ],
    examples: [
      {
        title: 'Projecting Specific Columns from EMP',
        query: 'SELECT ename, job, sal FROM emp;',
        explanation: 'Fetches only the 3 requested columns across all 14 employee rows.',
        result: {
          columns: ['ENAME', 'JOB', 'SAL'],
          rows: [
            ['SMITH', 'CLERK', 800],
            ['ALLEN', 'SALESMAN', 1600],
            ['JONES', 'MANAGER', 2975],
            ['KING', 'PRESIDENT', 5000],
          ],
          caption: 'Showing 4 of 14 rows',
        },
      },
      {
        title: 'Evaluating Independent Expressions with DUAL',
        query: 'SELECT 100 + 200 AS "ADDITION" FROM dual;',
        explanation: 'Evaluates arithmetic or system date functions without needing a user table.',
        result: {
          columns: ['ADDITION'],
          rows: [[300]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the DUAL table in Oracle and when is it used?',
        answer:
          'DUAL is a built-in dummy table with one row and one column. It is used when you need to compute an expression or call a function (like SYSDATE, UPPER, or arithmetic) that does not depend on any table.',
      },
    ],
  },
  {
    id: 'm1-t9',
    number: 9,
    moduleId: 1,
    chapterId: 'ch2',
    chapterTitle: 'CH 2: DQL BASICS & FILTERING',
    title: 'WHERE Clause & Relational Operators',
    shortTitle: 'WHERE Clause & Comparison Operators',
    summary: 'Filtering rows using =, >, <, >=, <=, <> / != and handling single-quoted strings.',
    intro:
      'The WHERE clause restricts which rows are returned (or updated/deleted) based on a condition evaluated row by row before any grouping happens.',
    keyPoints: [
      'Relational operators: = (equal), > (greater than), < (less than), >=, <=, and <> or != (not equal).',
      'String literals must be enclosed in single quotes (\'SALESMAN\') and are case-sensitive in Oracle.',
      'WHERE filters individual rows; it cannot contain aggregate functions like SUM(sal) > 5000.',
    ],
    syntax: `SELECT column1, column2
FROM table_name
WHERE condition;`,
    examples: [
      {
        title: 'Employees Earning More Than 2500',
        query: 'SELECT empno, ename, job, sal, deptno FROM emp WHERE sal > 2500;',
        explanation: 'Returns only the 5 employees whose salary exceeds 2500.',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL', 'DEPTNO'],
          rows: [
            [7566, 'JONES', 'MANAGER', 2975, 20],
            [7698, 'BLAKE', 'MANAGER', 2850, 30],
            [7788, 'SCOTT', 'ANALYST', 3000, 20],
            [7839, 'KING', 'PRESIDENT', 5000, 10],
            [7902, 'FORD', 'ANALYST', 3000, 20],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Are string comparisons inside a WHERE clause case sensitive?',
        answer:
          'SQL keywords and column names are case-insensitive, but string literals inside single quotes (like \'MANAGER\') are case-sensitive in Oracle and PostgreSQL (though case-insensitive by default in standard MySQL collations).',
      },
    ],
  },
  {
    id: 'm1-t10',
    number: 10,
    moduleId: 1,
    chapterId: 'ch2',
    chapterTitle: 'CH 2: DQL BASICS & FILTERING',
    title: 'Logical Operators: AND, OR, NOT & Parentheses',
    shortTitle: 'Logical Operators (AND, OR, NOT)',
    summary: 'Combining multiple filter conditions safely and avoiding OR precedence traps with parentheses.',
    intro:
      'Logical operators combine multiple conditions inside WHERE. AND requires all conditions to be true, OR requires at least one to be true, and NOT negates a condition.',
    keyPoints: [
      'AND has higher precedence than OR—always wrap OR conditions in parentheses when mixing with AND!',
      'NOT can be paired with IN, BETWEEN, LIKE, and NULL (NOT IN, NOT BETWEEN, NOT LIKE, IS NOT NULL).',
      'Trap: WHERE deptno = 10 AND deptno = 20 returns 0 rows because a single row cannot simultaneously have two department numbers—use OR or IN (10, 20).',
    ],
    examples: [
      {
        title: 'Salesmen in Dept 30 Earning Over 1500',
        query: "SELECT empno, ename, sal, deptno FROM emp WHERE job = 'SALESMAN' AND deptno = 30 AND sal > 1500;",
        explanation: 'All three conditions must hold true for each returned employee.',
        result: {
          columns: ['EMPNO', 'ENAME', 'SAL', 'DEPTNO'],
          rows: [[7499, 'ALLEN', 1600, 30]],
        },
      },
      {
        title: 'Complex Filter with NOT IN & BETWEEN',
        query: "SELECT ename, job, sal, deptno FROM emp WHERE job NOT IN ('MANAGER', 'CLERK') AND deptno IN (10, 20) AND sal BETWEEN 1000 AND 3000;",
        explanation: 'Filters out managers and clerks in depts 10/20 while keeping salaries between 1000 and 3000.',
        result: {
          columns: ['ENAME', 'JOB', 'SAL', 'DEPTNO'],
          rows: [
            ['SCOTT', 'ANALYST', 3000, 20],
            ['FORD', 'ANALYST', 3000, 20],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does mixing AND and OR without parentheses cause bugs?',
        answer:
          'AND evaluates before OR. Writing WHERE country=\'USA\' AND city=\'NY\' OR city=\'LA\' matches any LA row regardless of country. Always wrap OR groups: WHERE country=\'USA\' AND (city=\'NY\' OR city=\'LA\').',
      },
    ],
  },
  {
    id: 'm1-t11',
    number: 11,
    moduleId: 1,
    chapterId: 'ch3',
    chapterTitle: 'CH 3: SPECIAL OPERATORS & SORTING',
    title: 'IN, BETWEEN, IS NULL, DISTINCT & Aliases (AS)',
    shortTitle: 'IN, BETWEEN, IS NULL & DISTINCT',
    summary: 'Using special SQL operators for sets, inclusive ranges, NULL checks, unique rows, and column aliases.',
    intro:
      'Special operators make queries dramatically cleaner than chains of ORs. IN checks membership in a list, BETWEEN checks an inclusive range, IS NULL tests missing values, DISTINCT removes duplicate rows, and AS renames output columns.',
    keyPoints: [
      'IN (val1, val2, ...): Shorthand for multiple OR checks (Oracle supports up to 1000 items in a static IN list).',
      'BETWEEN low AND high: Inclusive of both boundary values (low <= x <= high). Always put the smaller value first.',
      'IS NULL / IS NOT NULL: Only valid way to check for NULLs (= NULL always returns false/unknown).',
      'DISTINCT: Eliminates duplicate rows from query output.',
      'AS "Alias": Renames a column or expression in the result set.',
    ],
    examples: [
      {
        title: 'Employees Without a Reporting Manager',
        query: 'SELECT empno, ename, job, sal FROM emp WHERE mgr IS NULL;',
        explanation: 'Uses IS NULL rather than = NULL to locate the top-level executive.',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
          rows: [[7839, 'KING', 'PRESIDENT', 5000]],
        },
      },
      {
        title: 'Distinct Departments in EMP',
        query: 'SELECT DISTINCT deptno FROM emp;',
        explanation: 'Collapses 14 employee rows down to the unique department numbers present.',
        result: {
          columns: ['DEPTNO'],
          rows: [[10], [20], [30]],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Is the BETWEEN operator inclusive of both endpoints?',
        answer:
          'Yes! WHERE sal BETWEEN 2000 AND 3000 is equivalent to WHERE sal >= 2000 AND sal <= 3000.',
      },
      {
        question: 'Why does SELECT * FROM emp WHERE comm = NULL return zero rows?',
        answer:
          'Because NULL represents an unknown value, any comparison using = or <> with NULL yields UNKNOWN, not TRUE. You must write WHERE comm IS NULL.',
      },
    ],
  },
  {
    id: 'm1-t12',
    number: 12,
    moduleId: 1,
    chapterId: 'ch3',
    chapterTitle: 'CH 3: SPECIAL OPERATORS & SORTING',
    title: 'Pattern Matching with LIKE (% and _ Wildcards)',
    shortTitle: 'Pattern Matching with LIKE (% & _)',
    summary: 'Mastering wildcard searches for prefixes, suffixes, substrings, and exact character positions.',
    intro:
      'The LIKE operator searches text columns for patterns using two wildcards: % (matches zero, one, or many characters) and _ (matches exactly one single character).',
    keyPoints: [
      "% matches 0 or more characters: 'S%' starts with S, '%S' ends with S, '%OR%' contains OR anywhere.",
      "_ matches exactly 1 character: '_L%' has L in 2nd position, '__R%' has R in 3rd position.",
      "Exact length check: '_____' (5 underscores) matches strings with exactly 5 characters.",
      "Minimum length check: '_____%' (5 underscores + %) matches strings with at least 5 characters.",
      "Last-but-one character: '%E_' matches names whose 2nd-to-last letter is E (ALLEN, JONES, TURNER, JAMES, MILLER).",
    ],
    examples: [
      {
        title: 'Employees with "L" as 2nd Character',
        query: "SELECT empno, ename, job, sal FROM emp WHERE ename LIKE '_L%';",
        explanation: 'First underscore consumes 1 character; L must be 2nd; % matches the rest.',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
          rows: [
            [7499, 'ALLEN', 'SALESMAN', 1600],
            [7698, 'BLAKE', 'MANAGER', 2850],
            [7782, 'CLARK', 'MANAGER', 2450],
          ],
        },
      },
      {
        title: 'Employees Having At Least 2 Ls',
        query: "SELECT empno, ename, job, sal FROM emp WHERE ename LIKE '%L%L%';",
        explanation: 'Matches any name containing two L characters anywhere (consecutive or apart).',
        result: {
          columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
          rows: [
            [7499, 'ALLEN', 'SALESMAN', 1600],
            [7934, 'MILLER', 'CLERK', 1300],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you find names with at least 5 characters using LIKE?',
        answer: "Use 5 underscores followed by %: WHERE ename LIKE '_____%'. (Or LENGTH(ename) >= 5).",
      },
      {
        question: 'How do you match names having "R" in the 3rd position?',
        answer: "Use two underscores before R%: WHERE ename LIKE '__R%'.",
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t13',
    number: 13,
    moduleId: 1,
    chapterId: 'ch3',
    chapterTitle: 'CH 3: SPECIAL OPERATORS & SORTING',
    title: 'ORDER BY: ASC/DESC, Multiple Columns & Position',
    shortTitle: 'ORDER BY: Multi-Col & Position',
    summary: 'Sorting query output by columns, calculated expressions, or column position numbers.',
    intro:
      'ORDER BY sorts the final query result set. By default it sorts ascending (ASC); add DESC for descending. It must always appear as the very last clause in a SELECT query.',
    keyPoints: [
      'Default sort order is ASC (smallest to largest / A to Z).',
      'Multi-column sorting: ORDER BY deptno ASC, sal DESC sorts by deptno first, then breaks ties by highest salary.',
      'Sorting by expression or alias: ORDER BY price * 1.1 or ORDER BY discounted_price.',
      'Sorting by column position: ORDER BY 2 DESC sorts by the 2nd column listed in the SELECT clause.',
    ],
    examples: [
      {
        title: 'Sorting by Column Position (2nd Column DESC)',
        query: 'SELECT ename, sal, job, empno FROM emp ORDER BY 2 DESC;',
        explanation: 'Position 2 refers to SAL, sorting employees from highest paid (KING) to lowest (SMITH).',
        result: {
          columns: ['ENAME', 'SAL', 'JOB', 'EMPNO'],
          rows: [
            ['KING', 5000, 'PRESIDENT', 7839],
            ['FORD', 3000, 'ANALYST', 7902],
            ['SCOTT', 3000, 'ANALYST', 7788],
            ['JONES', 2975, 'MANAGER', 7566],
            ['SMITH', 800, 'CLERK', 7369],
          ],
          caption: 'Top 4 & bottom 1 of 14 sorted rows',
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Can you sort by a column alias defined in the SELECT list?',
        answer:
          'Yes! Because ORDER BY executes after SELECT in SQL’s logical execution order, column aliases (and column position numbers like ORDER BY 2 DESC) are valid in ORDER BY—unlike WHERE.',
      },
    ],
  },
  {
    id: 'm1-t14',
    number: 14,
    moduleId: 1,
    chapterId: 'ch3',
    chapterTitle: 'CH 3: SPECIAL OPERATORS & SORTING',
    title: 'ORDER BY NULLS FIRST / LAST & Query Execution Order',
    shortTitle: 'NULL Sorting & Execution Order',
    summary: 'How databases sort NULLs in ASC vs DESC and the true SQL logical execution order.',
    intro:
      'Every SQL developer should know two subtle facts: how NULLs behave during sorting across dialects, and why WHERE cannot see SELECT aliases while ORDER BY can.',
    keyPoints: [
      'NULL sorting defaults differ: Oracle & PostgreSQL treat NULL as largest (NULLs appear last in ASC, first in DESC); MySQL & SQL Server treat NULL as smallest.',
      'Explicit control: Use NULLS FIRST or NULLS LAST (e.g., ORDER BY comm DESC NULLS LAST) in Oracle/PostgreSQL.',
      'Logical SQL Execution Order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.',
    ],
    examples: [
      {
        title: 'Keeping Non-NULL Commissions at the Top',
        query: 'SELECT ename, sal, comm FROM emp ORDER BY comm DESC NULLS LAST;',
        explanation: 'Ensures employees with actual commissions appear before NULL commission rows.',
        result: {
          columns: ['ENAME', 'SAL', 'COMM'],
          rows: [
            ['MARTIN', 1250, 1400],
            ['WARD', 1250, 500],
            ['ALLEN', 1600, 300],
            ['TURNER', 1500, 0],
            ['SMITH', 800, null],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the logical execution order of a SQL SELECT statement?',
        answer:
          'FROM (and JOINs) -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT/OFFSET.',
        tip: 'This explains why aliases defined in SELECT work in ORDER BY but fail in WHERE.',
      },
    ],
    isInterviewFavorite: true,
  },
  {
    id: 'm1-t15',
    number: 15,
    moduleId: 1,
    chapterId: 'ch3',
    chapterTitle: 'CH 3: SPECIAL OPERATORS & SORTING',
    title: 'Module 1 Live Lab: Filtering & Sorting EMP/DEPT',
    shortTitle: 'Module 1 Interactive SQL Lab',
    summary: 'Test your Module 1 query skills interactively against the 14-row EMP and 4-row DEPT tables.',
    intro:
      'Practice combining SELECT, WHERE, LIKE, IN, BETWEEN, IS NULL, and ORDER BY on the classic EMP and DEPT tables right here before moving on to Grouping and Joins.',
    keyPoints: [
      'Test filtering by department, salary bands, pattern matching, and NULL commissions.',
      'Inspect real output rows and verify your understanding of operator precedence.',
    ],
    examples: [
      {
        title: 'Managers in Dept 10 or 30 Sorted by Salary',
        query: "SELECT empno, ename, sal, deptno FROM emp WHERE job = 'MANAGER' AND deptno IN (10, 30) ORDER BY sal DESC;",
        explanation: 'Combines equality, IN list, AND logic, and descending sort.',
        result: {
          columns: ['EMPNO', 'ENAME', 'SAL', 'DEPTNO'],
          rows: [
            [7698, 'BLAKE', 2850, 30],
            [7782, 'CLARK', 2450, 10],
          ],
        },
      },
    ],
    interviewQuestions: [
      {
        question: 'Write a query to list employees whose salary is NOT between 1000 and 2000 in dept 10, 20, 30, excluding all SALESMANs.',
        answer:
          "SELECT * FROM emp WHERE sal NOT BETWEEN 1000 AND 2000 AND deptno IN (10, 20, 30) AND job <> 'SALESMAN';",
      },
    ],
    interactiveDemo: 'emp-sandbox',
  },
];
