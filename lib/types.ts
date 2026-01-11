// Core data types for TimeVault

export interface Activity {
  id: string;
  appName: string;
  windowTitle: string;
  url?: string;
  projectId?: string;
  categoryId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  isIdle: boolean;
  isManual: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  isBillable: boolean;
  hourlyRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: 'productive' | 'neutral' | 'distraction';
  color: string;
  icon?: string;
}

export interface Rule {
  id: string;
  projectId?: string;
  categoryId?: string;
  condition: RuleCondition;
  priority: number;
  isEnabled: boolean;
  createdAt: Date;
}

export interface RuleCondition {
  field: 'appName' | 'windowTitle' | 'url';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
  caseSensitive?: boolean;
}

export interface Settings {
  trackWindowTitles: boolean;
  trackUrls: boolean;
  idleThreshold: number; // seconds
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "17:00"
  workingDays: number[]; // [1,2,3,4,5] for Mon-Fri
  theme: 'light' | 'dark' | 'system';
  pomodoroWork: number; // minutes
  pomodoroBreak: number; // minutes
  pomodoroLongBreak: number; // minutes
  notificationsEnabled: boolean;
}

export interface License {
  key: string;
  tier: 'free' | 'personal' | 'pro';
  email?: string;
  purchasedAt?: Date;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  totalTime: number; // seconds
  productiveTime: number;
  neutralTime: number;
  distractionTime: number;
  topApps: { appName: string; duration: number }[];
  topCategories: { categoryId: string; duration: number }[];
  topProjects: { projectId: string; duration: number }[];
}

export interface TimerSession {
  id: string;
  projectId?: string;
  categoryId?: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'manual' | 'pomodoro';
  pomodoroPhase?: 'work' | 'break' | 'longBreak';
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Coding', type: 'productive', color: '#22c55e', icon: 'code' },
  { name: 'Design', type: 'productive', color: '#8b5cf6', icon: 'palette' },
  { name: 'Writing', type: 'productive', color: '#06b6d4', icon: 'pencil' },
  { name: 'Communication', type: 'productive', color: '#3b82f6', icon: 'chat' },
  { name: 'Reference', type: 'neutral', color: '#f59e0b', icon: 'book' },
  { name: 'Learning', type: 'neutral', color: '#eab308', icon: 'graduation' },
  { name: 'Planning', type: 'neutral', color: '#84cc16', icon: 'calendar' },
  { name: 'Social Media', type: 'distraction', color: '#ef4444', icon: 'users' },
  { name: 'Entertainment', type: 'distraction', color: '#f97316', icon: 'play' },
  { name: 'Shopping', type: 'distraction', color: '#ec4899', icon: 'cart' },
  { name: 'Uncategorized', type: 'neutral', color: '#6b7280', icon: 'question' },
];

export const DEFAULT_SETTINGS: Settings = {
  trackWindowTitles: true,
  trackUrls: false,
  idleThreshold: 120, // 2 minutes
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  workingDays: [1, 2, 3, 4, 5],
  theme: 'system',
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  notificationsEnabled: true,
};

export const DEFAULT_LICENSE: License = {
  key: '',
  tier: 'free',
};
