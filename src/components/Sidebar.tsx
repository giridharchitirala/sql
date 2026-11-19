import React from 'react';
import { MODULES, getTopicsByModule } from '../data/curriculum';
import { Topic } from '../types/sqlCurriculum';
import { Check, LayoutGrid, RotateCcw } from 'lucide-react';

interface SidebarProps {
  activeModuleId: number;
  selectedTopicId: string | null;
  viewingOverviewModuleId: number | null;
  viewingTop100: boolean;
  completedIds: Set<string>;
  reviewedQCount: number;
  onSelectModule: (moduleId: number) => void;
  onSelectTopic: (topicId: string) => void;
  onOpenModuleOverview: (moduleId: number) => void;
  onOpenTop100: () => void;
  onBackToGrid: () => void;
  onResetProgress: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModuleId,
  selectedTopicId,
  viewingOverviewModuleId,
  viewingTop100,
  completedIds,
  reviewedQCount,
  onSelectModule,
  onSelectTopic,
  onOpenModuleOverview,
  onOpenTop100,
  onBackToGrid,
  onResetProgress,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const activeModule = MODULES.find((m) => m.id === activeModuleId) ?? MODULES[0];
  const moduleTopics = getTopicsByModule(activeModuleId);
  const totalTopics = 45;
  const totalDone = completedIds.size;
  const activeModDone = moduleTopics.filter((t) => completedIds.has(t.id)).length;

  const groupedByChapter = activeModule.chapters.map((ch) => ({
    chapter: ch,
    topics: moduleTopics.filter((t) => t.chapterId === ch.id),
  }));

  const handleTopicClick = (topic: Topic) => {
    onSelectTopic(topic.id);
    onCloseMobile?.();
  };

  const handleOverviewClick = () => {
    onOpenModuleOverview(activeModuleId);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <aside className="w-[276px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      {/* Top Module Switcher */}
      <div className="p-3.5 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onBackToGrid();
              onCloseMobile?.();
            }}
            className="text-[11px] font-semibold tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            SQL & RDBMS MODULES
          </button>
          <span className="text-xs font-mono tabular-nums font-medium text-slate-500">
            {totalDone}/{totalTopics}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MODULES.map((mod) => {
            const modTopics = getTopicsByModule(mod.id);
            const modDone = modTopics.filter((t) => completedIds.has(t.id)).length;
            const isActive = mod.id === activeModuleId && !viewingTop100;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`px-2 py-2 rounded-lg border text-center transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-white border-sky-200 text-sky-700 hover:border-sky-400 hover:bg-sky-50/40'
                }`}
              >
                <div className="text-xs font-semibold leading-tight">{mod.shortName}</div>
                <div
                  className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                    isActive ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {modDone}/{modTopics.length}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            onOpenTop100();
            onCloseMobile?.();
          }}
          className={`w-full px-3 py-2 rounded-lg border flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
            viewingTop100
              ? 'bg-emerald-700 border-emerald-700 text-white'
              : 'bg-sky-50/50 border-sky-200 text-sky-800 hover:border-sky-400'
          }`}
        >
          <span>Top 100 Interview Q&A</span>
          <span
            className={`font-mono tabular-nums text-[11px] ${
              viewingTop100 ? 'text-emerald-100' : 'text-slate-500'
            }`}
          >
            {reviewedQCount}/100
          </span>
        </button>
      </div>

      {/* Scrollable Module Index */}
      <div className="flex-1 min-h-0 p-3 flex flex-col">
        <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-emerald-700">
                MODULE {activeModule.id} INDEX
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-500">
                {activeModDone}/{moduleTopics.length}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate" title={activeModule.title}>
              {activeModule.title}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto clean-scroll p-2 space-y-3">
            {/* Module Home button */}
            <button
              type="button"
              onClick={handleOverviewClick}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                viewingOverviewModuleId === activeModuleId
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono text-[11px] flex items-center justify-center shrink-0">
                0
              </span>
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Module {activeModule.id} Home</span>
            </button>

            {/* Chapter lists */}
            {groupedByChapter.map(({ chapter, topics }) => (
              <div key={chapter.id} className="space-y-1">
                <div className="px-2 pt-1 text-[10px] font-semibold tracking-wider text-sky-700 truncate">
                  {chapter.label}: {chapter.title}
                </div>
                <div className="space-y-0.5">
                  {topics.map((topic) => {
                    const isDone = completedIds.has(topic.id);
                    const isSelected = selectedTopicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleTopicClick(topic)}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200'
                            : isDone
                            ? 'bg-emerald-50/50 text-slate-800 hover:bg-emerald-50 border border-transparent'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded font-mono text-[11px] tabular-nums flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-emerald-700 text-white'
                              : isSelected
                              ? 'bg-sky-700 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3" /> : topic.number}
                        </span>
                        <span className="truncate flex-1">{topic.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-emerald-700 truncate">
          SQL Interview Prep
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {totalDone > 0 && (
            <button
              type="button"
              onClick={onResetProgress}
              title="Reset saved progress"
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {totalTopics} Topics
          </span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
