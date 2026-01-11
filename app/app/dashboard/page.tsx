'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/components/providers';
import {
  DateRangePicker,
  ProductivityScore,
  TrendChart,
  TopApps,
  CategoryBreakdown,
} from '@/components/dashboard';
import { Card } from '@/components/ui';
import { generateDailySummaries, formatDuration } from '@/lib/export';
import { DailySummary } from '@/lib/types';

export default function DashboardPage() {
  const { getActivities, categories, isLoading } = useDatabase();
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const data = await generateDailySummaries(dateRange.start, dateRange.end);
      setSummaries(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [dateRange]);

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const totalTime = summaries.reduce((acc, s) => acc + s.totalTime, 0);
  const productiveTime = summaries.reduce((acc, s) => acc + s.productiveTime, 0);
  const distractionTime = summaries.reduce((acc, s) => acc + s.distractionTime, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your productivity insights over time
          </p>
        </div>
        <DateRangePicker onRangeChange={handleRangeChange} />
      </div>

      {isLoadingData ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white timer-display">
                {formatDuration(totalTime)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Productive</p>
              <p className="text-2xl font-bold text-productive timer-display">
                {formatDuration(productiveTime)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distraction</p>
              <p className="text-2xl font-bold text-distraction timer-display">
                {formatDuration(distractionTime)}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaries.length}
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendChart summaries={summaries} />
            </div>
            <ProductivityScore summaries={summaries} />
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <TopApps summaries={summaries} />
            <CategoryBreakdown summaries={summaries} categories={categories} />
          </div>
        </>
      )}
    </div>
  );
}
