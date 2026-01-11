'use client';

import React, { useState } from 'react';
import { Card, Button, Select, Input } from '@/components/ui';
import { useTracking, useDatabase } from '@/components/providers';
import { useToast } from '@/contexts/ToastContext';
import { formatDuration } from '@/lib/export';

type TimerMode = 'manual' | 'pomodoro';

export function ManualTimer() {
  const {
    isTimerRunning,
    timerElapsed,
    startTimer,
    stopTimer,
    isPomodoroRunning,
    pomodoroPhase,
    pomodoroRemaining,
    pomodoroCycleCount,
    startPomodoro,
    stopPomodoro,
    skipPhase,
  } = useTracking();
  const { projects, categories, settings } = useDatabase();
  const { toast } = useToast();

  const [mode, setMode] = useState<TimerMode>('manual');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleStartManual = () => {
    startTimer(
      selectedProject || undefined,
      selectedCategory || undefined,
      description || undefined
    );
    toast.success('Timer started');
  };

  const handleStopManual = async () => {
    await stopTimer();
    setDescription('');
    toast.success('Timer stopped');
  };

  const handleStartPomodoro = async () => {
    await startPomodoro(selectedProject || undefined);
    toast.success('Timer started');
  };

  const formatPomodoroTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPomodoroPhaseLabel = () => {
    switch (pomodoroPhase) {
      case 'work':
        return 'Work Session';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const getPomodoroPhaseColor = () => {
    switch (pomodoroPhase) {
      case 'work':
        return 'text-productive';
      case 'break':
      case 'longBreak':
        return 'text-primary-500';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timer</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setMode('manual')}
          >
            Manual
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              mode === 'pomodoro'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setMode('pomodoro')}
          >
            Pomodoro
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <div className="space-y-4">
          {/* Timer display */}
          <div className="text-center py-6">
            <p className="text-5xl font-bold text-gray-900 dark:text-white timer-display">
              {formatDuration(timerElapsed)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isTimerRunning ? 'Timer running' : 'Ready to start'}
            </p>
          </div>

          {/* Options */}
          {!isTimerRunning && (
            <>
              <Input
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
              />

              <Select
                label="Project (optional)"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                options={[
                  { value: '', label: 'No project' },
                  ...projects.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />

              <Select
                label="Category (optional)"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: '', label: 'Auto-detect' },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </>
          )}

          {/* Controls */}
          <div className="flex justify-center">
            {isTimerRunning ? (
              <Button onClick={handleStopManual} variant="danger" size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="6" y="6" width="8" height="8" rx="1" />
                </svg>
                Stop Timer
              </Button>
            ) : (
              <Button onClick={handleStartManual} size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Timer
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pomodoro display */}
          <div className="text-center py-6">
            <p className={`text-5xl font-bold timer-display ${getPomodoroPhaseColor()}`}>
              {isPomodoroRunning
                ? formatPomodoroTime(pomodoroRemaining)
                : formatPomodoroTime(
                    pomodoroPhase === 'work'
                      ? settings.pomodoroWork * 60
                      : pomodoroPhase === 'break'
                      ? settings.pomodoroBreak * 60
                      : settings.pomodoroLongBreak * 60
                  )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {getPomodoroPhaseLabel()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Cycle {pomodoroCycleCount + 1}
            </p>
          </div>

          {/* Pomodoro info */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-gray-500 dark:text-gray-400">Work</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {settings.pomodoroWork}m
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-gray-500 dark:text-gray-400">Break</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {settings.pomodoroBreak}m
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-gray-500 dark:text-gray-400">Long</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {settings.pomodoroLongBreak}m
              </p>
            </div>
          </div>

          {/* Project selection */}
          {!isPomodoroRunning && (
            <Select
              label="Project (optional)"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              options={[
                { value: '', label: 'No project' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          )}

          {/* Controls */}
          <div className="flex justify-center gap-2">
            {isPomodoroRunning ? (
              <>
                <Button onClick={skipPhase} variant="secondary">
                  Skip
                </Button>
                <Button onClick={stopPomodoro} variant="danger">
                  Stop
                </Button>
              </>
            ) : (
              <Button onClick={handleStartPomodoro} size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Start {pomodoroPhase === 'work' ? 'Work' : 'Break'}
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
