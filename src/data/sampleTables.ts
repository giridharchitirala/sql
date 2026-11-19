export interface EmpRow {
  empno: number;
  ename: string;
  job: string;
  mgr: number | null;
  hiredate: string;
  sal: number;
  comm: number | null;
  deptno: number;
}

export interface DeptRow {
  deptno: number;
  dname: string;
  loc: string;
}

export const DEPT_DATA: DeptRow[] = [
  { deptno: 10, dname: 'ACCOUNTING', loc: 'NEW YORK' },
  { deptno: 20, dname: 'RESEARCH', loc: 'DALLAS' },
  { deptno: 30, dname: 'SALES', loc: 'CHICAGO' },
  { deptno: 40, dname: 'OPERATIONS', loc: 'BOSTON' },
];

export const EMP_DATA: EmpRow[] = [
  { empno: 7369, ename: 'SMITH', job: 'CLERK', mgr: 7902, hiredate: '17-DEC-80', sal: 800, comm: null, deptno: 20 },
  { empno: 7499, ename: 'ALLEN', job: 'SALESMAN', mgr: 7698, hiredate: '20-FEB-81', sal: 1600, comm: 300, deptno: 30 },
  { empno: 7521, ename: 'WARD', job: 'SALESMAN', mgr: 7698, hiredate: '22-FEB-81', sal: 1250, comm: 500, deptno: 30 },
  { empno: 7566, ename: 'JONES', job: 'MANAGER', mgr: 7839, hiredate: '02-APR-81', sal: 2975, comm: null, deptno: 20 },
  { empno: 7654, ename: 'MARTIN', job: 'SALESMAN', mgr: 7698, hiredate: '28-SEP-81', sal: 1250, comm: 1400, deptno: 30 },
  { empno: 7698, ename: 'BLAKE', job: 'MANAGER', mgr: 7839, hiredate: '01-MAY-81', sal: 2850, comm: null, deptno: 30 },
  { empno: 7782, ename: 'CLARK', job: 'MANAGER', mgr: 7839, hiredate: '09-JUN-81', sal: 2450, comm: null, deptno: 10 },
  { empno: 7788, ename: 'SCOTT', job: 'ANALYST', mgr: 7566, hiredate: '19-APR-87', sal: 3000, comm: null, deptno: 20 },
  { empno: 7839, ename: 'KING', job: 'PRESIDENT', mgr: null, hiredate: '17-NOV-81', sal: 5000, comm: null, deptno: 10 },
  { empno: 7844, ename: 'TURNER', job: 'SALESMAN', mgr: 7698, hiredate: '08-SEP-81', sal: 1500, comm: 0, deptno: 30 },
  { empno: 7876, ename: 'ADAMS', job: 'CLERK', mgr: 7788, hiredate: '23-MAY-87', sal: 1100, comm: null, deptno: 20 },
  { empno: 7900, ename: 'JAMES', job: 'CLERK', mgr: 7698, hiredate: '03-DEC-81', sal: 950, comm: null, deptno: 30 },
  { empno: 7902, ename: 'FORD', job: 'ANALYST', mgr: 7566, hiredate: '03-DEC-81', sal: 3000, comm: null, deptno: 20 },
  { empno: 7934, ename: 'MILLER', job: 'CLERK', mgr: 7782, hiredate: '23-JAN-82', sal: 1300, comm: null, deptno: 10 },
];

export const JOIN_CUSTOMERS = [
  { customerId: 1, customerName: 'Alice' },
  { customerId: 2, customerName: 'Bob' },
  { customerId: 3, customerName: 'Carol' },
  { customerId: 4, customerName: 'David' },
];

export const JOIN_ORDERS = [
  { orderId: 101, customerId: 1, product: 'Laptop' },
  { orderId: 102, customerId: 3, product: 'Smartphone' },
  { orderId: 103, customerId: 2, product: 'Headphones' },
  { orderId: 104, customerId: 9, product: 'Monitor' },
];
