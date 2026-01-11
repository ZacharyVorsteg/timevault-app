'use client';

import React from 'react';
import { Card, Input } from '@/components/ui';
import { Settings } from '@/lib/types';

interface WorkingHoursProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WorkingHours({ settings, onSettingChange }: WorkingHoursProps) {
  const toggleDay = (day: number) => {
    const newDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day].sort();
    onSettingChange('workingDays', newDays);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Working Hours</h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Define your typical working hours for productivity score calculations
      </p>

      <div className="space-y-6">
        {/* Time range */}
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start
            </label>
            <Input
              type="time"
              value={settings.workingHoursStart}
              onChange={(e) => onSettingChange('workingHoursStart', e.target.value)}
              className="w-32"
            />
          </div>
          <span className="mt-6 text-gray-500">to</span>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End
            </label>
            <Input
              type="time"
              value={settings.workingHoursEnd}
              onChange={(e) => onSettingChange('workingHoursEnd', e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Working days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Working Days
          </label>
          <div className="flex gap-2">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  settings.workingDays.includes(index)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
