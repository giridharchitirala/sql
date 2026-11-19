import React, { useEffect, useState } from 'react';
import { ALL_TOPICS, getTopicsByModule } from './data/curriculum';
import { Sidebar } from './components/Sidebar';
import { TopicGridView } from './components/TopicGridView';
import { TopicDetailView } from './components/TopicDetailView';
import { ModuleOverviewView } from './components/ModuleOverviewView';
import { Top100InterviewView } from './components/Top100InterviewView';
import { Menu, Search, X } from 'lucide-react';

const STORAGE_KEY = 'sqlprep_completed_topics_v1';
const Q100_STORAGE_KEY = 'sqlprep_reviewed_q100_v1';

type FilterMode = 'all' | 'm1' | 'm2' | 'm3' | 'favorites';

export default function App() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return new Set();
  });

  const [reviewedQIds, setReviewedQIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(Q100_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return new Set();
  });

  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [viewingOverviewModuleId, setViewingOverviewModuleId] = useState<number | null>(null);
  const [viewingTop100, setViewingTop100] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
    } catch {
      // Ignore storage errors
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(Q100_STORAGE_KEY, JSON.stringify(Array.from(reviewedQIds)));
    } catch {
      // Ignore storage errors
    }
  }, [reviewedQIds]);

  const totalCount = ALL_TOPICS.length;
  const completedCount = completedIds.size;
  const completedPct = Math.round((completedCount / totalCount) * 100);
  const favoritesCount = ALL_TOPICS.filter((t) => t.isInterviewFavorite).length;
  const interactiveLabsCount = ALL_TOPICS.filter((t) => Boolean(t.interactiveDemo)).length;

  const selectedTopic = selectedTopicId
    ? ALL_TOPICS.find((t) => t.id === selectedTopicId) ?? null
    : null;

  const handleSelectModule = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setSelectedTopicId(null);
    setViewingOverviewModuleId(null);
    setViewingTop100(false);
    if (moduleId === 1) setFilterMode('m1');
    if (moduleId === 2) setFilterMode('m2');
    if (moduleId === 3) setFilterMode('m3');
  };

  const handleFilterClick = (mode: FilterMode) => {
    setFilterMode(mode);
    setSelectedTopicId(null);
    setViewingOverviewModuleId(null);
    setViewingTop100(false);
    if (mode === 'm1') setActiveModuleId(1);
    if (mode === 'm2') setActiveModuleId(2);
    if (mode === 'm3') setActiveModuleId(3);
  };

  const handleSelectTopic = (topicId: string) => {
    const found = ALL_TOPICS.find((t) => t.id === topicId);
    if (found) {
      setActiveModuleId(found.moduleId);
    }
    setViewingOverviewModuleId(null);
    setViewingTop100(false);
    setSelectedTopicId(topicId);
  };

  const handleOpenModuleOverview = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setSelectedTopicId(null);
    setViewingTop100(false);
    setViewingOverviewModuleId(moduleId);
  };

  const handleOpenTop100 = () => {
    setSelectedTopicId(null);
    setViewingOverviewModuleId(null);
    setViewingTop100(true);
  };

  const handleBackToGrid = () => {
    setSelectedTopicId(null);
    setViewingOverviewModuleId(null);
    setViewingTop100(false);
  };

  const toggleComplete = (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const toggleReviewedQuestion = (questionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReviewedQIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    setCompletedIds(new Set());
  };

  const filterButtons: { id: FilterMode; label: string }[] = [
    { id: 'all', label: `All Topics (${totalCount})` },
    { id: 'm1', label: `Module 1 (${getTopicsByModule(1).length})` },
    { id: 'm2', label: `Module 2 (${getTopicsByModule(2).length})` },
    { id: 'm3', label: `Module 3 (${getTopicsByModule(3).length})` },
    { id: 'favorites', label: `Interview Top (${favoritesCount})` },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 flex">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeModuleId={activeModuleId}
        selectedTopicId={selectedTopicId}
        viewingOverviewModuleId={viewingOverviewModuleId}
        viewingTop100={viewingTop100}
        completedIds={completedIds}
        reviewedQCount={reviewedQIds.size}
        onSelectModule={handleSelectModule}
        onSelectTopic={handleSelectTopic}
        onOpenModuleOverview={handleOpenModuleOverview}
        onOpenTop100={handleOpenTop100}
        onBackToGrid={handleBackToGrid}
        onResetProgress={handleResetProgress}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        {/* Top Filter & Progress Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open modules menu"
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex flex-wrap items-center gap-1.5">
                {filterButtons.map((btn) => {
                  const isActive =
                    filterMode === btn.id &&
                    !selectedTopic &&
                    viewingOverviewModuleId === null &&
                    !viewingTop100;
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => handleFilterClick(btn.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300 hover:text-slate-900'
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleOpenTop100}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewingTop100
                      ? 'bg-emerald-700 text-white'
                      : 'bg-sky-50 text-sky-800 border border-sky-200 hover:border-sky-400'
                  }`}
                >
                  Top 100 Q&A
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedTopic || viewingOverviewModuleId !== null || viewingTop100) {
                      setSelectedTopicId(null);
                      setViewingOverviewModuleId(null);
                      setViewingTop100(false);
                    }
                  }}
                  placeholder="Filter topic buttons..."
                  aria-label="Filter topic buttons"
                  className="w-48 sm:w-56 pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="hidden xl:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap">
                <span className="font-semibold text-slate-700">
                  {completedCount}/{totalCount} done ({completedPct}%)
                </span>
                <span aria-hidden="true">·</span>
                <span>{interactiveLabsCount} labs</span>
                <span aria-hidden="true">·</span>
                <span>100 Q&A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace Canvas */}
        <main className="flex-1 overflow-y-auto clean-scroll p-4 sm:p-6">
          {viewingTop100 ? (
            <Top100InterviewView
              reviewedIds={reviewedQIds}
              onToggleReviewed={toggleReviewedQuestion}
              onBackToGrid={handleBackToGrid}
            />
          ) : selectedTopic ? (
            <TopicDetailView
              topic={selectedTopic}
              isCompleted={completedIds.has(selectedTopic.id)}
              onToggleComplete={(id) => toggleComplete(id)}
              onBackToGrid={handleBackToGrid}
              onNavigateTopic={handleSelectTopic}
            />
          ) : viewingOverviewModuleId !== null ? (
            <ModuleOverviewView
              moduleId={viewingOverviewModuleId}
              completedIds={completedIds}
              onBackToGrid={handleBackToGrid}
              onSelectTopic={handleSelectTopic}
            />
          ) : (
            <TopicGridView
              topics={ALL_TOPICS}
              filterMode={filterMode}
              searchQuery={searchQuery}
              completedIds={completedIds}
              onSelectTopic={handleSelectTopic}
              onOpenModuleOverview={handleOpenModuleOverview}
              onToggleComplete={toggleComplete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
