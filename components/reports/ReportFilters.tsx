'use client';

import React, { useState } from 'react';
import { Button, Select } from '@/components/ui';
import { Project, Category } from '@/lib/types';

interface ReportFiltersProps {
  projects: Project[];
  categories: Category[];
  onFilter: (filters: {
    startDate: Date;
    endDate: Date;
    projectId?: string;
    categoryId?: string;
  }) => void;
}

export function ReportFilters({ projects, categories, onFilter }: ReportFiltersProps) {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleApply = () => {
    onFilter({
      startDate: new Date(startDate),
      endDate: new Date(endDate + 'T23:59:59'),
      projectId: projectId || undefined,
      categoryId: categoryId || undefined,
    });
  };

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-4">
        {/* Date presets */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => handlePreset(7)}
          >
            7 Days
          </button>
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => handlePreset(30)}
          >
            30 Days
          </button>
          <button
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => handlePreset(90)}
          >
            90 Days
          </button>
        </div>

        {/* Custom dates */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Project filter */}
        <Select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={[
            { value: '', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />

        {/* Category filter */}
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <Button onClick={handleApply}>Apply Filters</Button>
      </div>
    </div>
  );
}
