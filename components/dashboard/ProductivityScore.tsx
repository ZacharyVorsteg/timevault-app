'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { DailySummary } from '@/lib/types';
import { calculateProductivityScore } from '@/lib/export';

interface ProductivityScoreProps {
  summaries: DailySummary[];
}

export function ProductivityScore({ summaries }: ProductivityScoreProps) {
  const totalSummary: DailySummary = {
    date: '',
    totalTime: summaries.reduce((acc, s) => acc + s.totalTime, 0),
    productiveTime: summaries.reduce((acc, s) => acc + s.productiveTime, 0),
    neutralTime: summaries.reduce((acc, s) => acc + s.neutralTime, 0),
    distractionTime: summaries.reduce((acc, s) => acc + s.distractionTime, 0),
    topApps: [],
    topCategories: [],
    topProjects: [],
  };

  const score = calculateProductivityScore(totalSummary);
  const avgDailyHours = summaries.length > 0
    ? totalSummary.totalTime / summaries.length / 3600
    : 0;

  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-productive';
    if (s >= 40) return 'text-neutral';
    return 'text-distraction';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 70) return 'Great';
    if (s >= 50) return 'Good';
    if (s >= 30) return 'Fair';
    return 'Needs Work';
  };

  return (
    <Card className="text-center">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Productivity Score
      </h3>

      <div className="relative w-32 h-32 mx-auto mb-4">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-gray-200 dark:text-gray-700"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="2.5"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            className={getScoreColor(score)}
            style={{ stroke: 'currentColor' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{getScoreLabel(score)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Avg Daily</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {avgDailyHours.toFixed(1)}h
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Days Tracked</p>
          <p className="font-semibold text-gray-900 dark:text-white">{summaries.length}</p>
        </div>
      </div>
    </Card>
  );
}
