'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '@/components/providers';
import { ReportFilters, TimeByProject, BillableSummary, ExportOptions } from '@/components/reports';
import { CategoryBreakdown } from '@/components/dashboard';
import { Card } from '@/components/ui';
import { Activity, DailySummary } from '@/lib/types';
import { generateDailySummaries, formatDuration } from '@/lib/export';

export default function ReportsPage() {
  const { getActivities, projects, categories, license, isLoading } = useDatabase();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    projectId: undefined as string | undefined,
    categoryId: undefined as string | undefined,
  });

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      let data = await getActivities(filters.startDate, filters.endDate);

      // Apply filters
      if (filters.projectId) {
        data = data.filter((a) => a.projectId === filters.projectId);
      }
      if (filters.categoryId) {
        data = data.filter((a) => a.categoryId === filters.categoryId);
      }

      setActivities(data);

      // Generate summaries
      const summaryData = await generateDailySummaries(filters.startDate, filters.endDate);
      setSummaries(summaryData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [filters, getActivities]);

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleFilter = (newFilters: {
    startDate: Date;
    endDate: Date;
    projectId?: string;
    categoryId?: string;
  }) => {
    setFilters({
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      projectId: newFilters.projectId,
      categoryId: newFilters.categoryId,
    });
  };

  const totalTime = activities.reduce((acc, a) => acc + a.duration, 0);
  const totalActivities = activities.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your time and generate exports
        </p>
      </div>

      {/* Filters */}
      <ReportFilters projects={projects} categories={categories} onFilter={handleFilter} />

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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Activities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalActivities}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaries.length}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg/Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white timer-display">
                {summaries.length > 0
                  ? formatDuration(Math.round(totalTime / summaries.length))
                  : '0s'}
              </p>
            </Card>
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <TimeByProject activities={activities} projects={projects} />
            <CategoryBreakdown summaries={summaries} categories={categories} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <BillableSummary activities={activities} projects={projects} />
            <ExportOptions
              activities={activities}
              projects={projects}
              categories={categories}
              startDate={filters.startDate}
              endDate={filters.endDate}
              licenseTier={license.tier}
            />
          </div>
        </>
      )}
    </div>
  );
}
