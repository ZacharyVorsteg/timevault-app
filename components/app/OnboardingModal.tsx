'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

const ONBOARDING_STORAGE_KEY = 'timevault-onboarding-completed';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to TimeVault',
    description: 'Your time tracking data stays exactly where it belongs - on your device.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    highlights: [
      'No account required - just start tracking',
      'All data stored locally in your browser',
      'Zero data collection, zero tracking',
      'Works offline, always available',
    ],
  },
  {
    title: 'Track Your Time',
    description: 'Flexible time tracking that adapts to how you work.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    highlights: [
      'Manual timer for focused work sessions',
      'Automatic tracking detects your active apps',
      'Categorize time as productive, neutral, or distraction',
      'Pomodoro timer built-in for focused intervals',
    ],
  },
  {
    title: 'Projects & Rules',
    description: 'Organize your time by project and automate categorization.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
    highlights: [
      'Create projects to group related activities',
      'Set hourly rates for billable tracking',
      'Build rules to auto-assign apps to projects',
      'Track time goals and budgets per project',
    ],
  },
  {
    title: 'Export & Reports',
    description: 'Generate professional reports and invoices from your data.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    highlights: [
      'Export detailed CSV reports by date range',
      'Generate PDF invoices for clients',
      'View productivity trends and insights',
      'Backup and restore your complete database',
    ],
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!hasCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all animate-slide-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium transition-colors"
          >
            Skip
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                {step.icon}
              </div>
            </div>

            {/* Title and description */}
            <div className="text-center mb-8">
              <h2
                id="onboarding-title"
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {step.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-primary-600 dark:text-primary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-primary-600 dark:bg-primary-400'
                      : index < currentStep
                        ? 'bg-primary-400 dark:bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button variant="ghost" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {isLastStep ? (
                <Button variant="primary" onClick={handleComplete} className="flex-1">
                  Start Tracking
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNext} className="flex-1">
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Privacy footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Your data never leaves this device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
}
