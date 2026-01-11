'use client';

import React from 'react';
import { Card, BarChart, PRODUCTIVITY_COLORS } from '@/components/ui';
import { DailySummary } from '@/lib/types';

interface TrendChartProps {
  summaries: DailySummary[];
}

export function TrendChart({ summaries }: TrendChartProps) {
  const chartData = {
    labels: summaries.map((s) => {
      const date = new Date(s.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Productive',
        data: summaries.map((s) => Math.round(s.productiveTime / 60)),
        backgroundColor: PRODUCTIVITY_COLORS.productive,
      },
      {
        label: 'Neutral',
        data: summaries.map((s) => Math.round(s.neutralTime / 60)),
        backgroundColor: PRODUCTIVITY_COLORS.neutral,
      },
      {
        label: 'Distraction',
        data: summaries.map((s) => Math.round(s.distractionTime / 60)),
        backgroundColor: PRODUCTIVITY_COLORS.distraction,
      },
    ],
  };

  if (summaries.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Time Trends
        </h3>
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">No data for selected period</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Time Trends (minutes)
      </h3>
      <BarChart data={chartData} height={300} />
    </Card>
  );
}
