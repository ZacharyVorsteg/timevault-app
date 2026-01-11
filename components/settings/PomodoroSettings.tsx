'use client';

import React from 'react';
import { Card, Input } from '@/components/ui';
import { Settings } from '@/lib/types';

interface PomodoroSettingsProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function PomodoroSettings({ settings, onSettingChange }: PomodoroSettingsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Pomodoro Settings
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Work Duration
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="120"
              value={settings.pomodoroWork}
              onChange={(e) =>
                onSettingChange('pomodoroWork', Math.max(1, parseInt(e.target.value) || 25))
              }
              className="w-20"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">min</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Short Break
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="30"
              value={settings.pomodoroBreak}
              onChange={(e) =>
                onSettingChange('pomodoroBreak', Math.max(1, parseInt(e.target.value) || 5))
              }
              className="w-20"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">min</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Long Break
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.pomodoroLongBreak}
              onChange={(e) =>
                onSettingChange('pomodoroLongBreak', Math.max(1, parseInt(e.target.value) || 15))
              }
              className="w-20"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">min</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Long break triggers every 4 work sessions
      </p>
    </Card>
  );
}
