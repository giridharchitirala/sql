import React, { useMemo, useState } from 'react';
import {
  TOP_100_CATEGORIES,
  TOP_100_QUESTIONS,
  Top100Category,
} from '../data/top100Questions';
import { ArrowLeft, ArrowRight, Check, Copy, Search, X } from 'lucide-react';

interface Top100InterviewViewProps {
  reviewedIds: Set<string>;
  onToggleReviewed: (questionId: string, e?: React.MouseEvent) => void;
  onBackToGrid: () => void;
}

export const Top100InterviewView: React.FC<Top100InterviewViewProps> = ({
  reviewedIds,
  onToggleReviewed,
  onBackToGrid,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | Top100Category>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return TOP_100_QUESTIONS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.sql && item.sql.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, localSearch]);

  const activeQuestion = activeQuestionId
    ? TOP_100_QUESTIONS.find((q) => q.id === activeQuestionId) ?? null
    : null;

  const activeIdx = activeQuestion
    ? filteredQuestions.findIndex((q) => q.id === activeQuestion.id)
    : -1;
  const prevQuestion = activeIdx > 0 ? filteredQuestions[activeIdx - 1] : null;
  const nextQuestion =
    activeIdx >= 0 && activeIdx < filteredQuestions.length - 1
      ? filteredQuestions[activeIdx + 1]
      : null;

  const reviewedCount = reviewedIds.size;
  const totalCount = TOP_100_QUESTIONS.length;
  const reviewedPct = Math.round((reviewedCount / totalCount) * 100);

  const handleCopySql = (id: string, sql: string) => {
    navigator.clipboard?.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  /* Detail Answer Screen when a Question Button is clicked */
  if (activeQuestion) {
    const isReviewed = reviewedIds.has(activeQuestion.id);
    return (
      <div className="max-w-4xl mx-auto space-y-5 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveQuestionId(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Top 100 Questions
          </button>

          <button
            type="button"
            onClick={() => onToggleReviewed(activeQuestion.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isReviewed
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-white text-slate-800 border border-slate-300 hover:border-emerald-600 hover:text-emerald-800'
            }`}
          >
            <Check className="w-4 h-4" />
            {isReviewed ? 'Reviewed' : 'Mark Reviewed'}
          </button>
        </div>

        <article className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono tabular-nums font-semibold text-emerald-700">
              Question {String(activeQuestion.number).padStart(2, '0')} of {totalCount}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-sky-700">{activeQuestion.category}</span>
            <span aria-hidden="true">·</span>
            <span>{activeQuestion.level}</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 text-balance leading-snug">
            {activeQuestion.question}
          </h1>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-slate-500 mb-2">
                INTERVIEW ANSWER
              </h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                {activeQuestion.answer}
              </p>
            </div>

            {activeQuestion.sql && (
              <div className="rounded-lg overflow-hidden border border-slate-800">
                <div className="px-3.5 py-2 bg-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono">SQL Example</span>
                  <button
                    type="button"
                    onClick={() => handleCopySql(activeQuestion.id, activeQuestion.sql!)}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedId === activeQuestion.id ? 'Copied' : 'Copy SQL'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                  {activeQuestion.sql}
                </pre>
              </div>
            )}

            {activeQuestion.tip && (
              <div className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                <strong>Interview Tip:</strong> {activeQuestion.tip}
              </div>
            )}
          </div>
        </article>

        {/* Prev / Next Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {prevQuestion ? (
            <button
              type="button"
              onClick={() => setActiveQuestionId(prevQuestion.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-sky-400 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="truncate max-w-[240px]">
                Q{prevQuestion.number}. {prevQuestion.question}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextQuestion && (
            <button
              type="button"
              onClick={() => setActiveQuestionId(nextQuestion.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[240px]">
                Next: Q{nextQuestion.number}. {nextQuestion.question}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* Scrollable 4–5 Column Button Grid showing Full Questions Only */
  return (
    <div className="space-y-4 pb-6">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-xs font-bold tracking-wider text-sky-700">
              TOP 100 Q&A
            </span>
            <h1 className="text-[15px] font-semibold text-slate-900">
              Present & Trending SQL Interview Questions
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search questions..."
                aria-label="Search Top 100 SQL questions"
                className="w-48 sm:w-56 pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs font-mono tabular-nums text-slate-500">
              {filteredQuestions.length} questions ({reviewedCount} reviewed · {reviewedPct}%)
            </span>

            <button
              type="button"
              onClick={onBackToGrid}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Modules Grid
            </button>
          </div>
        </div>

        {/* Category Filter Strip */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300'
            }`}
          >
            All ({totalCount})
          </button>
          {TOP_100_CATEGORIES.map((cat) => {
            const count = TOP_100_QUESTIONS.filter((q) => q.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Grid of Pure Full-Question Buttons (4–5 columns on desktop) */}
        <div className="p-4 max-h-[calc(100vh-235px)] overflow-y-auto clean-scroll">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-900">No matching questions</p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search or selecting All categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredQuestions.map((item) => {
                const isReviewed = reviewedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveQuestionId(item.id)}
                    className={`min-h-[112px] p-4 rounded-xl border text-left flex items-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      isReviewed
                        ? 'bg-emerald-50/75 border-emerald-500 text-slate-900 hover:border-emerald-600'
                        : 'bg-white border-sky-200/80 text-slate-900 hover:border-sky-400 hover:bg-sky-50/20'
                    }`}
                  >
                    <span className="text-[13px] font-medium leading-snug">
                      {item.question}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
