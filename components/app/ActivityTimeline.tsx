'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Select } from '@/components/ui';
import { useDatabase } from '@/components/providers';
import { formatDuration } from '@/lib/export';
import { Activity } from '@/lib/types';

export function ActivityTimeline() {
  const { todayActivities, categories, projects, updateActivity, removeActivity } = useDatabase();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editCategory, setEditCategory] = useState<string>('');
  const [editProject, setEditProject] = useState<string>('');

  const sortedActivities = [...todayActivities].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const handleEditOpen = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditCategory(activity.categoryId);
    setEditProject(activity.projectId || '');
  };

  const handleSaveEdit = async () => {
    if (selectedActivity) {
      await updateActivity(selectedActivity.id, {
        categoryId: editCategory,
        projectId: editProject || undefined,
      });
      setSelectedActivity(null);
    }
  };

  const handleDelete = async () => {
    if (selectedActivity) {
      await removeActivity(selectedActivity.id);
      setSelectedActivity(null);
    }
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);
  const getProjectById = (id: string) => projects.find((p) => p.id === id);

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Log</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {sortedActivities.length} entries
          </span>
        </div>

        {sortedActivities.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {sortedActivities.map((activity) => {
              const category = getCategoryById(activity.categoryId);
              const project = activity.projectId
                ? getProjectById(activity.projectId)
                : null;

              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleEditOpen(activity)}
                >
                  {/* Time indicator */}
                  <div className="shrink-0 text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(activity.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDuration(activity.duration)}
                    </p>
                  </div>

                  {/* Category indicator */}
                  <div
                    className={`w-1 h-12 rounded-full ${
                      category?.type === 'productive'
                        ? 'bg-productive'
                        : category?.type === 'distraction'
                        ? 'bg-distraction'
                        : 'bg-neutral'
                    }`}
                  />

                  {/* Activity details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {activity.appName}
                      </span>
                      {activity.isManual && (
                        <Badge variant="default" size="sm">
                          Manual
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.windowTitle || 'Untitled'}
                    </p>
                    {project && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                        {project.name}
                      </p>
                    )}
                  </div>

                  {/* Category badge */}
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
              );
            })}
          </div>
        ) : (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300">No activities recorded today</p>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Edit Activity"
        size="md"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">App</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedActivity.appName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Window Title</p>
              <p className="text-gray-900 dark:text-white">
                {selectedActivity.windowTitle || 'Untitled'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDuration(selectedActivity.duration)}
              </p>
            </div>

            <Select
              label="Category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Project"
              value={editProject}
              onChange={(e) => setEditProject(e.target.value)}
              options={[
                { value: '', label: 'No project' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />

            <div className="flex justify-between pt-4">
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setSelectedActivity(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
