'use client';

import React, { useState } from 'react';
import { Card, Button, Modal, Input, Select, Badge } from '@/components/ui';
import { Category } from '@/lib/types';

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Omit<Category, 'id'>) => Promise<string> | Promise<void>;
  onEdit: (id: string, updates: Partial<Category>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export function CategoryManager({ categories, onAdd, onEdit, onDelete }: CategoryManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<Category['type']>('neutral');
  const [color, setColor] = useState(COLORS[0]);

  const handleOpenAdd = () => {
    setName('');
    setType('neutral');
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setName(category.name);
    setType(category.type);
    setColor(category.color);
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editingCategory) {
      await onEdit(editingCategory.id, { name: name.trim(), type, color });
    } else {
      await onAdd({ name: name.trim(), type, color });
    }
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    if (editingCategory) {
      await onDelete(editingCategory.id);
      setIsFormOpen(false);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const typeOrder = { productive: 0, neutral: 1, distraction: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
          <Button size="sm" onClick={handleOpenAdd}>
            Add Category
          </Button>
        </div>

        <div className="space-y-2">
          {sortedCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleOpenEdit(category)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
              </div>
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
                {category.type}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Design"
            autoFocus
          />

          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as Category['type'])}
            options={[
              { value: 'productive', label: 'Productive' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'distraction', label: 'Distraction' },
            ]}
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

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {editingCategory ? (
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!name.trim()}>
                {editingCategory ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
