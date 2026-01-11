'use client';

import React from 'react';
import { Card, BarChart } from '@/components/ui';
import { Project, Activity } from '@/lib/types';
import { formatDuration, formatDecimalHours } from '@/lib/export';

interface TimeByProjectProps {
  activities: Activity[];
  projects: Project[];
}

export function TimeByProject({ activities, projects }: TimeByProjectProps) {
  // Aggregate time by project
  const projectTimes = new Map<string, number>();
  let unassignedTime = 0;

  for (const activity of activities) {
    if (activity.projectId) {
      const current = projectTimes.get(activity.projectId) || 0;
      projectTimes.set(activity.projectId, current + activity.duration);
    } else {
      unassignedTime += activity.duration;
    }
  }

  const projectData = Array.from(projectTimes.entries())
    .map(([projectId, duration]) => {
      const project = projects.find((p) => p.id === projectId);
      return {
        project,
        duration,
        name: project?.name || 'Unknown',
        color: project?.color || '#6b7280',
      };
    })
    .sort((a, b) => b.duration - a.duration);

  const chartData = {
    labels: projectData.map((p) => p.name),
    datasets: [
      {
        label: 'Hours',
        data: projectData.map((p) => parseFloat(formatDecimalHours(p.duration))),
        backgroundColor: projectData.map((p) => p.color),
      },
    ],
  };

  if (projectData.length === 0 && unassignedTime === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Time by Project
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">No project data for this period</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Time by Project
      </h3>

      {projectData.length > 0 && <BarChart data={chartData} height={200} showLegend={false} />}

      <div className="mt-4 space-y-2">
        {projectData.map((item) => (
          <div
            key={item.project?.id || 'unknown'}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
                {formatDuration(item.duration)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({formatDecimalHours(item.duration)}h)
              </span>
            </div>
          </div>
        ))}
        {unassignedTime > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Unassigned</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white timer-display">
              {formatDuration(unassignedTime)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
