'use client';

import React, { useState, useEffect } from 'react';
import { useDatabase } from '@/components/providers';
import { useToast } from '@/contexts/ToastContext';
import { ProjectCard, ProjectForm } from '@/components/projects';
import { Button, Modal, Card } from '@/components/ui';
import { Project, Activity } from '@/lib/types';
import { hasFeature, getFeatureLimit } from '@/lib/stripe';

export default function ProjectsPage() {
  const {
    projects,
    categories,
    createProject,
    editProject,
    removeProject,
    getActivities,
    license,
    isLoading,
  } = useDatabase();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTimes, setProjectTimes] = useState<Map<string, number>>(new Map());

  // Load project times
  useEffect(() => {
    const loadProjectTimes = async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activities = await getActivities(thirtyDaysAgo, new Date());

      const times = new Map<string, number>();
      for (const activity of activities) {
        if (activity.projectId) {
          const current = times.get(activity.projectId) || 0;
          times.set(activity.projectId, current + activity.duration);
        }
      }
      setProjectTimes(times);
    };

    if (!isLoading) {
      loadProjectTimes();
    }
  }, [isLoading, getActivities, projects]);

  const projectLimit = getFeatureLimit(license.tier, 'projects');
  const canCreateProject = projects.length < projectLimit;

  const handleCreateProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProject(data);
      setIsFormOpen(false);
      toast.success('Project created');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleEditProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      try {
        await editProject(editingProject.id, data);
        setEditingProject(null);
        toast.success('Project updated');
      } catch (error) {
        toast.error('Failed to update project');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (editingProject) {
      try {
        await removeProject(editingProject.id);
        setEditingProject(null);
        toast.success('Project deleted');
      } catch (error) {
        toast.error('Failed to delete project');
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your time by project
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          disabled={!canCreateProject}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          New Project
        </Button>
      </div>

      {/* Limit warning */}
      {!canCreateProject && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200">
            You&apos;ve reached the project limit ({projectLimit}) for your plan.{' '}
            <a href="/upgrade" className="underline font-medium">
              Upgrade
            </a>{' '}
            for unlimited projects.
          </p>
        </div>
      )}

      {/* Projects grid */}
      {projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              totalTime={projectTimes.get(project.id) || 0}
              onClick={() => setEditingProject(project)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Create projects to organize your time and track billable hours
          </p>
          <Button onClick={() => setIsFormOpen(true)}>Create Your First Project</Button>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="New Project"
        size="md"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
        size="md"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleEditProject}
            onCancel={() => setEditingProject(null)}
            onDelete={handleDeleteProject}
          />
        )}
      </Modal>
    </div>
  );
}
