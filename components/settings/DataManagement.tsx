'use client';

import React, { useState, useRef } from 'react';
import { Card, Button, ConfirmModal } from '@/components/ui';
import { resetOnboarding } from '@/components/app';

interface DataManagementProps {
  onExport: () => Promise<void>;
  onImport: (data: string) => Promise<void>;
  onClear: () => Promise<void>;
}

export function DataManagement({ onExport, onImport, onClear }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [onboardingReset, setOnboardingReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const text = await file.text();
      await onImport(text);
    } catch (error) {
      setImportError('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await onClear();
      setShowClearConfirm(false);
    } finally {
      setIsClearing(false);
    }
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    setOnboardingReset(true);
    setTimeout(() => setOnboardingReset(false), 3000);
  };

  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>

        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export All Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download your complete database as a JSON file
              </p>
            </div>
            <Button variant="secondary" onClick={handleExport} isLoading={isExporting}>
              Export
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Import Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restore data from a previously exported JSON file
              </p>
              {importError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{importError}</p>
              )}
            </div>
            <Button variant="secondary" onClick={handleImportClick} isLoading={isImporting}>
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Reset Onboarding */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Reset Onboarding</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show the welcome tour again on next visit
              </p>
              {onboardingReset && (
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  Onboarding will show on next page load
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={handleResetOnboarding}>
              Reset
            </Button>
          </div>

          {/* Clear */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">Clear All Data</p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete all activities, projects, and settings
              </p>
            </div>
            <Button variant="danger" onClick={() => setShowClearConfirm(true)}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="Clear All Data"
        message="This will permanently delete all your activities, projects, rules, and settings. This action cannot be undone. Are you sure?"
        confirmText="Yes, Clear Everything"
        cancelText="Cancel"
        variant="danger"
        isLoading={isClearing}
      />
    </>
  );
}
