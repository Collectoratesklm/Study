// lib/readiness.ts
export function calculateReadinessScore(params: {
  topicsCovered: number;
  totalTopics: number;
  averageAccuracy: number;
  revisionsCompleted: number;
  revisionsDue: number;
  studyHoursCompleted: number;
  studyHoursPlanned: number;
}): { score: number; label: string; tone: 'green' | 'yellow' | 'orange' | 'red' } {
  const coverage = Math.min(100, (params.topicsCovered / Math.max(1, params.totalTopics)) * 100);
  const accuracy = Math.min(100, params.averageAccuracy);
  const revision = params.revisionsDue === 0 ? 100 : Math.min(100, (params.revisionsCompleted / params.revisionsDue) * 100);
  const consistency = Math.min(100, (params.studyHoursCompleted / Math.max(1, params.studyHoursPlanned)) * 100);

  const rawScore = Math.round(
    coverage * 0.35 +
    accuracy * 0.25 +
    revision * 0.20 +
    consistency * 0.20
  );

  const score = Math.max(0, Math.min(100, rawScore));

  if (score >= 80) return { score, label: 'Excellent - On Track', tone: 'green' };
  if (score >= 65) return { score, label: 'Achievable - Normal Pacing', tone: 'green' };
  if (score >= 50) return { score, label: 'Moderate - More Practice Required', tone: 'yellow' };
  if (score >= 35) return { score, label: 'At Risk - Lagging Behind', tone: 'orange' };
  return { score, label: 'Critical - Immediate Recovery Required', tone: 'red' };
}