import React from 'react';
import { MODULES } from '../data/curriculum';
import { Topic } from '../types/sqlCurriculum';
import { ArrowRight, Check } from 'lucide-react';

interface TopicGridViewProps {
  topics: Topic[];
  filterMode: 'all' | 'm1' | 'm2' | 'm3' | 'favorites';
  searchQuery: string;
  completedIds: Set<string>;
  onSelectTopic: (topicId: string) => void;
  onOpenModuleOverview: (moduleId: number) => void;
  onToggleComplete: (topicId: string, e: React.MouseEvent) => void;
}

export const TopicGridView: React.FC<TopicGridViewProps> = ({
  topics,
  filterMode,
  searchQuery,
  completedIds,
  onSelectTopic,
  onOpenModuleOverview,
  onToggleComplete,
}) => {
  const modulesToRender = MODULES.filter((mod) => {
    if (filterMode === 'm1') return mod.id === 1;
    if (filterMode === 'm2') return mod.id === 2;
    if (filterMode === 'm3') return mod.id === 3;
    return true;
  });

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const sections = modulesToRender
    .map((mod) => {
      const modTopics = topics.filter((t) => {
        if (t.moduleId !== mod.id) return false;
        if (filterMode === 'favorites' && !t.isInterviewFavorite) return false;
        if (!normalizedSearch) return true;
        return (
          t.title.toLowerCase().includes(normalizedSearch) ||
          t.shortTitle.toLowerCase().includes(normalizedSearch) ||
          t.summary.toLowerCase().includes(normalizedSearch) ||
          t.chapterTitle.toLowerCase().includes(normalizedSearch)
        );
      });
      return { module: mod, topics: modTopics };
    })
    .filter((s) => s.topics.length > 0);

  if (sections.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-lg mx-auto my-8">
        <h3 className="text-base font-semibold text-slate-900">No matching SQL topics</h3>
        <p className="text-sm text-slate-500 mt-1">
          Try clearing your search text or switching back to All Topics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {sections.map(({ module, topics: modTopics }) => {
        const doneInSection = modTopics.filter((t) => completedIds.has(t.id)).length;
        const pct = Math.round((doneInSection / modTopics.length) * 100);

        return (
          <section
            key={module.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            {/* Module Header Strip */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-2.5 min-w-0">
                <span className="text-xs font-bold tracking-wider text-sky-700 shrink-0">
                  {module.label}
                </span>
                <h2 className="text-[15px] font-semibold text-slate-900 truncate">
                  {module.title}
                </h2>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {modTopics.length} topics ({doneInSection} done)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenModuleOverview(module.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Module Overview
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Button Grid */}
            <div className="p-4 max-h-[540px] overflow-y-auto clean-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {modTopics.map((topic) => {
                  const isDone = completedIds.has(topic.id);
                  return (
                    <div
                      key={topic.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectTopic(topic.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectTopic(topic.id);
                        }
                      }}
                      className={`group relative min-h-[124px] p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                        isDone
                          ? 'bg-emerald-50/75 border-emerald-500 hover:border-emerald-600'
                          : 'bg-white border-sky-200/80 hover:border-sky-400 hover:bg-sky-50/20'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-mono tabular-nums font-medium ${
                              isDone ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            Topic {String(topic.number).padStart(2, '0')}
                          </span>
                          {topic.interactiveDemo && (
                            <span className="text-[11px] font-medium text-sky-700">
                              Interactive Lab
                            </span>
                          )}
                        </div>
                        <h3 className="text-[13.5px] font-semibold text-slate-900 leading-snug">
                          {topic.shortTitle}
                        </h3>
                      </div>

                      <div className="pt-3 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 truncate">
                          {topic.isInterviewFavorite ? 'High-Freq Interview' : 'Core Concept'}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => onToggleComplete(topic.id, e)}
                          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isDone ? 'Done' : 'Mark'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
