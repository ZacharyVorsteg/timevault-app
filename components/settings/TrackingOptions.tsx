'use client';

import React from 'react';
import { Card, Toggle, Input } from '@/components/ui';
import { Settings } from '@/lib/types';

interface TrackingOptionsProps {
  settings: Settings;
  onSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export function TrackingOptions({ settings, onSettingChange }: TrackingOptionsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tracking Options
      </h3>

      <div className="space-y-6">
        <Toggle
          checked={settings.trackWindowTitles}
          onChange={(checked) => onSettingChange('trackWindowTitles', checked)}
          label="Track window titles"
          description="Record the title of active tabs and windows for better categorization"
        />

        <Toggle
          checked={settings.trackUrls}
          onChange={(checked) => onSettingChange('trackUrls', checked)}
          label="Track URLs"
          description="Record full URLs for browser activities (more detailed but more sensitive)"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Idle Detection Threshold
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min="30"
              max="600"
              value={settings.idleThreshold}
              onChange={(e) => onSettingChange('idleThreshold', parseInt(e.target.value) || 120)}
              className="w-24"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              seconds (30-600)
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pause tracking after this period of inactivity
          </p>
        </div>

        <Toggle
          checked={settings.notificationsEnabled}
          onChange={(checked) => onSettingChange('notificationsEnabled', checked)}
          label="Enable notifications"
          description="Show notifications for Pomodoro sessions and reminders"
        />
      </div>
    </Card>
  );
}
