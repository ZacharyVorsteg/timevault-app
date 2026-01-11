'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Activity } from '@/lib/types';
import {
  startTracking as startTrackingLib,
  stopTracking as stopTrackingLib,
  getCurrentActivity,
  isTracking as isTrackingLib,
  isIdle as isIdleLib,
  setActivityUpdateCallback,
  setIdleChangeCallback,
  startTitleObserver,
  stopTitleObserver,
  startManualTimer as startManualTimerLib,
  stopManualTimer as stopManualTimerLib,
  getManualTimerState,
  setTimerUpdateCallback,
  startPomodoro as startPomodoroLib,
  stopPomodoro as stopPomodoroLib,
  getPomodoroState,
  setPomodoroCallbacks,
  skipPomodoroPhase as skipPomodoroPhaseLib,
} from '@/lib/tracking';
import { useDatabase } from './DatabaseProvider';

interface TrackingContextValue {
  // Auto tracking
  isTracking: boolean;
  isIdle: boolean;
  currentActivity: Activity | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;

  // Manual timer
  isTimerRunning: boolean;
  timerElapsed: number;
  timerProjectId?: string;
  timerCategoryId?: string;
  timerDescription?: string;
  startTimer: (projectId?: string, categoryId?: string, description?: string) => void;
  stopTimer: () => Promise<Activity | null>;

  // Pomodoro
  isPomodoroRunning: boolean;
  pomodoroPhase: 'work' | 'break' | 'longBreak';
  pomodoroRemaining: number;
  pomodoroCycleCount: number;
  startPomodoro: (projectId?: string) => Promise<void>;
  stopPomodoro: () => void;
  skipPhase: () => void;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}

interface TrackingProviderProps {
  children: React.ReactNode;
}

export function TrackingProvider({ children }: TrackingProviderProps) {
  const { refreshTodayActivities, settings } = useDatabase();

  // Auto tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  // Manual timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerProjectId, setTimerProjectId] = useState<string | undefined>();
  const [timerCategoryId, setTimerCategoryId] = useState<string | undefined>();
  const [timerDescription, setTimerDescription] = useState<string | undefined>();

  // Pomodoro state
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'break' | 'longBreak'>('work');
  const [pomodoroRemaining, setPomodoroRemaining] = useState(0);
  const [pomodoroCycleCount, setPomodoroCycleCount] = useState(0);

  const notificationRef = useRef<boolean>(false);

  // Set up callbacks on mount
  useEffect(() => {
    setActivityUpdateCallback((activity) => {
      setCurrentActivity(activity);
    });

    setIdleChangeCallback((idle) => {
      setIsIdle(idle);
    });

    setTimerUpdateCallback((elapsed) => {
      setTimerElapsed(elapsed);
    });

    setPomodoroCallbacks(
      (state, remaining) => {
        setIsPomodoroRunning(state.isRunning);
        setPomodoroPhase(state.phase);
        setPomodoroRemaining(remaining);
        setPomodoroCycleCount(state.cycleCount);
      },
      (phase) => {
        // Phase completed - show notification
        if (settings.notificationsEnabled && notificationRef.current) {
          const messages = {
            work: 'Work session complete! Take a break.',
            break: 'Break over! Ready to focus?',
            longBreak: 'Long break over! Ready to get back to work?',
          };

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('TimeVault', {
              body: messages[phase],
              icon: '/icon-192.png',
            });
          }
        }
        refreshTodayActivities();
      }
    );

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        notificationRef.current = permission === 'granted';
      });
    } else if ('Notification' in window) {
      notificationRef.current = Notification.permission === 'granted';
    }

    return () => {
      stopTrackingLib();
      stopTitleObserver();
    };
  }, [refreshTodayActivities, settings.notificationsEnabled]);

  // Auto tracking
  const startTracking = useCallback(async () => {
    await startTrackingLib();
    startTitleObserver();
    setIsTracking(true);
    setCurrentActivity(getCurrentActivity());
    setIsIdle(isIdleLib());
  }, []);

  const stopTracking = useCallback(async () => {
    await stopTrackingLib();
    stopTitleObserver();
    setIsTracking(false);
    setCurrentActivity(null);
    setIsIdle(false);
    await refreshTodayActivities();
  }, [refreshTodayActivities]);

  // Manual timer
  const startTimer = useCallback(
    (projectId?: string, categoryId?: string, description?: string) => {
      setTimerProjectId(projectId);
      setTimerCategoryId(categoryId);
      setTimerDescription(description);
      startManualTimerLib(projectId, categoryId, description);
      setIsTimerRunning(true);
      setTimerElapsed(0);
    },
    []
  );

  const stopTimer = useCallback(async () => {
    const activity = await stopManualTimerLib();
    setIsTimerRunning(false);
    setTimerElapsed(0);
    setTimerProjectId(undefined);
    setTimerCategoryId(undefined);
    setTimerDescription(undefined);
    await refreshTodayActivities();
    return activity;
  }, [refreshTodayActivities]);

  // Pomodoro
  const startPomodoro = useCallback(async (projectId?: string) => {
    await startPomodoroLib(projectId);
    setIsPomodoroRunning(true);
    const state = getPomodoroState();
    setPomodoroPhase(state.phase);
    setPomodoroCycleCount(state.cycleCount);
  }, []);

  const stopPomodoro = useCallback(() => {
    stopPomodoroLib();
    setIsPomodoroRunning(false);
    setPomodoroPhase('work');
    setPomodoroRemaining(0);
    setPomodoroCycleCount(0);
  }, []);

  const skipPhase = useCallback(() => {
    skipPomodoroPhaseLib();
  }, []);

  // Restore timer state on mount
  useEffect(() => {
    const timerState = getManualTimerState();
    if (timerState.isRunning && timerState.startTime) {
      setIsTimerRunning(true);
      setTimerProjectId(timerState.projectId);
      setTimerCategoryId(timerState.categoryId);
      setTimerDescription(timerState.description);
    }

    const pomodoroState = getPomodoroState();
    if (pomodoroState.isRunning) {
      setIsPomodoroRunning(true);
      setPomodoroPhase(pomodoroState.phase);
      setPomodoroCycleCount(pomodoroState.cycleCount);
    }
  }, []);

  const value: TrackingContextValue = {
    isTracking,
    isIdle,
    currentActivity,
    startTracking,
    stopTracking,
    isTimerRunning,
    timerElapsed,
    timerProjectId,
    timerCategoryId,
    timerDescription,
    startTimer,
    stopTimer,
    isPomodoroRunning,
    pomodoroPhase,
    pomodoroRemaining,
    pomodoroCycleCount,
    startPomodoro,
    stopPomodoro,
    skipPhase,
  };

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}
