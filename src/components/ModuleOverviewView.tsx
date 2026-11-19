import React from 'react';
import { MODULES, getTopicsByModule } from '../data/curriculum';
import { ArrowLeft, ArrowRight, BookOpen, Check } from 'lucide-react';

interface ModuleOverviewViewProps {
  moduleId: number;
  completedIds: Set<string>;
  onBackToGrid: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const ModuleOverviewView: React.FC<ModuleOverviewViewProps> = ({
  moduleId,
  completedIds,
  onBackToGrid,
  onSelectTopic,
}) => {
  const mod = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];
  const topics = getTopicsByModule(mod.id);
  const doneCount = topics.filter((t) => completedIds.has(t.id)).length;
  const pct = Math.round((doneCount / topics.length) * 100);
  const nextTopic = topics.find((t) => !completedIds.has(t.id)) ?? topics[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToGrid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Topics Grid
        </button>

        <span className="text-xs font-mono tabular-nums text-slate-500">
          Module {mod.id} Progress: {doneCount}/{topics.length} ({pct}%)
        </span>
      </div>

      {/* Intro Hero Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-bold tracking-wider text-sky-700">
            {mod.label} · OVERVIEW & INTRO
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-balance">{mod.title}</h1>
          <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl">
            {mod.overviewIntro}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Module Completion</span>
            <span className="font-mono tabular-nums font-semibold text-emerald-700">
              {pct}% Complete
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Learning Goals */}
        <div className="pt-2 border-t border-slate-100">
          <h2 className="text-xs font-semibold tracking-wider text-slate-500 mb-3">
            WHAT YOU WILL MASTER IN THIS MODULE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {mod.learningGoals.map((goal, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-sm text-slate-700"
              >
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {nextTopic && (
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTopic(nextTopic.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              {doneCount === 0
                ? `Start Topic ${nextTopic.number}: ${nextTopic.shortTitle}`
                : `Continue Topic ${nextTopic.number}: ${nextTopic.shortTitle}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Chapter Breakdown */}
      <div className="space-y-4">
        {mod.chapters.map((ch) => {
          const chTopics = topics.filter((t) => t.chapterId === ch.id);
          return (
            <div key={ch.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  <span className="text-sky-700 mr-2">{ch.label}:</span>
                  {ch.title}
                </h3>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {chTopics.filter((t) => completedIds.has(t.id)).length}/{chTopics.length} done
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {chTopics.map((topic) => {
                  const isDone = completedIds.has(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-start gap-3 ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-400 hover:border-emerald-600'
                          : 'bg-white border-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded font-mono text-xs tabular-nums flex items-center justify-center shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : topic.number}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 leading-snug">
                          {topic.shortTitle}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {topic.summary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
