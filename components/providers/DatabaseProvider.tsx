'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Project,
  Category,
  Rule,
  Settings,
  License,
  DEFAULT_SETTINGS,
  DEFAULT_LICENSE,
} from '@/lib/types';
import {
  getDB,
  getAllProjects,
  getAllCategories,
  getAllRules,
  getAllSettings,
  getLicense,
  addProject,
  updateProject,
  deleteProject,
  addCategory,
  updateCategory,
  deleteCategory,
  addRule,
  updateRule,
  deleteRule,
  setSetting,
  setLicense,
  getTodayActivities,
  getActivitiesByDateRange,
  addActivity,
  updateActivity as updateActivityDB,
  deleteActivity,
  exportAllData,
  importData,
  clearAllData,
} from '@/lib/db';

interface DatabaseContextValue {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;

  // Data
  projects: Project[];
  categories: Category[];
  rules: Rule[];
  settings: Settings;
  license: License;
  todayActivities: Activity[];

  // Project operations
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  editProject: (id: string, updates: Partial<Project>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;

  // Category operations
  createCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  editCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  // Rule operations
  createRule: (rule: Omit<Rule, 'id' | 'createdAt'>) => Promise<string>;
  editRule: (id: string, updates: Partial<Rule>) => Promise<void>;
  removeRule: (id: string) => Promise<void>;

  // Settings operations
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;

  // License operations
  updateLicense: (license: Omit<License, 'key'>) => Promise<void>;

  // Activity operations
  getActivities: (start: Date, end: Date) => Promise<Activity[]>;
  logActivity: (activity: Omit<Activity, 'id'>) => Promise<string>;
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  refreshTodayActivities: () => Promise<void>;

  // Data management
  exportData: () => Promise<string>;
  importDataFromJSON: (json: string) => Promise<void>;
  clearData: () => Promise<void>;

  // Refresh
  refresh: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [license, setLicenseState] = useState<License>(DEFAULT_LICENSE);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await getDB(); // Initialize DB

      const [loadedProjects, loadedCategories, loadedRules, loadedSettings, loadedLicense, loadedToday] =
        await Promise.all([
          getAllProjects(),
          getAllCategories(),
          getAllRules(),
          getAllSettings(),
          getLicense(),
          getTodayActivities(),
        ]);

      setProjects(loadedProjects);
      setCategories(loadedCategories);
      setRules(loadedRules);
      setSettings(loadedSettings);
      setLicenseState(loadedLicense);
      setTodayActivities(loadedToday);
      setIsReady(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize database'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Project operations
  const createProject = useCallback(
    async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = await addProject(project);
      setProjects(await getAllProjects());
      return id;
    },
    []
  );

  const editProject = useCallback(async (id: string, updates: Partial<Project>) => {
    await updateProject(id, updates);
    setProjects(await getAllProjects());
  }, []);

  const removeProject = useCallback(async (id: string) => {
    await deleteProject(id);
    setProjects(await getAllProjects());
  }, []);

  // Category operations
  const createCategory = useCallback(async (category: Omit<Category, 'id'>) => {
    const id = await addCategory(category);
    setCategories(await getAllCategories());
    return id;
  }, []);

  const editCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    await updateCategory(id, updates);
    setCategories(await getAllCategories());
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    await deleteCategory(id);
    setCategories(await getAllCategories());
  }, []);

  // Rule operations
  const createRule = useCallback(async (rule: Omit<Rule, 'id' | 'createdAt'>) => {
    const id = await addRule(rule);
    setRules(await getAllRules());
    return id;
  }, []);

  const editRule = useCallback(async (id: string, updates: Partial<Rule>) => {
    await updateRule(id, updates);
    setRules(await getAllRules());
  }, []);

  const removeRule = useCallback(async (id: string) => {
    await deleteRule(id);
    setRules(await getAllRules());
  }, []);

  // Settings operations
  const updateSetting = useCallback(
    async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      await setSetting(key, value);
      setSettings(await getAllSettings());
    },
    []
  );

  // License operations
  const updateLicense = useCallback(async (newLicense: Omit<License, 'key'>) => {
    await setLicense(newLicense);
    setLicenseState(await getLicense());
  }, []);

  // Activity operations
  const getActivities = useCallback(async (start: Date, end: Date) => {
    return getActivitiesByDateRange(start, end);
  }, []);

  const logActivity = useCallback(async (activity: Omit<Activity, 'id'>) => {
    const id = await addActivity(activity);
    setTodayActivities(await getTodayActivities());
    return id;
  }, []);

  const updateActivityFn = useCallback(async (id: string, updates: Partial<Activity>) => {
    await updateActivityDB(id, updates);
    setTodayActivities(await getTodayActivities());
  }, []);

  const removeActivity = useCallback(async (id: string) => {
    await deleteActivity(id);
    setTodayActivities(await getTodayActivities());
  }, []);

  const refreshTodayActivities = useCallback(async () => {
    setTodayActivities(await getTodayActivities());
  }, []);

  // Data management
  const exportDataFn = useCallback(async () => {
    const data = await exportAllData();
    return JSON.stringify(data, null, 2);
  }, []);

  const importDataFromJSON = useCallback(async (json: string) => {
    const data = JSON.parse(json);
    await importData(data);
    await loadAllData();
  }, [loadAllData]);

  const clearData = useCallback(async () => {
    await clearAllData();
    await loadAllData();
  }, [loadAllData]);

  const value: DatabaseContextValue = {
    isReady,
    isLoading,
    error,
    projects,
    categories,
    rules,
    settings,
    license,
    todayActivities,
    createProject,
    editProject,
    removeProject,
    createCategory,
    editCategory,
    removeCategory,
    createRule,
    editRule,
    removeRule,
    updateSetting,
    updateLicense,
    getActivities,
    logActivity,
    updateActivity: updateActivityFn,
    removeActivity,
    refreshTodayActivities,
    exportData: exportDataFn,
    importDataFromJSON,
    clearData,
    refresh: loadAllData,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}
