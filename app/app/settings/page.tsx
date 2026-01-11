'use client';

import React from 'react';
import { useDatabase } from '@/components/providers';
import { useToast } from '@/contexts/ToastContext';
import {
  TrackingOptions,
  WorkingHours,
  PomodoroSettings,
  ThemeSelector,
  DataManagement,
  CategoryManager,
} from '@/components/settings';
import { Card, Badge } from '@/components/ui';
import { downloadFile } from '@/lib/export';
import { Settings } from '@/lib/types';

export default function SettingsPage() {
  const {
    settings,
    updateSetting,
    categories,
    createCategory,
    editCategory,
    removeCategory,
    license,
    exportData,
    importDataFromJSON,
    clearData,
    isLoading,
  } = useDatabase();
  const { toast } = useToast();

  const handleSettingChange = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    try {
      await updateSetting(key, value);
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleExport = async () => {
    try {
      const json = await exportData();
      downloadFile(json, 'timevault-backup.json', 'application/json');
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = async (data: string) => {
    try {
      await importDataFromJSON(data);
      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Failed to import data');
      throw error; // Re-throw to show error in DataManagement component
    }
  };

  const handleClear = async () => {
    try {
      await clearData();
      toast.success('Data cleared');
    } catch (error) {
      toast.error('Failed to clear data');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your TimeVault experience</p>
      </div>

      {/* License info */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">License</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your current plan and limits
            </p>
          </div>
          <Badge
            variant={
              license.tier === 'pro'
                ? 'primary'
                : license.tier === 'personal'
                ? 'success'
                : 'default'
            }
          >
            {license.tier.charAt(0).toUpperCase() + license.tier.slice(1)}
          </Badge>
        </div>
        {license.tier !== 'pro' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/upgrade"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Upgrade to unlock all features
            </a>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TrackingOptions settings={settings} onSettingChange={handleSettingChange} />
          <WorkingHours settings={settings} onSettingChange={handleSettingChange} />
          <PomodoroSettings settings={settings} onSettingChange={handleSettingChange} />
        </div>

        <div className="space-y-6">
          <ThemeSelector />
          <CategoryManager
            categories={categories}
            onAdd={createCategory}
            onEdit={editCategory}
            onDelete={removeCategory}
          />
          <DataManagement onExport={handleExport} onImport={handleImport} onClear={handleClear} />
        </div>
      </div>

      {/* Privacy note */}
      <Card className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="flex gap-4">
          <div className="shrink-0 p-2 bg-primary-600 rounded-lg h-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Your Privacy is Protected</h3>
            <p className="text-gray-400 text-sm">
              All your data is stored locally in your browser using IndexedDB. We have no servers
              storing your information, no analytics tracking your usage, and no way to access
              your data. Your time tracking stays completely private.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
