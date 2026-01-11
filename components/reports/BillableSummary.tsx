'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { Project, Activity } from '@/lib/types';
import { formatDuration, formatDecimalHours } from '@/lib/export';

interface BillableSummaryProps {
  activities: Activity[];
  projects: Project[];
}

export function BillableSummary({ activities, projects }: BillableSummaryProps) {
  const billableProjects = projects.filter((p) => p.isBillable);
  const billableProjectIds = new Set(billableProjects.map((p) => p.id));

  // Calculate billable time per project
  const projectTimes = new Map<string, number>();

  for (const activity of activities) {
    if (activity.projectId && billableProjectIds.has(activity.projectId)) {
      const current = projectTimes.get(activity.projectId) || 0;
      projectTimes.set(activity.projectId, current + activity.duration);
    }
  }

  const billableData = billableProjects
    .map((project) => {
      const duration = projectTimes.get(project.id) || 0;
      const hours = duration / 3600;
      const amount = project.hourlyRate ? hours * project.hourlyRate : 0;
      return {
        project,
        duration,
        hours,
        amount,
      };
    })
    .filter((d) => d.duration > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalHours = billableData.reduce((acc, d) => acc + d.hours, 0);
  const totalAmount = billableData.reduce((acc, d) => acc + d.amount, 0);

  if (billableData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Billable Summary
        </h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">No billable time for this period</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Mark projects as billable to track invoiceable hours
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billable Summary</h3>
        <Badge variant="success">
          ${totalAmount.toFixed(2)}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {billableData.map((item) => (
          <div
            key={item.project.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.project.color }}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.project.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ${item.project.hourlyRate}/hr
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                ${item.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.hours.toFixed(2)} hours
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${totalAmount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalHours.toFixed(2)} hours
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
