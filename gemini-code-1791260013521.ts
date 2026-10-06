// components/StudyPlannerDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, CheckCircle2, AlertTriangle, Play, Pause, RotateCcw, 
  Flame, Calendar, ChevronRight, BarChart3, RefreshCw, BookmarkCheck
} from 'lucide-react';

interface SessionItem {
  id: string;
  topicName: string;
  unitName: string;
  subject: string;
  durationMinutes: number;
  type: 'CONCEPT' | 'PRACTICE' | 'REVISION' | 'TEST';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  completed: boolean;
}

export default function StudyPlannerDashboard() {
  // Demo State - Preloaded for Immediate Testability
  const [examInfo] = useState({
    name: 'UPSC Civil Services Examination',
    examDate: '2027-05-15',
    dailyTargetHours: 6,
    totalPlannedHours: 620,
    completedHours: 312
  });

  const [sessions, setSessions] = useState<SessionItem[]>([
    { id: 's1', topicName: 'Probability & Permutations', unitName: 'Discrete Mathematics', subject: 'Aptitude', durationMinutes: 90, type: 'PRACTICE', priority: 'CRITICAL', completed: false },
    { id: 's2', topicName: 'Directive Principles & Fundamental Rights', unitName: 'Constitutional Framework', subject: 'General Studies', durationMinutes: 60, type: 'CONCEPT', priority: 'HIGH', completed: false },
    { id: 's3', topicName: 'Percentage & Profit/Loss', unitName: 'Arithmetic', subject: 'Aptitude', durationMinutes: 45, type: 'REVISION', priority: 'MEDIUM', completed: true },
    { id: 's4', topicName: 'Macroeconomics: Inflation Indices', unitName: 'Indian Economy', subject: 'General Studies', durationMinutes: 45, type: 'REVISION', priority: 'HIGH', completed: false }
  ]);

  // Active Timer State
  const [activeSession, setActiveSession] = useState<SessionItem | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Rebalance Banner State
  const [rebalanceAlert, setRebalanceAlert] = useState<string | null>(null);

  // Countdown calculations
  const calculateDaysRemaining = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysRemaining(examInfo.examDate);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startSession = (session: SessionItem) => {
    setActiveSession(session);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const completeActiveSession = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, completed: true } : s))
    );
    setIsTimerRunning(false);
    setActiveSession(null);
  };

  const handleMissSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setRebalanceAlert(
      `"${session.topicName}" has been pushed to tomorrow's load balancer. Available buffer absorbed 45 mins.`
    );
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE PREPARATION ENGINE
            </span>
            <span className="text-xs text-slate-400">Target: {examInfo.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white tracking-tight">
            Competitive Examinations Study Planner
          </h1>
        </div>

        {/* Exam Countdown & Streak */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Exam In</p>
              <p className="text-lg font-bold text-white leading-none">{daysRemaining} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Study Streak</p>
              <p className="text-lg font-bold text-white leading-none">14 Days</p>
            </div>
          </div>
        </div>
      </header>

      {/* Rebalance Warning Banner */}
      {rebalanceAlert && (
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-200">{rebalanceAlert}</p>
          </div>
          <button 
            onClick={() => setRebalanceAlert(null)}
            className="text-xs text-amber-400 hover:text-amber-200 font-medium px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Exam Readiness</p>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookmarkCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">68%</span>
            <span className="text-xs text-emerald-400 font-medium">On Track</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Syllabus Covered</p>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">72%</span>
            <span className="text-xs text-slate-400">133 / 185 Topics</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '72%' }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Practice Accuracy</p>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">77.4%</span>
            <span className="text-xs text-slate-400">2,840 Questions</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '77.4%' }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Study Pacing</p>
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">312</span>
            <span className="text-xs text-slate-400">/ 620 Planned Hrs</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-violet-500 h-full rounded-full" style={{ width: '50.3%' }} />
          </div>
        </div>
      </section>

      {/* Main Workbench: Split 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left 2 Cols: Today's Action Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Today's Prescribed Study Blueprint
            </h2>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
              {sessions.filter(s => s.completed).length} / {sessions.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`p-4 rounded-xl border transition-all ${
                  session.completed 
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide ${
                        session.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        session.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {session.priority}
                      </span>
                      <span className="text-xs text-slate-400">{session.subject} • {session.unitName}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mt-1">{session.topicName}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Type: <strong className="text-slate-300">{session.type}</strong></span>
                      <span>Target: <strong className="text-slate-300">{session.durationMinutes} mins</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.completed ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMissSession(session.id)}
                          className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => startSession(session)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Study
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Focus Timer & Smart Recommendation */}
        <div className="space-y-6">
          {/* Active Session Timer Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-900/40 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Focus Execution Desk</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                {activeSession ? 'IN PROGRESS' : 'IDLE'}
              </span>
            </div>

            {activeSession ? (
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">{activeSession.topicName}</p>
                <div className="text-5xl font-mono font-extrabold text-white my-4 tracking-wider">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <button
                    onClick={completeActiveSession}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Concluded
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Key formula or blocker note..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="mt-4 w-full bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <div className="mt-8 text-center py-6">
                <Clock className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No active study session</p>
                <p className="text-xs text-slate-500 mt-1">Select a topic from your daily blueprint to initiate the timer</p>
              </div>
            )}
          </div>

          {/* AI Gap & Action Engine */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Syllabus Deficit Diagnostics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your overall completion pacing is sound, but <strong>Discrete Mathematics (Probability)</strong> has dropped to <strong>48% accuracy</strong> over the last 30 questions.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
              <strong className="text-emerald-400 block mb-1">Recommended Action:</strong>
              Substitute 45 mins of passive note review with 25 intermediate difficulty questions before Friday's sectional mock.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}