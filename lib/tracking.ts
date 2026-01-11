import { v4 as uuidv4 } from 'uuid';
import { Activity, Settings } from './types';
import { addActivity, updateActivity, getAllSettings, getAllRules, getAllCategories } from './db';
import { matchRules } from './rules';

interface TrackingState {
  currentActivity: Activity | null;
  isIdle: boolean;
  isTracking: boolean;
  lastActivityTime: number;
}

let state: TrackingState = {
  currentActivity: null,
  isIdle: false,
  isTracking: false,
  lastActivityTime: Date.now(),
};

let idleTimer: NodeJS.Timeout | null = null;
let updateInterval: NodeJS.Timeout | null = null;
let settings: Settings | null = null;
let onActivityUpdate: ((activity: Activity | null) => void) | null = null;
let onIdleChange: ((isIdle: boolean) => void) | null = null;

export function setActivityUpdateCallback(callback: (activity: Activity | null) => void) {
  onActivityUpdate = callback;
}

export function setIdleChangeCallback(callback: (isIdle: boolean) => void) {
  onIdleChange = callback;
}

export function getCurrentActivity(): Activity | null {
  return state.currentActivity;
}

export function isTracking(): boolean {
  return state.isTracking;
}

export function isIdle(): boolean {
  return state.isIdle;
}

async function loadSettings(): Promise<Settings> {
  if (!settings) {
    settings = await getAllSettings();
  }
  return settings;
}

export async function startTracking(): Promise<void> {
  if (state.isTracking) return;

  state.isTracking = true;
  settings = await loadSettings();

  // Set up idle detection
  setupIdleDetection();

  // Set up visibility change listener
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // Start tracking current tab
  await trackCurrentPage();

  // Set up periodic duration updates
  updateInterval = setInterval(() => {
    if (state.currentActivity && !state.isIdle) {
      state.currentActivity.duration = Math.floor(
        (Date.now() - new Date(state.currentActivity.startTime).getTime()) / 1000
      );
      onActivityUpdate?.(state.currentActivity);
    }
  }, 1000);
}

export async function stopTracking(): Promise<void> {
  if (!state.isTracking) return;

  state.isTracking = false;

  // Clean up listeners
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((event) => {
      document.removeEventListener(event, resetIdleTimer);
    });
  }

  // Clear timers
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  // Finalize current activity
  await endCurrentActivity();
}

