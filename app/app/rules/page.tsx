'use client';

import React, { useState } from 'react';
import { useDatabase } from '@/components/providers';
import { useToast } from '@/contexts/ToastContext';
import { RuleBuilder } from '@/components/projects';
import { Button, Modal, Card, Badge, Toggle } from '@/components/ui';
import { Rule } from '@/lib/types';
import { getFeatureLimit } from '@/lib/stripe';

export default function RulesPage() {
  const {
    rules,
    categories,
    projects,
    createRule,
    editRule,
    removeRule,
    license,
    isLoading,
  } = useDatabase();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const ruleLimit = getFeatureLimit(license.tier, 'rules');
  const canCreateRule = rules.length < ruleLimit;

  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  const handleCreateRule = async (data: Omit<Rule, 'id' | 'createdAt'>) => {
    try {
      await createRule(data);
      setIsFormOpen(false);
      toast.success('Rule created');
    } catch (error) {
      toast.error('Failed to create rule');
    }
  };

  const handleEditRule = async (data: Omit<Rule, 'id' | 'createdAt'>) => {
    if (editingRule) {
      try {
        await editRule(editingRule.id, data);
        setEditingRule(null);
        toast.success('Rule updated');
      } catch (error) {
        toast.error('Failed to update rule');
      }
    }
  };

  const handleDeleteRule = async () => {
    if (editingRule) {
      try {
        await removeRule(editingRule.id);
        setEditingRule(null);
        toast.success('Rule deleted');
      } catch (error) {
        toast.error('Failed to delete rule');
      }
    }
  };

  const handleToggleRule = async (rule: Rule) => {
    try {
      await editRule(rule.id, { isEnabled: !rule.isEnabled });
    } catch (error) {
      toast.error('Failed to toggle rule');
    }
  };

  const getCategoryName = (id?: string) =>
    id ? categories.find((c) => c.id === id)?.name : null;
  const getProjectName = (id?: string) =>
    id ? projects.find((p) => p.id === id)?.name : null;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rules</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Auto-categorize activities based on patterns
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          disabled={!canCreateRule}
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
          New Rule
        </Button>
      </div>

      {/* Info card */}
      <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex gap-3">
          <svg
            className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-primary-900 dark:text-primary-100">
              How rules work
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              Rules automatically categorize activities based on app name, window title, or URL.
              Higher priority rules are checked first. Built-in patterns already categorize
              common apps.
            </p>
          </div>
        </div>
      </Card>

      {/* Limit warning */}
      {!canCreateRule && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200">
            You&apos;ve reached the rule limit ({ruleLimit}) for your plan.{' '}
            <a href="/upgrade" className="underline font-medium">
              Upgrade
            </a>{' '}
            for more rules.
          </p>
        </div>
      )}

      {/* Rules list */}
      {sortedRules.length > 0 ? (
        <div className="space-y-3">
          {sortedRules.map((rule) => {
            const categoryName = getCategoryName(rule.categoryId);
            const projectName = getProjectName(rule.projectId);

            return (
              <Card
                key={rule.id}
                padding="sm"
                className={`${!rule.isEnabled ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <Toggle
                    checked={rule.isEnabled}
                    onChange={() => handleToggleRule(rule)}
                    size="sm"
                  />

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setEditingRule(rule)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {rule.condition.field}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {rule.condition.operator}
                      </span>
                      <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        &quot;{rule.condition.value}&quot;
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {categoryName && (
                        <Badge variant="default" size="sm">
                          {categoryName}
                        </Badge>
                      )}
                      {projectName && (
                        <Badge variant="primary" size="sm">
                          {projectName}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        Priority: {rule.priority}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </div>
              </Card>
            );
          })}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No custom rules yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Built-in patterns categorize common apps automatically. Create custom rules for
            more specific categorization.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>Create Your First Rule</Button>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="New Rule"
        size="lg"
      >
        <RuleBuilder
          categories={categories}
          projects={projects}
          onSubmit={handleCreateRule}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingRule}
        onClose={() => setEditingRule(null)}
        title="Edit Rule"
        size="lg"
      >
        {editingRule && (
          <RuleBuilder
            rule={editingRule}
            categories={categories}
            projects={projects}
            onSubmit={handleEditRule}
            onCancel={() => setEditingRule(null)}
            onDelete={handleDeleteRule}
          />
        )}
      </Modal>
    </div>
  );
}
