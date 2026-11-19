import React, { useMemo, useState } from 'react';
import { DEPT_DATA, EMP_DATA, JOIN_CUSTOMERS, JOIN_ORDERS } from '../data/sampleTables';
import { InteractiveDemoType } from '../types/sqlCurriculum';
import { Play, RotateCcw } from 'lucide-react';

interface InteractiveVisualProps {
  type: InteractiveDemoType;
}

export const InteractiveVisualLab: React.FC<InteractiveVisualProps> = ({ type }) => {
  switch (type) {
    case 'char-varchar':
      return <CharVarcharVisualizer />;
    case 'joins':
      return <JoinVisualizer />;
    case 'nth-salary':
      return <NthSalaryStepper />;
    case 'normalization':
      return <NormalizationStepper />;
    case 'emp-sandbox':
      return <EmpDeptSandbox />;
    default:
      return null;
  }
};

/* 1. CHAR(6) vs VARCHAR(6) Memory Visualizer */
const CharVarcharVisualizer: React.FC = () => {
  const [inputValue, setInputValue] = useState('TOM');
  const maxLen = 6;
  const cleanText = inputValue.slice(0, maxLen);
  const chars = Array.from({ length: maxLen }, (_, idx) => cleanText[idx] ?? null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Interactive Memory Lab: CHAR(6) vs VARCHAR(6)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Type up to 6 characters to compare fixed blank padding against variable reusable memory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="char-demo-input" className="text-xs font-medium text-slate-600">
            String Value:
          </label>
          <input
            id="char-demo-input"
            type="text"
            maxLength={6}
            value={cleanText}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="TOM"
            className="w-28 px-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CHAR(6) */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-slate-800">name CHAR(6)</span>
            <span className="font-mono tabular-nums text-amber-700 font-medium">
              Allocated: 6 bytes · LENGTH = {cleanText.length > 0 ? 6 : 0}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {chars.map((ch, i) => (
              <div
                key={i}
                className={`h-11 rounded-md border flex flex-col items-center justify-center font-mono text-sm ${
                  ch !== null
                    ? 'bg-white border-sky-300 text-slate-900 font-semibold'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span>{ch !== null ? ch : '_'}</span>
                <span className="text-[10px] leading-none opacity-75">
                  {ch !== null ? 'used' : 'pad'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600">
            Unused slots are filled with blank spaces and remain reserved (non-reusable).
          </p>
        </div>

        {/* VARCHAR(6) */}
        <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-slate-800">name VARCHAR(6)</span>
            <span className="font-mono tabular-nums text-emerald-700 font-medium">
              Used: {cleanText.length} bytes · LENGTH = {cleanText.length}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {chars.map((ch, i) => (
              <div
                key={i}
                className={`h-11 rounded-md border flex flex-col items-center justify-center font-mono text-sm ${
                  ch !== null
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                    : 'bg-white border-dashed border-slate-300 text-slate-400'
                }`}
              >
                <span>{ch !== null ? ch : 'NULL'}</span>
                <span className="text-[10px] leading-none opacity-75">
                  {ch !== null ? 'used' : 'free'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600">
            Remaining slots stay NULL and occupy zero storage—memory stays reusable.
          </p>
        </div>
      </div>
    </div>
  );
};

/* 2. Interactive SQL JOIN Visualizer */
type JoinKind = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';

const JoinVisualizer: React.FC = () => {
  const [joinType, setJoinType] = useState<JoinKind>('INNER');

  const joinRows = useMemo(() => {
    const rows: {
      customerId: number | null;
      customerName: string | null;
      orderId: number | null;
      product: string | null;
      status: 'matched' | 'left-only' | 'right-only' | 'cartesian';
    }[] = [];

    if (joinType === 'CROSS') {
      for (const c of JOIN_CUSTOMERS) {
        for (const o of JOIN_ORDERS) {
          rows.push({
            customerId: c.customerId,
            customerName: c.customerName,
            orderId: o.orderId,
            product: o.product,
            status: 'cartesian',
          });
        }
      }
      return rows;
    }

    const matchedOrderIds = new Set<number>();

    for (const c of JOIN_CUSTOMERS) {
      const matchingOrders = JOIN_ORDERS.filter((o) => o.customerId === c.customerId);
      if (matchingOrders.length > 0) {
        for (const o of matchingOrders) {
          matchedOrderIds.add(o.orderId);
          rows.push({
            customerId: c.customerId,
            customerName: c.customerName,
            orderId: o.orderId,
            product: o.product,
            status: 'matched',
          });
        }
      } else if (joinType === 'LEFT' || joinType === 'FULL') {
        rows.push({
          customerId: c.customerId,
          customerName: c.customerName,
          orderId: null,
          product: null,
          status: 'left-only',
        });
      }
    }

    if (joinType === 'RIGHT' || joinType === 'FULL') {
      for (const o of JOIN_ORDERS) {
        if (!matchedOrderIds.has(o.orderId)) {
          rows.push({
            customerId: o.customerId,
            customerName: null,
            orderId: o.orderId,
            product: o.product,
            status: 'right-only',
          });
        }
      }
    }

    return rows;
  }, [joinType]);

  const joinOptions: { id: JoinKind; label: string }[] = [
    { id: 'INNER', label: 'INNER JOIN' },
    { id: 'LEFT', label: 'LEFT JOIN' },
    { id: 'RIGHT', label: 'RIGHT JOIN' },
    { id: 'FULL', label: 'FULL OUTER' },
    { id: 'CROSS', label: 'CROSS JOIN' },
  ];

  const sqlPreview =
    joinType === 'CROSS'
      ? 'SELECT c.CustomerName, o.Product FROM Customers c CROSS JOIN Orders o;'
      : `SELECT c.CustomerName, o.OrderID, o.Product\nFROM Customers c ${
          joinType === 'FULL' ? 'FULL OUTER' : joinType
        } JOIN Orders o ON c.CustomerID = o.CustomerID;`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Interactive Join Explorer (Customers × Orders)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch join types to inspect which rows match and where NULL padding appears.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {joinOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setJoinType(opt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                joinType === opt.id
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
        {sqlPreview}
      </pre>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5 space-y-3">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              Customers (Left · 4 rows)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-1.5 font-medium">CustomerID</th>
                  <th className="px-3 py-1.5 font-medium">CustomerName</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {JOIN_CUSTOMERS.map((c) => (
                  <tr key={c.customerId} className={c.customerId === 4 ? 'bg-amber-50/60' : ''}>
                    <td className="px-3 py-1.5">{c.customerId}</td>
                    <td className="px-3 py-1.5 font-sans">
                      {c.customerName}{' '}
                      {c.customerId === 4 && (
                        <span className="text-[11px] text-amber-700">(no order)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              Orders (Right · 4 rows)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-1.5 font-medium">OrderID</th>
                  <th className="px-3 py-1.5 font-medium">CustomerID</th>
                  <th className="px-3 py-1.5 font-medium">Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {JOIN_ORDERS.map((o) => (
                  <tr key={o.orderId} className={o.customerId === 9 ? 'bg-amber-50/60' : ''}>
                    <td className="px-3 py-1.5">{o.orderId}</td>
                    <td className="px-3 py-1.5">{o.customerId}</td>
                    <td className="px-3 py-1.5 font-sans">
                      {o.product}{' '}
                      {o.customerId === 9 && (
                        <span className="text-[11px] text-amber-700">(no customer)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-7 border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Result Set</span>
            <span className="font-mono tabular-nums text-emerald-700">
              {joinRows.length} rows returned
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto clean-scroll">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 font-medium">CustomerName</th>
                  <th className="px-3 py-2 font-medium">OrderID</th>
                  <th className="px-3 py-2 font-medium">Product</th>
                  <th className="px-3 py-2 font-medium">Match Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {joinRows.map((r, idx) => (
                  <tr
                    key={idx}
                    className={
                      r.status === 'matched'
                        ? 'bg-emerald-50/35'
                        : r.status === 'cartesian'
                        ? 'bg-white'
                        : 'bg-amber-50/50'
                    }
                  >
                    <td className="px-3 py-1.5 font-medium text-slate-800">
                      {r.customerName ?? <span className="font-mono text-slate-400">NULL</span>}
                    </td>
                    <td className="px-3 py-1.5 font-mono tabular-nums text-slate-700">
                      {r.orderId ?? <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-700">
                      {r.product ?? <span className="font-mono text-slate-400">NULL</span>}
                    </td>
                    <td className="px-3 py-1.5 text-[11px] font-medium">
                      {r.status === 'matched' && <span className="text-emerald-700">Matched</span>}
                      {r.status === 'left-only' && (
                        <span className="text-amber-700">Unmatched Left (NULL right)</span>
                      )}
                      {r.status === 'right-only' && (
                        <span className="text-amber-700">Unmatched Right (NULL left)</span>
                      )}
                      {r.status === 'cartesian' && (
                        <span className="text-slate-500">Cartesian Pair</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 3. Correlated Subquery Nth Salary Step-by-Step Tracer */
const SAMPLE_SALARY_SET = [
  { empno: 101, ename: 'Scott', sal: 3000 },
  { empno: 102, ename: 'Blake', sal: 4000 },
  { empno: 103, ename: 'King', sal: 5000 },
  { empno: 104, ename: 'Smith', sal: 2000 },
  { empno: 105, ename: 'Jones', sal: 1000 },
];

const NthSalaryStepper: React.FC = () => {
  const [nth, setNth] = useState(2);
  const targetCount = nth - 1;

  const traceRows = SAMPLE_SALARY_SET.map((row) => {
    const higherDistinct = Array.from(
      new Set(SAMPLE_SALARY_SET.filter((b) => b.sal > row.sal).map((b) => b.sal))
    );
    const matches = higherDistinct.length === targetCount;
    return {
      ...row,
      higherDistinct,
      count: higherDistinct.length,
      matches,
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Interactive Correlated Subquery Trace (n − 1 Formula)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Select which Nth highest salary to find and watch how the inner query counts strictly higher salaries for every outer row.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Find Nth Max:</span>
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setNth(val)}
              className={`w-9 h-9 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                nth === val
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
{`SELECT * FROM emp A
WHERE ${targetCount} = (
  SELECT COUNT(DISTINCT B.sal) FROM emp B WHERE A.sal < B.sal
);`}
      </pre>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 font-medium">Outer Row (A)</th>
              <th className="px-3 py-2 font-medium">A.sal</th>
              <th className="px-3 py-2 font-medium">Distinct B.sal &gt; A.sal</th>
              <th className="px-3 py-2 font-medium">Inner COUNT</th>
              <th className="px-3 py-2 font-medium">Condition ({targetCount} = COUNT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 tabular-nums">
            {traceRows.map((r) => (
              <tr key={r.empno} className={r.matches ? 'bg-emerald-50/75' : 'bg-white'}>
                <td className="px-3 py-2 font-medium text-slate-900">
                  {r.empno} · {r.ename}
                </td>
                <td className="px-3 py-2 font-mono">{r.sal}</td>
                <td className="px-3 py-2 font-mono text-slate-600">
                  {r.higherDistinct.length > 0 ? r.higherDistinct.join(', ') : 'None'}
                </td>
                <td className="px-3 py-2 font-mono font-semibold">{r.count}</td>
                <td className="px-3 py-2 font-medium">
                  {r.matches ? (
                    <span className="text-emerald-700">
                      {targetCount} = {r.count} → SELECTED
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {targetCount} != {r.count} (Rejected)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 4. Normalization 1NF -> 2NF -> 3NF Stepper */
const NormalizationStepper: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Interactive Normalization Stepper (College Schema)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Step through 1NF, 2NF, and 3NF to see how a single redundant table splits cleanly.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s as 1 | 2 | 3)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                step === s
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {s}NF
            </button>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>1NF (First Normal Form):</strong> All required attributes are placed into one table with atomic values and no duplicate rows. Probable Primary Keys identified: <code className="font-mono bg-slate-100 px-1 rounded">RegNo</code> & <code className="font-mono bg-slate-100 px-1 rounded">BookNo</code>. Still suffers from redundancy!
          </p>
          <div className="max-w-xs border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold">COLLEGE (1 Table)</div>
            <ul className="divide-y divide-slate-100 text-xs font-mono">
              {['RegNo (PK)', 'Sname', 'Semester', 'DOB', 'MailID', 'Phone', 'BookNo (PK)', 'Bname', 'Author', 'DOI', 'DOR', 'Fine'].map((col) => (
                <li key={col} className="px-3 py-1.5 text-slate-700">{col}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>2NF (Second Normal Form):</strong> Must already be in 1NF. Student attributes depend only on <code className="font-mono bg-slate-100 px-1 rounded">RegNo</code>, so we split <strong>STUDENTS</strong> away from <strong>BOOKS</strong> and link them via Foreign Key.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="border border-emerald-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-emerald-700 text-white text-xs font-semibold">STUDENTS</div>
              <ul className="divide-y divide-slate-100 text-xs font-mono">
                {['RegNo (PK)', 'Sname', 'Semester', 'DOB', 'MailID', 'Phone'].map((c) => (
                  <li key={c} className="px-3 py-1.5 text-slate-700">{c}</li>
                ))}
              </ul>
            </div>
            <div className="border border-sky-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-sky-700 text-white text-xs font-semibold">BOOKS (Still mixed with Issue dates)</div>
              <ul className="divide-y divide-slate-100 text-xs font-mono">
                {['BookNo (PK)', 'RegNo (FK)', 'Bname', 'Author', 'DOI', 'DOR', 'Fine'].map((c) => (
                  <li key={c} className="px-3 py-1.5 text-slate-700">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>3NF (Third Normal Form):</strong> Issue transactions (<code className="font-mono bg-slate-100 px-1 rounded">DOI</code>, <code className="font-mono bg-slate-100 px-1 rounded">DOR</code>, <code className="font-mono bg-slate-100 px-1 rounded">Fine</code>) are isolated into a dedicated <strong>LIBRARY</strong> junction table—completely eliminating redundancy and anomalies!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-emerald-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-emerald-700 text-white text-xs font-semibold">STUDENTS</div>
              <ul className="divide-y divide-slate-100 text-xs font-mono">
                {['RegNo (PK)', 'Sname', 'Semester', 'DOB', 'MailID', 'Phone'].map((c) => (
                  <li key={c} className="px-3 py-1.5 text-slate-700">{c}</li>
                ))}
              </ul>
            </div>
            <div className="border border-sky-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-sky-700 text-white text-xs font-semibold">BOOKS</div>
              <ul className="divide-y divide-slate-100 text-xs font-mono">
                {['BookNo (PK)', 'Bname', 'Author'].map((c) => (
                  <li key={c} className="px-3 py-1.5 text-slate-700">{c}</li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold">LIBRARY (Transactions)</div>
              <ul className="divide-y divide-slate-100 text-xs font-mono">
                {['BookNo (FK)', 'RegNo (FK)', 'DOI', 'DOR', 'Fine'].map((c) => (
                  <li key={c} className="px-3 py-1.5 text-slate-700">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* 5. Live Interactive EMP & DEPT Practice Sandbox */
interface SandboxPreset {
  id: string;
  label: string;
  sql: string;
  columns: string[];
  run: () => (string | number | null)[][];
}

const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: 'all-emp',
    label: 'All Employees (14)',
    sql: 'SELECT empno, ename, job, mgr, sal, comm, deptno FROM emp;',
    columns: ['EMPNO', 'ENAME', 'JOB', 'MGR', 'SAL', 'COMM', 'DEPTNO'],
    run: () => EMP_DATA.map((e) => [e.empno, e.ename, e.job, e.mgr, e.sal, e.comm, e.deptno]),
  },
  {
    id: 'like-2nd-l',
    label: "Name 2nd char 'L'",
    sql: "SELECT empno, ename, job, sal FROM emp WHERE ename LIKE '_L%';",
    columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
    run: () =>
      EMP_DATA.filter((e) => e.ename[1] === 'L').map((e) => [e.empno, e.ename, e.job, e.sal]),
  },
  {
    id: 'no-mgr',
    label: 'No Manager (IS NULL)',
    sql: 'SELECT empno, ename, job, sal FROM emp WHERE mgr IS NULL;',
    columns: ['EMPNO', 'ENAME', 'JOB', 'SAL'],
    run: () => EMP_DATA.filter((e) => e.mgr === null).map((e) => [e.empno, e.ename, e.job, e.sal]),
  },
  {
    id: 'dept-group',
    label: 'Dept Salary & Count',
    sql: 'SELECT deptno, COUNT(*) AS cnt, SUM(sal) AS total_sal FROM emp GROUP BY deptno ORDER BY deptno;',
    columns: ['DEPTNO', 'CNT', 'TOTAL_SAL'],
    run: () => {
      const map = new Map<number, { cnt: number; sum: number }>();
      for (const e of EMP_DATA) {
        const cur = map.get(e.deptno) ?? { cnt: 0, sum: 0 };
        map.set(e.deptno, { cnt: cur.cnt + 1, sum: cur.sum + e.sal });
      }
      return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([deptno, v]) => [deptno, v.cnt, v.sum]);
    },
  },
  {
    id: 'self-join',
    label: 'Employee & Manager',
    sql: 'SELECT e.ename AS employee, m.ename AS manager FROM emp e LEFT JOIN emp m ON e.mgr = m.empno;',
    columns: ['EMPLOYEE', 'MANAGER'],
    run: () =>
      EMP_DATA.map((e) => {
        const mgr = EMP_DATA.find((m) => m.empno === e.mgr);
        return [e.ename, mgr ? mgr.ename : null];
      }),
  },
  {
    id: 'empty-dept',
    label: 'Empty Dept (LEFT JOIN)',
    sql: 'SELECT d.deptno, d.dname, d.loc FROM dept d LEFT JOIN emp e ON d.deptno = e.deptno WHERE e.empno IS NULL;',
    columns: ['DEPTNO', 'DNAME', 'LOC'],
    run: () =>
      DEPT_DATA.filter((d) => !EMP_DATA.some((e) => e.deptno === d.deptno)).map((d) => [
        d.deptno,
        d.dname,
        d.loc,
      ]),
  },
];

const EmpDeptSandbox: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SANDBOX_PRESETS[0].id);
  const [jobFilter, setJobFilter] = useState<string>('ALL');

  const activePreset = SANDBOX_PRESETS.find((p) => p.id === selectedId) ?? SANDBOX_PRESETS[0];

  const rows = useMemo(() => {
    if (selectedId === 'all-emp' && jobFilter !== 'ALL') {
      return EMP_DATA.filter((e) => e.job === jobFilter).map((e) => [
        e.empno,
        e.ename,
        e.job,
        e.mgr,
        e.sal,
        e.comm,
        e.deptno,
      ]);
    }
    return activePreset.run();
  }, [activePreset, selectedId, jobFilter]);

  const activeSql =
    selectedId === 'all-emp' && jobFilter !== 'ALL'
      ? `SELECT empno, ename, job, mgr, sal, comm, deptno FROM emp WHERE job = '${jobFilter}';`
      : activePreset.sql;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Live EMP & DEPT Query Runner
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any classic interview query preset below to execute it against the 14-row EMP & 4-row DEPT tables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedId('all-emp');
            setJobFilter('ALL');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {SANDBOX_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setSelectedId(preset.id);
              if (preset.id !== 'all-emp') setJobFilter('ALL');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedId === preset.id
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
            }`}
          >
            <Play className="w-3 h-3" />
            {preset.label}
          </button>
        ))}
      </div>

      {selectedId === 'all-emp' && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">Quick WHERE job filter:</span>
          {['ALL', 'CLERK', 'SALESMAN', 'MANAGER', 'ANALYST', 'PRESIDENT'].map((job) => (
            <button
              key={job}
              type="button"
              onClick={() => setJobFilter(job)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                jobFilter === job
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {job}
            </button>
          ))}
        </div>
      )}

      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
        {activeSql}
      </pre>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Query Output</span>
          <span className="font-mono tabular-nums text-emerald-700">
            {rows.length} {rows.length === 1 ? 'row' : 'rows'} selected
          </span>
        </div>
        <div className="max-h-64 overflow-auto clean-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 sticky top-0">
              <tr>
                {activePreset.columns.map((col) => (
                  <th key={col} className="px-3 py-2 font-mono font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {rows.map((r, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70">
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 text-slate-800 whitespace-nowrap">
                      {cell === null ? (
                        <span className="text-slate-400">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
