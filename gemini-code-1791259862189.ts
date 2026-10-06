// types/planner.ts

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISION' | 'WEAK' | 'MASTERED';
export type SessionType = 'CONCEPT' | 'PRACTICE' | 'REVISION' | 'TOPIC_TEST' | 'MOCK_TEST' | 'ERROR_ANALYSIS';

export interface Examination {
  id: string;
  name: string;
  shortName: string;
  category: string;
  examDate: string; // ISO format
  prepStartDate: string;
  dailyHours: number;
  weeklyDays: number;
  targetScore: number;
  maxMarks: number;
  negativeMarking: boolean;
  parts: ExaminationPart[];
}

export interface ExaminationPart {
  id: string;
  examId: string;
  name: string;
  partType: 'GENERAL' | 'CORE' | 'TECHNICAL' | 'APTITUDE' | 'REASONING' | 'LANGUAGE' | 'CURRENT_AFFAIRS';
  weightage: number; // e.g., 30 for 30%
  targetScore: number;
  units: Unit[];
}

export interface Unit {
  id: string;
  partId: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  unitId: string;
  name: string;
  description: string;
  subtopics: string[];
  importance: number; // 1 - 5
  difficulty: number; // 1 - 5
  estimatedStudyHours: number;
  estimatedPracticeHours: number;
  status: TopicStatus;
  completionPercentage: number;
  confidenceScore: number; // 0 - 100
  practiceAccuracy: number; // 0 - 100
  questionsAttempted: number;
  questionsCorrect: number;
  lastStudiedDate?: string;
  lastRevisedDate?: string;
  nextRevisionDate?: string;
  revisionRepetition: number; // For spaced repetition calculations
  priorityScore: number; // Dynamically computed
}

export interface StudySession {
  id: string;
  examId: string;
  topicId: string;
  unitName: string;
  topicName: string;
  type: SessionType;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  actualDurationMinutes?: number;
  isCompleted: boolean;
  isMissed: boolean;
  userRating?: number; // 1 - 5
}

export interface MistakeLog {
  id: string;
  topicId: string;
  question: string;
  mistakeType: 'CONCEPTUAL' | 'CALCULATION' | 'MISREADING' | 'TIME_PRESSURE' | 'MEMORY_FAILURE' | 'CARELESS';
  correctAnswer: string;
  userAnswer: string;
  lessonLearned: string;
  createdAt: string;
}