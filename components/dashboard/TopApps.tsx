'use client';

import React from 'react';
import { Card, generateColors } from '@/components/ui';
import { DailySummary } from '@/lib/types';
import { formatDuration } from '@/lib/export';

interface TopAppsProps {
  summaries: DailySummary[];
}

export function TopApps({ summaries }: TopAppsProps) {
  // Aggregate app times across all summaries
  const appTimes = new Map<string, number>();

  for (const summary of summaries) {
    for (const app of summary.topApps) {
      const current = appTimes.get(app.appName) || 0;
      appTimes.set(app.appName, current + app.duration);
    }
  }

  const topApps = Array.from(appTimes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([appName, duration]) => ({ appName, duration }));

  const maxDuration = topApps[0]?.duration || 1;
  const colors = generateColors(topApps.length);

  if (topApps.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Apps</h3>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">No app data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Apps</h3>
      <div className="space-y-3">
        {topApps.map((app, index) => (
          <div key={app.appName}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">{app.appName}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
                {formatDuration(app.duration)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(app.duration / maxDuration) * 100}%`,
                  backgroundColor: colors[index],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
