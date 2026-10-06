// lib/spacedRepetition.ts
export function getNextRevisionDate(repetition: number, rating: number, lastDate: Date = new Date()): { nextDate: string; nextRepetition: number } {
  let intervalDays = 1;
  let nextRep = repetition + 1;

  if (rating < 3) {
    // Reset repetition cycle on poor recall
    nextRep = 0;
    intervalDays = 1;
  } else {
    switch (repetition) {
      case 0: intervalDays = 1; break;
      case 1: intervalDays = 3; break;
      case 2: intervalDays = 7; break;
      case 3: intervalDays = 14; break;
      case 4: intervalDays = 30; break;
      default: intervalDays = Math.round(30 * Math.pow(1.8, repetition - 4)); break;
    }
  }

  const next = new Date(lastDate);
  next.setDate(next.getDate() + intervalDays);
  return {
    nextDate: next.toISOString().split('T')[0],
    nextRepetition: nextRep
  };
}