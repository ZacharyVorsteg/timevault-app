'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

type DateRange = 'today' | 'week' | 'month' | 'custom';

interface DateRangePickerProps {
  onRangeChange: (start: Date, end: Date) => void;
}

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>('week');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const handleRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start: Date;

    switch (range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      default:
        return;
    }

    onRangeChange(start, end);
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59);
      onRangeChange(start, end);
      setSelectedRange('custom');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { value: 'today', label: 'Today' },
          { value: 'week', label: '7 Days' },
          { value: 'month', label: '30 Days' },
        ].map((option) => (
          <button
            key={option.value}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedRange === option.value
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => handleRangeSelect(option.value as DateRange)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button size="sm" variant="secondary" onClick={handleCustomRange}>
          Apply
        </Button>
      </div>
    </div>
  );
}
