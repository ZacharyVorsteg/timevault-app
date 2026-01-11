'use client';

import React from 'react';
import { useTracking, useDatabase } from '@/components/providers';
import { Card, Badge, Button } from '@/components/ui';
import { formatDuration } from '@/lib/export';

export function CurrentActivity() {
  const { isTracking, isIdle, currentActivity, startTracking, stopTracking } = useTracking();
  const { categories } = useDatabase();

  const category = currentActivity
    ? categories.find((c) => c.id === currentActivity.categoryId)
    : null;

  return (
    <Card className="relative overflow-hidden">
      {/* Background indicator */}
      {isTracking && !isIdle && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Current Activity
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isTracking
                ? isIdle
                  ? 'Tracking paused - idle detected'
                  : 'Tracking active tab'
                : 'Tracking paused'}
            </p>
          </div>
          <Button
            variant={isTracking ? 'secondary' : 'primary'}
            size="sm"
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start
              </>
            )}
          </Button>
        </div>

        {currentActivity ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentActivity.appName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {currentActivity.windowTitle || 'Untitled'}
                  </p>
                </div>
              </div>
              {category && (
                <Badge
                  variant={
                    category.type === 'productive'
                      ? 'productive'
                      : category.type === 'distraction'
                      ? 'distraction'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {category.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Started {new Date(currentActivity.startTime).toLocaleTimeString()}
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white timer-display">
                {formatDuration(currentActivity.duration)}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {isIdle ? 'You appear to be idle' : 'No activity being tracked'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isTracking
                ? 'Switch to a different tab to track it'
                : 'Click Start to begin tracking'}
            </p>
          </div>
        )}

        {isIdle && isTracking && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">Idle detected - move mouse or type to resume</span>
          </div>
        )}
      </div>
    </Card>
  );
}
