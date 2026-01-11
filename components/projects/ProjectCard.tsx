'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  totalTime?: number;
  onClick: () => void;
}

export function ProjectCard({ project, totalTime = 0, onClick }: ProjectCardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card hover onClick={onClick} className="relative overflow-hidden">
      {/* Color indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: project.color }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
            {project.isBillable && project.hourlyRate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${project.hourlyRate}/hr
              </p>
            )}
          </div>
          {project.isBillable && (
            <Badge variant="success" size="sm">
              Billable
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total time</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white timer-display">
            {formatTime(totalTime)}
          </span>
        </div>
      </div>
    </Card>
  );
}
