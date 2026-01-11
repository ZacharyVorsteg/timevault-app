'use client';

import React from 'react';
import { Card, DoughnutChart } from '@/components/ui';
import { DailySummary, Category } from '@/lib/types';
import { formatDuration } from '@/lib/export';

interface CategoryBreakdownProps {
  summaries: DailySummary[];
  categories: Category[];
}

export function CategoryBreakdown({ summaries, categories }: CategoryBreakdownProps) {
  // Aggregate category times across all summaries
  const categoryTimes = new Map<string, number>();

  for (const summary of summaries) {
    for (const cat of summary.topCategories) {
      const current = categoryTimes.get(cat.categoryId) || 0;
      categoryTimes.set(cat.categoryId, current + cat.duration);
    }
  }

  const categoryData = Array.from(categoryTimes.entries())
    .map(([categoryId, duration]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        id: categoryId,
        name: category?.name || 'Unknown',
        duration,
        color: category?.color || '#6b7280',
        type: category?.type || 'neutral',
      };
    })
    .sort((a, b) => b.duration - a.duration);

  if (categoryData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">No category data available</p>
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

  const totalDuration = categoryData.reduce((acc, c) => acc + c.duration, 0);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Category Breakdown
      </h3>

      <div className="flex justify-center mb-4">
        <div className="w-40 h-40">
          <DoughnutChart data={chartData} height={160} showLegend={false} />
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
        {categoryData.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round((cat.duration / totalDuration) * 100)}%
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
                {formatDuration(cat.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
