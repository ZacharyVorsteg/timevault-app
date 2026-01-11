'use client';

import React from 'react';
import {
  CurrentActivity,
  TodaySummary,
  ActivityTimeline,
  ManualTimer,
  ProductivityPie,
  OnboardingModal,
} from '@/components/app';
import { useDatabase } from '@/components/providers';

export default function TodayPage() {
  const { isLoading, error } = useDatabase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading TimeVault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Database Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try refreshing the page or clearing your browser data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Onboarding modal for first-time users */}
      <OnboardingModal />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Privacy banner */}
      <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 flex items-center gap-3">
        <div className="shrink-0 p-2 bg-primary-600 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="text-white">
          <p className="font-medium">Your data never leaves your device.</p>
          <p className="text-sm text-gray-400">
            We can&apos;t see it. We can&apos;t sell it. That&apos;s the whole point.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Current activity and timer */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentActivity />
          <div className="grid md:grid-cols-2 gap-6">
            <ManualTimer />
            <ProductivityPie />
          </div>
          <ActivityTimeline />
        </div>

        {/* Right column - Summary */}
        <div className="space-y-6">
          <TodaySummary />
        </div>
      </div>
    </div>
  );
}
