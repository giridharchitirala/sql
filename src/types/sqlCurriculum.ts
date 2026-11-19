export type InteractiveDemoType =
  | 'char-varchar'
  | 'joins'
  | 'nth-salary'
  | 'normalization'
  | 'emp-sandbox';

export interface SqlResultTable {
  columns: string[];
  rows: (string | number | null)[][];
  caption?: string;
}

export interface SqlExample {
  title: string;
  query: string;
  explanation: string;
  result?: SqlResultTable;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  tip?: string;
}

export interface Topic {
  id: string;
  number: number;
  moduleId: number;
  chapterId: string;
  chapterTitle: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  keyPoints: string[];
  syntax?: string;
  examples: SqlExample[];
  comparison?: ComparisonTable;
  interviewQuestions: InterviewQuestion[];
  interactiveDemo?: InteractiveDemoType;
  isInterviewFavorite?: boolean;
}

export interface ChapterInfo {
  id: string;
  label: string;
  title: string;
}

export interface ModuleInfo {
  id: number;
  shortName: string;
  label: string;
  title: string;
  subtitle: string;
  overviewIntro: string;
  learningGoals: string[];
  chapters: ChapterInfo[];
}
