'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Toggle } from '@/components/ui';
import { Project } from '@/lib/types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export function ProjectForm({ project, onSubmit, onCancel, onDelete }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [color, setColor] = useState(project?.color || COLORS[0]);
  const [isBillable, setIsBillable] = useState(project?.isBillable || false);
  const [hourlyRate, setHourlyRate] = useState(project?.hourlyRate?.toString() || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (isBillable && hourlyRate && isNaN(parseFloat(hourlyRate))) {
      setError('Hourly rate must be a valid number');
      return;
    }

    onSubmit({
      name: name.trim(),
      color,
      isBillable,
      hourlyRate: isBillable && hourlyRate ? parseFloat(hourlyRate) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Client Website"
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-8 h-8 rounded-full transition-transform ${
                color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <Toggle
        checked={isBillable}
        onChange={setIsBillable}
        label="Billable project"
        description="Track this project for invoicing"
      />

      {isBillable && (
        <Input
          label="Hourly Rate ($)"
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="0.00"
          hint="Used for billing calculations"
        />
      )}

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {project && onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <div />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      </div>
    </form>
  );
}
