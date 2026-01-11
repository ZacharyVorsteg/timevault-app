import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import {
  Activity,
  Project,
  Category,
  Rule,
  Settings,
  License,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  DEFAULT_LICENSE,
} from './types';

interface TimeVaultDB extends DBSchema {
  activities: {
    key: string;
    value: Activity;
    indexes: {
      'by-date': Date;
      'by-project': string;
      'by-category': string;
    };
  };
  projects: {
    key: string;
    value: Project;
  };
  categories: {
    key: string;
    value: Category;
  };
  rules: {
    key: string;
    value: Rule;
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
  license: {
    key: string;
    value: License;
  };
}

const DB_NAME = 'timevault';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<TimeVaultDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<TimeVaultDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<TimeVaultDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Activities store
      if (!db.objectStoreNames.contains('activities')) {
        const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
        activityStore.createIndex('by-date', 'startTime');
        activityStore.createIndex('by-project', 'projectId');
        activityStore.createIndex('by-category', 'categoryId');
      }

      // Projects store
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }

      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }

      // Rules store
      if (!db.objectStoreNames.contains('rules')) {
        db.createObjectStore('rules', { keyPath: 'id' });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // License store
      if (!db.objectStoreNames.contains('license')) {
        db.createObjectStore('license', { keyPath: 'key' });
      }
    },
  });

  // Initialize default data if needed
  await initializeDefaults(dbInstance);

  return dbInstance;
}

async function initializeDefaults(db: IDBPDatabase<TimeVaultDB>) {
  // Initialize categories
  const existingCategories = await db.getAll('categories');
  if (existingCategories.length === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await db.put('categories', { ...cat, id: uuidv4() });
    }
  }

  // Initialize settings
  const existingSettings = await db.getAll('settings');
  if (existingSettings.length === 0) {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.put('settings', { key, value });
    }
  }

  // Initialize license
  const existingLicense = await db.get('license', 'default');
  if (!existingLicense) {
    await db.put('license', { ...DEFAULT_LICENSE, key: 'default' });
  }
}

// Activity operations
export async function addActivity(activity: Omit<Activity, 'id'>): Promise<string> {
  const db = await getDB();
  const id = uuidv4();
  await db.put('activities', { ...activity, id });
  return id;
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
  const db = await getDB();
  const activity = await db.get('activities', id);
  if (activity) {
    await db.put('activities', { ...activity, ...updates });
  }
}

export async function getActivity(id: string): Promise<Activity | undefined> {
  const db = await getDB();
  return db.get('activities', id);
}

export async function getActivitiesByDateRange(start: Date, end: Date): Promise<Activity[]> {
  const db = await getDB();
  const activities = await db.getAllFromIndex('activities', 'by-date', IDBKeyRange.bound(start, end));
  return activities;
}

export async function getTodayActivities(): Promise<Activity[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  return getActivitiesByDateRange(startOfDay, endOfDay);
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('activities', id);
}

export async function deleteAllActivities(): Promise<void> {
  const db = await getDB();
  await db.clear('activities');
}

// Project operations
export async function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = await getDB();
  const id = uuidv4();
  const now = new Date();
  await db.put('projects', { ...project, id, createdAt: now, updatedAt: now });
  return id;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const db = await getDB();
  const project = await db.get('projects', id);
  if (project) {
    await db.put('projects', { ...project, ...updates, updatedAt: new Date() });
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB();
  return db.getAll('projects');
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', id);
}

// Category operations
export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  const db = await getDB();
  const id = uuidv4();
  await db.put('categories', { ...category, id });
  return id;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const db = await getDB();
  const category = await db.get('categories', id);
  if (category) {
    await db.put('categories', { ...category, ...updates });
  }
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const db = await getDB();
  return db.get('categories', id);
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll('categories');
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('categories', id);
}

// Rule operations
export async function addRule(rule: Omit<Rule, 'id' | 'createdAt'>): Promise<string> {
  const db = await getDB();
  const id = uuidv4();
  await db.put('rules', { ...rule, id, createdAt: new Date() });
  return id;
}

export async function updateRule(id: string, updates: Partial<Rule>): Promise<void> {
  const db = await getDB();
  const rule = await db.get('rules', id);
  if (rule) {
    await db.put('rules', { ...rule, ...updates });
  }
}

export async function getRule(id: string): Promise<Rule | undefined> {
  const db = await getDB();
  return db.get('rules', id);
}

export async function getAllRules(): Promise<Rule[]> {
  const db = await getDB();
  return db.getAll('rules');
}

export async function deleteRule(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('rules', id);
}

// Settings operations
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const setting = await db.get('settings', key);
  return setting?.value as T | undefined;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', { key, value });
}

export async function getAllSettings(): Promise<Settings> {
  const db = await getDB();
  const settings = await db.getAll('settings');
  const result: Record<string, unknown> = {};
  for (const { key, value } of settings) {
    result[key] = value;
  }
  return { ...DEFAULT_SETTINGS, ...result } as Settings;
}

// License operations
export async function getLicense(): Promise<License> {
  const db = await getDB();
  const license = await db.get('license', 'default');
  return license || DEFAULT_LICENSE;
}

export async function setLicense(license: Omit<License, 'key'>): Promise<void> {
  const db = await getDB();
  await db.put('license', { ...license, key: 'default' });
}

// Export/Import operations
export async function exportAllData(): Promise<{
  activities: Activity[];
  projects: Project[];
  categories: Category[];
  rules: Rule[];
  settings: Settings;
}> {
  const db = await getDB();
  return {
    activities: await db.getAll('activities'),
    projects: await db.getAll('projects'),
    categories: await db.getAll('categories'),
    rules: await db.getAll('rules'),
    settings: await getAllSettings(),
  };
}

export async function importData(data: {
  activities?: Activity[];
  projects?: Project[];
  categories?: Category[];
  rules?: Rule[];
  settings?: Partial<Settings>;
}): Promise<void> {
  const db = await getDB();

  if (data.activities) {
    for (const activity of data.activities) {
      await db.put('activities', activity);
    }
  }

  if (data.projects) {
    for (const project of data.projects) {
      await db.put('projects', project);
    }
  }

  if (data.categories) {
    for (const category of data.categories) {
      await db.put('categories', category);
    }
  }

  if (data.rules) {
    for (const rule of data.rules) {
      await db.put('rules', rule);
    }
  }

  if (data.settings) {
    for (const [key, value] of Object.entries(data.settings)) {
      await db.put('settings', { key, value });
    }
  }
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('activities');
  await db.clear('projects');
  await db.clear('categories');
  await db.clear('rules');
  await db.clear('settings');
  // Re-initialize defaults
  await initializeDefaults(db);
}
