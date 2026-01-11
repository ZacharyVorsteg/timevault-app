'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const sizes = {
    sm: { toggle: 'w-8 h-4', dot: 'w-3 h-3', translate: 'translate-x-4' },
    md: { toggle: 'w-11 h-6', dot: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { toggle: 'w-14 h-7', dot: 'w-6 h-6', translate: 'translate-x-7' },
  };

  return (
    <label className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex shrink-0 rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${sizes[size].toggle}
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full
            bg-white shadow-lg ring-0
            transform transition duration-200 ease-in-out
            ${sizes[size].dot}
            ${checked ? sizes[size].translate : 'translate-x-0.5'}
            mt-0.5
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
          )}
          {description && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
