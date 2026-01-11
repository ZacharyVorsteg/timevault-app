'use client';

import React, { useMemo } from 'react';
import { Card, DoughnutChart, PRODUCTIVITY_COLORS } from '@/components/ui';
import { useDatabase } from '@/components/providers';
import { formatDuration, calculateProductivityScore } from '@/lib/export';

export function TodaySummary() {
  const { todayActivities, categories } = useDatabase();

  const summary = useMemo(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    let totalTime = 0;
    let productiveTime = 0;
    let neutralTime = 0;
    let distractionTime = 0;
    const appTimes = new Map<string, number>();

    for (const activity of todayActivities) {
      totalTime += activity.duration;
      const category = categoryMap.get(activity.categoryId);

      if (category) {
        switch (category.type) {
          case 'productive':
            productiveTime += activity.duration;
            break;
          case 'neutral':
            neutralTime += activity.duration;
            break;
          case 'distraction':
            distractionTime += activity.duration;
            break;
        }
      }

      const current = appTimes.get(activity.appName) || 0;
      appTimes.set(activity.appName, current + activity.duration);
    }

    const topApps = Array.from(appTimes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([appName, duration]) => ({ appName, duration }));

    return {
      totalTime,
      productiveTime,
      neutralTime,
      distractionTime,
      topApps,
    };
  }, [todayActivities, categories]);

  const productivityScore = calculateProductivityScore({
    date: new Date().toISOString().split('T')[0],
    ...summary,
    topApps: summary.topApps,
    topCategories: [],
    topProjects: [],
  });

  const chartData = {
    labels: ['Productive', 'Neutral', 'Distraction'],
    datasets: [
      {
        data: [summary.productiveTime, summary.neutralTime, summary.distractionTime],
        backgroundColor: [
          PRODUCTIVITY_COLORS.productive,
          PRODUCTIVITY_COLORS.neutral,
          PRODUCTIVITY_COLORS.distraction,
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Summary</h2>

      {summary.totalTime > 0 ? (
        <div className="space-y-6">
          {/* Total time and score */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total tracked</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white timer-display">
                {formatDuration(summary.totalTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Productivity</p>
              <p
                className={`text-3xl font-bold ${
                  productivityScore >= 70
                    ? 'text-productive'
                    : productivityScore >= 40
                    ? 'text-neutral'
                    : 'text-distraction'
                }`}
              >
                {productivityScore}%
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="flex justify-center">
            <div className="w-48 h-48">
              <DoughnutChart data={chartData} height={192} showLegend={false} />
            </div>
          </div>

          {/* Time breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-productive-light dark:bg-productive/10">
              <p className="text-xs text-productive-dark dark:text-productive font-medium mb-1">
                Productive
              </p>
              <p className="text-lg font-bold text-productive-dark dark:text-productive timer-display">
                {formatDuration(summary.productiveTime)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-neutral-light dark:bg-neutral/10">
              <p className="text-xs text-neutral-dark dark:text-neutral font-medium mb-1">
                Neutral
              </p>
              <p className="text-lg font-bold text-neutral-dark dark:text-neutral timer-display">
                {formatDuration(summary.neutralTime)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-distraction-light dark:bg-distraction/10">
              <p className="text-xs text-distraction-dark dark:text-distraction font-medium mb-1">
                Distraction
              </p>
              <p className="text-lg font-bold text-distraction-dark dark:text-distraction timer-display">
                {formatDuration(summary.distractionTime)}
              </p>
            </div>
          </div>

          {/* Top apps */}
          {summary.topApps.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Apps</h3>
              <div className="space-y-2">
                {summary.topApps.map((app) => (
                  <div
                    key={app.appName}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{app.appName}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
                      {formatDuration(app.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
          <p className="text-gray-600 dark:text-gray-300">No activity tracked today</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Start tracking to see your summary
          </p>
        </div>
      )}
    </Card>
  );
}
