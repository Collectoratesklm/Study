// lib/priority.ts
import { Topic, PriorityLevel } from '@/types/planner';

export function calculateTopicPriority(topic: Topic, daysUntilExam: number): { score: number; level: PriorityLevel } {
  const urgency = Math.max(1, 30 / Math.max(1, daysUntilExam));
  const accuracyDeficit = (100 - (topic.practiceAccuracy || 50)) / 100;
  const confidenceDeficit = (100 - (topic.confidenceScore || 50)) / 100;
  const deficit = accuracyDeficit * 0.6 + confidenceDeficit * 0.4;

  const score = Number(((topic.importance * topic.difficulty) * (1 + deficit) * urgency).toFixed(2));

  let level: PriorityLevel = 'LOW';
  if (score >= 40 || (topic.status === 'WEAK' && topic.importance >= 4)) level = 'CRITICAL';
  else if (score >= 25) level = 'HIGH';
  else if (score >= 15) level = 'MEDIUM';

  return { score, level };
}