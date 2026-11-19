import React, { useState } from 'react';
import { ALL_TOPICS } from '../data/curriculum';
import { Topic } from '../types/sqlCurriculum';
import { InteractiveVisualLab } from './InteractiveVisuals';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';

interface TopicDetailViewProps {
  topic: Topic;
  isCompleted: boolean;
  onToggleComplete: (topicId: string) => void;
  onBackToGrid: () => void;
  onNavigateTopic: (topicId: string) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  isCompleted,
  onToggleComplete,
  onBackToGrid,
  onNavigateTopic,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openQuestionIdx, setOpenQuestionIdx] = useState<number | null>(0);

  const currentIdx = ALL_TOPICS.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIdx > 0 ? ALL_TOPICS[currentIdx - 1] : null;
  const nextTopic = currentIdx < ALL_TOPICS.length - 1 ? ALL_TOPICS[currentIdx + 1] : null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Topics Grid
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline">/</span>
          <span className="text-xs font-medium text-sky-700 truncate max-w-[260px] hidden sm:inline">
            {topic.chapterTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onToggleComplete(topic.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
              : 'bg-white text-slate-800 border border-slate-300 hover:border-emerald-600 hover:text-emerald-800'
          }`}
        >
          <Check className="w-4 h-4" />
          {isCompleted ? 'Completed' : 'Mark Topic Done'}
        </button>
      </div>

      {/* Topic Header & Plain-English Intro */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-mono tabular-nums font-semibold text-emerald-700">
            Topic {String(topic.number).padStart(2, '0')} of {ALL_TOPICS.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>Module {topic.moduleId}</span>
          {topic.isInterviewFavorite && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-sky-700">High-Frequency Interview Topic</span>
            </>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-balance leading-tight">
          {topic.title}
        </h1>

        <p className="text-[15px] text-slate-700 leading-relaxed max-w-3xl">
          {topic.intro}
        </p>

        {/* Key Takeaways */}
        <div className="pt-3 border-t border-slate-100">
          <h2 className="text-xs font-semibold tracking-wider text-slate-500 mb-3">
            KEY RULES TO REMEMBER
          </h2>
          <ul className="space-y-2">
            {topic.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded bg-sky-50 text-sky-700 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Interactive Visual Lab if assigned */}
      {topic.interactiveDemo && (
        <InteractiveVisualLab type={topic.interactiveDemo} />
      )}

      {/* Standard Syntax Card */}
      {topic.syntax && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wider text-slate-700">
              SYNTAX REFERENCE
            </h2>
            <button
              type="button"
              onClick={() => handleCopy('syntax', topic.syntax!)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedKey === 'syntax' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
            {topic.syntax}
          </pre>
        </section>
      )}

      {/* Query Examples & Result Tables */}
      {topic.examples.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-slate-500 px-1">
            REAL SQL EXAMPLES & OUTPUT
          </h2>
          {topic.examples.map((ex, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{ex.title}</h3>
                <button
                  type="button"
                  onClick={() => handleCopy(`ex-${idx}`, ex.query)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedKey === `ex-${idx}` ? 'Copied' : 'Copy SQL'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                {ex.query}
              </pre>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">{ex.explanation}</p>

                {ex.result && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            {ex.result.columns.map((col) => (
                              <th key={col} className="px-3 py-2 font-mono font-semibold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                          {ex.result.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/70">
                              {row.map((val, cIdx) => (
                                <td key={cIdx} className="px-3 py-1.5 text-slate-800 whitespace-nowrap">
                                  {val === null ? (
                                    <span className="text-slate-400">NULL</span>
                                  ) : (
                                    String(val)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {ex.result.caption && (
                      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
                        {ex.result.caption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Comparison Matrix */}
      {topic.comparison && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70">
            <h2 className="text-sm font-semibold text-slate-900">{topic.comparison.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  {topic.comparison.headers.map((h) => (
                    <th key={h} className="px-4 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topic.comparison.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/60">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-4 py-2.5 leading-relaxed ${
                          cIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Interview Q&A Flashcards */}
      {topic.interviewQuestions.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Interview Q&A Check
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {topic.interviewQuestions.length}{' '}
              {topic.interviewQuestions.length === 1 ? 'question' : 'questions'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {topic.interviewQuestions.map((iq, idx) => {
              const isOpen = openQuestionIdx === idx;
              return (
                <div key={idx} className="p-4">
                  <button
                    type="button"
                    onClick={() => setOpenQuestionIdx(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-900 leading-snug">
                      Q{idx + 1}. {iq.question}
                    </span>
                    <span className="text-slate-400 shrink-0 mt-0.5">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-sm text-slate-700 leading-relaxed">{iq.answer}</p>
                      {iq.tip && (
                        <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                          <strong>Interview Tip:</strong> {iq.tip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Previous / Next Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {prevTopic ? (
          <button
            type="button"
            onClick={() => onNavigateTopic(prevTopic.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-sky-400 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="truncate max-w-[220px]">
              {prevTopic.number}. {prevTopic.shortTitle}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextTopic && (
          <button
            type="button"
            onClick={() => onNavigateTopic(nextTopic.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[220px]">
              Next: {nextTopic.number}. {nextTopic.shortTitle}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