function setupIdleDetection(): void {
  if (typeof document === 'undefined') return;

  const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
  events.forEach((event) => {
    document.addEventListener(event, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
}

function resetIdleTimer(): void {
  state.lastActivityTime = Date.now();

  if (state.isIdle) {
    state.isIdle = false;
    onIdleChange?.(false);
    // Resume tracking after idle
    if (state.currentActivity) {
      trackCurrentPage();
    }
  }

  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  if (settings) {
    idleTimer = setTimeout(() => {
      markIdle();
    }, settings.idleThreshold * 1000);
  }
}

async function markIdle(): Promise<void> {
  if (state.isIdle) return;

  state.isIdle = true;
  onIdleChange?.(true);

  // End current activity when going idle
  await endCurrentActivity();
}

async function handleVisibilityChange(): Promise<void> {
  if (!state.isTracking) return;

  if (document.visibilityState === 'visible') {
    // Tab became visible - start tracking
    await trackCurrentPage();
  } else {
    // Tab became hidden - end current activity
    await endCurrentActivity();
  }
}

async function trackCurrentPage(): Promise<void> {
  if (!state.isTracking || state.isIdle) return;
  if (typeof document === 'undefined') return;

  const appName = getBrowserName();
  const windowTitle = document.title;
  const url = window.location.href;

  // Check if this is the same activity
  if (
    state.currentActivity &&
    state.currentActivity.appName === appName &&
    state.currentActivity.windowTitle === windowTitle &&
    state.currentActivity.url === url
  ) {
    return; // Same activity, don't create new
  }

  // End previous activity
  await endCurrentActivity();

  // Match rules to get category
  const rules = await getAllRules();
  const categories = await getAllCategories();
  const settings = await loadSettings();

  const { categoryId, projectId } = await matchRules(
    { appName, windowTitle, url },
    rules,
    categories
  );

  // Start new activity
  const activity: Activity = {
    id: uuidv4(),
    appName,
    windowTitle: settings.trackWindowTitles ? windowTitle : '',
    url: settings.trackUrls ? url : undefined,
    projectId,
    categoryId,
    startTime: new Date(),
    duration: 0,
    isIdle: false,
    isManual: false,
  };

  state.currentActivity = activity;
  onActivityUpdate?.(activity);
}

async function endCurrentActivity(): Promise<void> {
  if (!state.currentActivity) return;

  const activity = state.currentActivity;
  activity.endTime = new Date();
  activity.duration = Math.floor(
    (activity.endTime.getTime() - new Date(activity.startTime).getTime()) / 1000
  );

  // Only save if duration > 5 seconds
  if (activity.duration >= 5) {
    await addActivity(activity);
  }

  state.currentActivity = null;
  onActivityUpdate?.(null);
}

function getBrowserName(): string {
  if (typeof navigator === 'undefined') return 'Unknown';

  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Browser';
}

// Title observer for detecting page changes
let titleObserver: MutationObserver | null = null;

export function startTitleObserver(): void {
  if (typeof document === 'undefined') return;
  if (titleObserver) return;

  const titleElement = document.querySelector('title');
  if (!titleElement) return;

  titleObserver = new MutationObserver(() => {
    if (state.isTracking && !state.isIdle) {
      trackCurrentPage();
    }
  });

  titleObserver.observe(titleElement, { childList: true });
}

export function stopTitleObserver(): void {
  if (titleObserver) {
    titleObserver.disconnect();
    titleObserver = null;
  }
}

// Manual timer functions
interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  projectId?: string;
  categoryId?: string;
  description?: string;
}

let manualTimer: TimerState = {
  isRunning: false,
  startTime: null,
};

let timerInterval: NodeJS.Timeout | null = null;
let onTimerUpdate: ((elapsed: number) => void) | null = null;

export function setTimerUpdateCallback(callback: (elapsed: number) => void) {
  onTimerUpdate = callback;
}

export function startManualTimer(
  projectId?: string,
  categoryId?: string,
  description?: string
): void {
  if (manualTimer.isRunning) return;

  manualTimer = {
    isRunning: true,
    startTime: new Date(),
    projectId,
    categoryId,
    description,
  };

  timerInterval = setInterval(() => {
    if (manualTimer.startTime) {
      const elapsed = Math.floor((Date.now() - manualTimer.startTime.getTime()) / 1000);
      onTimerUpdate?.(elapsed);
    }
  }, 1000);
}

export async function stopManualTimer(): Promise<Activity | null> {
  if (!manualTimer.isRunning || !manualTimer.startTime) return null;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const endTime = new Date();
  const duration = Math.floor((endTime.getTime() - manualTimer.startTime.getTime()) / 1000);

  // Get default category if not set
  const categories = await getAllCategories();
  const defaultCategory = categories.find((c) => c.name === 'Uncategorized');

  const activity: Activity = {
    id: uuidv4(),
    appName: 'Manual Timer',
    windowTitle: manualTimer.description || 'Manual Entry',
    projectId: manualTimer.projectId,
    categoryId: manualTimer.categoryId || defaultCategory?.id || '',
    startTime: manualTimer.startTime,
    endTime,
    duration,
    isIdle: false,
    isManual: true,
  };

  // Save if duration > 0
  if (duration > 0) {
    await addActivity(activity);
  }

  manualTimer = {
    isRunning: false,
    startTime: null,
  };

  return activity;
}

export function getManualTimerState(): TimerState {
  return { ...manualTimer };
}

// Pomodoro functions
interface PomodoroState {
  isRunning: boolean;
  phase: 'work' | 'break' | 'longBreak';
  cycleCount: number;
  startTime: Date | null;
  endTime: Date | null;
  projectId?: string;
}

let pomodoroState: PomodoroState = {
  isRunning: false,
  phase: 'work',
  cycleCount: 0,
  startTime: null,
  endTime: null,
};

let pomodoroInterval: NodeJS.Timeout | null = null;
let onPomodoroUpdate: ((state: PomodoroState, remaining: number) => void) | null = null;
let onPomodoroComplete: ((phase: 'work' | 'break' | 'longBreak') => void) | null = null;

export function setPomodoroCallbacks(
  onUpdate: (state: PomodoroState, remaining: number) => void,
  onComplete: (phase: 'work' | 'break' | 'longBreak') => void
) {
  onPomodoroUpdate = onUpdate;
  onPomodoroComplete = onComplete;
}

export async function startPomodoro(projectId?: string): Promise<void> {
  if (pomodoroState.isRunning) return;

  const settings = await loadSettings();
  const duration =
    pomodoroState.phase === 'work'
      ? settings.pomodoroWork
      : pomodoroState.phase === 'break'
      ? settings.pomodoroBreak
      : settings.pomodoroLongBreak;

  const now = new Date();
  pomodoroState = {
    ...pomodoroState,
    isRunning: true,
    startTime: now,
    endTime: new Date(now.getTime() + duration * 60 * 1000),
    projectId,
  };

  pomodoroInterval = setInterval(() => {
    if (pomodoroState.endTime) {
      const remaining = Math.max(
        0,
        Math.floor((pomodoroState.endTime.getTime() - Date.now()) / 1000)
      );
      onPomodoroUpdate?.(pomodoroState, remaining);

      if (remaining <= 0) {
        completePomodoroPhase();
      }
    }
  }, 1000);
}

async function completePomodoroPhase(): Promise<void> {
  if (pomodoroInterval) {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
  }

  const completedPhase = pomodoroState.phase;
  onPomodoroComplete?.(completedPhase);

  // Log work phase as activity
  if (completedPhase === 'work' && pomodoroState.startTime) {
    const categories = await getAllCategories();
    const productiveCategory = categories.find((c) => c.type === 'productive');
    const settings = await loadSettings();

    await addActivity({
      appName: 'Pomodoro',
      windowTitle: `Work Session #${pomodoroState.cycleCount + 1}`,
      projectId: pomodoroState.projectId,
      categoryId: productiveCategory?.id || '',
      startTime: pomodoroState.startTime,
      endTime: new Date(),
      duration: settings.pomodoroWork * 60,
      isIdle: false,
      isManual: true,
    });
  }

  // Determine next phase
  if (completedPhase === 'work') {
    const newCycleCount = pomodoroState.cycleCount + 1;
    const nextPhase = newCycleCount % 4 === 0 ? 'longBreak' : 'break';
    pomodoroState = {
      isRunning: false,
      phase: nextPhase,
      cycleCount: newCycleCount,
      startTime: null,
      endTime: null,
      projectId: pomodoroState.projectId,
    };
  } else {
    pomodoroState = {
      isRunning: false,
      phase: 'work',
      cycleCount: pomodoroState.cycleCount,
      startTime: null,
      endTime: null,
      projectId: pomodoroState.projectId,
    };
  }
}

export function stopPomodoro(): void {
  if (pomodoroInterval) {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
  }

  pomodoroState = {
    isRunning: false,
    phase: 'work',
    cycleCount: 0,
    startTime: null,
    endTime: null,
  };
}

export function getPomodoroState(): PomodoroState {
  return { ...pomodoroState };
}

export function skipPomodoroPhase(): void {
  if (pomodoroState.isRunning) {
    completePomodoroPhase();
  }
}
