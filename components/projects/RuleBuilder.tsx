'use client';

import React, { useState } from 'react';
import { Button, Input, Select, Card, Toggle } from '@/components/ui';
import { Rule, RuleCondition, Category, Project } from '@/lib/types';
import { validateRuleCondition } from '@/lib/rules';

interface RuleBuilderProps {
  rule?: Rule;
  categories: Category[];
  projects: Project[];
  onSubmit: (data: Omit<Rule, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function RuleBuilder({
  rule,
  categories,
  projects,
  onSubmit,
  onCancel,
  onDelete,
}: RuleBuilderProps) {
  const [field, setField] = useState<RuleCondition['field']>(
    rule?.condition.field || 'windowTitle'
  );
  const [operator, setOperator] = useState<RuleCondition['operator']>(
    rule?.condition.operator || 'contains'
  );
  const [value, setValue] = useState(rule?.condition.value || '');
  const [caseSensitive, setCaseSensitive] = useState(
    rule?.condition.caseSensitive || false
  );
  const [categoryId, setCategoryId] = useState(rule?.categoryId || '');
  const [projectId, setProjectId] = useState(rule?.projectId || '');
  const [priority, setPriority] = useState(rule?.priority?.toString() || '0');
  const [isEnabled, setIsEnabled] = useState(rule?.isEnabled ?? true);
  const [error, setError] = useState<string | null>(null);

  const fieldOptions = [
    { value: 'appName', label: 'App Name' },
    { value: 'windowTitle', label: 'Window Title' },
    { value: 'url', label: 'URL' },
  ];

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'regex', label: 'Regex' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const condition: RuleCondition = {
      field,
      operator,
      value,
      caseSensitive,
    };

    const validationError = validateRuleCondition(condition);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!categoryId && !projectId) {
      setError('Please select at least a category or project');
      return;
    }

    onSubmit({
      condition,
      categoryId: categoryId || undefined,
      projectId: projectId || undefined,
      priority: parseInt(priority) || 0,
      isEnabled,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Condition */}
      <Card padding="sm" className="bg-gray-50 dark:bg-gray-700/50">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          When an activity matches:
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <Select
            label="Field"
            value={field}
            onChange={(e) => setField(e.target.value as RuleCondition['field'])}
            options={fieldOptions}
          />

          <Select
            label="Operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value as RuleCondition['operator'])}
            options={operatorOptions}
          />

          <Input
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={operator === 'regex' ? '.*pattern.*' : 'Enter value'}
          />
        </div>

        <div className="mt-3">
          <Toggle
            checked={caseSensitive}
            onChange={setCaseSensitive}
            label="Case sensitive"
            size="sm"
          />
        </div>
      </Card>

      {/* Action */}
      <Card padding="sm" className="bg-gray-50 dark:bg-gray-700/50">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Then assign to:
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={[
              { value: '', label: 'No category change' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <Select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={[
              { value: '', label: 'No project' },
              ...projects.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
        </div>
      </Card>

      {/* Options */}
      <div className="flex items-center gap-6">
        <Input
          label="Priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          hint="Higher priority rules are checked first"
          className="w-24"
        />

        <Toggle checked={isEnabled} onChange={setIsEnabled} label="Rule enabled" />
      </div>

      {/* Preview */}
      <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm">
        <p className="text-primary-800 dark:text-primary-300">
          <strong>Rule preview:</strong> If{' '}
          <span className="font-mono bg-primary-100 dark:bg-primary-800/30 px-1 rounded">
            {field}
          </span>{' '}
          {operator}{' '}
          <span className="font-mono bg-primary-100 dark:bg-primary-800/30 px-1 rounded">
            &quot;{value || '...'}&quot;
          </span>
          {categoryId && (
            <>
              {' '}
              then categorize as{' '}
              <span className="font-semibold">
                {categories.find((c) => c.id === categoryId)?.name}
              </span>
            </>
          )}
          {projectId && (
            <>
              {' '}
              and assign to project{' '}
              <span className="font-semibold">
                {projects.find((p) => p.id === projectId)?.name}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {rule && onDelete ? (
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
          <Button type="submit">{rule ? 'Save Rule' : 'Create Rule'}</Button>
        </div>
      </div>
    </form>
  );
}
