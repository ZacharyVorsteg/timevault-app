'use client';

import React, { useMemo } from 'react';
import { Card, DoughnutChart, generateColors } from '@/components/ui';
import { useDatabase } from '@/components/providers';
import { formatDuration } from '@/lib/export';

export function ProductivityPie() {
  const { todayActivities, categories } = useDatabase();

  const categoryData = useMemo(() => {
    const categoryTimes = new Map<string, number>();

    for (const activity of todayActivities) {
      const current = categoryTimes.get(activity.categoryId) || 0;
      categoryTimes.set(activity.categoryId, current + activity.duration);
    }

    const data = Array.from(categoryTimes.entries())
      .map(([categoryId, duration]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          name: category?.name || 'Unknown',
          duration,
          color: category?.color || '#6b7280',
        };
      })
      .sort((a, b) => b.duration - a.duration);

    return data;
  }, [todayActivities, categories]);

  if (categoryData.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Time by Category
        </h2>
        <div className="text-center py-8">
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
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">No category data yet</p>
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: categoryData.map((c) => c.name),
    datasets: [
      {
        data: categoryData.map((c) => c.duration),
        backgroundColor: categoryData.map((c) => c.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time by Category</h2>

      <div className="flex justify-center mb-4">
        <div className="w-48 h-48">
          <DoughnutChart data={chartData} height={192} showLegend={false} />
        </div>
      </div>

      <div className="space-y-2">
        {categoryData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
              {formatDuration(item.duration)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
