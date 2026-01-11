import { Rule, Category, RuleCondition } from './types';

interface ActivityData {
  appName: string;
  windowTitle: string;
  url?: string;
}

export async function matchRules(
  activity: ActivityData,
  rules: Rule[],
  categories: Category[]
): Promise<{ categoryId: string; projectId?: string }> {
  // Sort rules by priority (higher priority first)
  const sortedRules = [...rules]
    .filter((r) => r.isEnabled)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    if (matchCondition(activity, rule.condition)) {
      return {
        categoryId: rule.categoryId || getDefaultCategoryId(categories),
        projectId: rule.projectId,
      };
    }
  }

  // Use default category matching based on common patterns
  const inferredCategory = inferCategory(activity, categories);
  return {
    categoryId: inferredCategory?.id || getDefaultCategoryId(categories),
    projectId: undefined,
  };
}

function matchCondition(activity: ActivityData, condition: RuleCondition): boolean {
  let value: string;
  switch (condition.field) {
    case 'appName':
      value = activity.appName;
      break;
    case 'windowTitle':
      value = activity.windowTitle;
      break;
    case 'url':
      value = activity.url || '';
      break;
    default:
      return false;
  }

  const searchValue = condition.caseSensitive
    ? condition.value
    : condition.value.toLowerCase();
  const targetValue = condition.caseSensitive ? value : value.toLowerCase();

  switch (condition.operator) {
    case 'contains':
      return targetValue.includes(searchValue);
    case 'equals':
      return targetValue === searchValue;
    case 'startsWith':
      return targetValue.startsWith(searchValue);
    case 'endsWith':
      return targetValue.endsWith(searchValue);
    case 'regex':
      try {
        const flags = condition.caseSensitive ? '' : 'i';
        const regex = new RegExp(condition.value, flags);
        return regex.test(value);
      } catch {
        return false;
      }
    default:
      return false;
  }
}

function getDefaultCategoryId(categories: Category[]): string {
  const uncategorized = categories.find((c) => c.name === 'Uncategorized');
  return uncategorized?.id || categories[0]?.id || '';
}

// Built-in pattern matching for common apps/sites
interface PatternMatch {
  patterns: RegExp[];
  categoryName: string;
}

const BUILTIN_PATTERNS: PatternMatch[] = [
  // Coding
  {
    patterns: [
      /vscode/i,
      /visual studio/i,
      /sublime/i,
      /atom/i,
      /intellij/i,
      /webstorm/i,
      /pycharm/i,
      /xcode/i,
      /android studio/i,
      /github\.com/i,
      /gitlab\.com/i,
      /bitbucket/i,
      /stackoverflow\.com/i,
      /codepen/i,
      /codesandbox/i,
      /replit/i,
    ],
    categoryName: 'Coding',
  },
  // Design
  {
    patterns: [
      /figma/i,
      /sketch/i,
      /adobe/i,
      /photoshop/i,
      /illustrator/i,
      /canva/i,
      /invision/i,
      /dribbble/i,
      /behance/i,
    ],
    categoryName: 'Design',
  },
  // Writing
  {
    patterns: [
      /docs\.google/i,
      /notion\.so/i,
      /word/i,
      /pages/i,
      /medium\.com/i,
      /wordpress/i,
      /ghost/i,
      /grammarly/i,
      /hemingway/i,
    ],
    categoryName: 'Writing',
  },
  // Communication
  {
    patterns: [
      /slack/i,
      /discord/i,
      /teams/i,
      /zoom/i,
      /meet\.google/i,
      /skype/i,
      /webex/i,
      /mail\.google/i,
      /outlook/i,
      /messages/i,
      /telegram/i,
      /whatsapp/i,
    ],
    categoryName: 'Communication',
  },
  // Reference
  {
    patterns: [
      /wikipedia/i,
      /documentation/i,
      /docs\./i,
      /developer\.mozilla/i,
      /w3schools/i,
      /devdocs/i,
      /man page/i,
    ],
    categoryName: 'Reference',
  },
  // Learning
  {
    patterns: [
      /udemy/i,
      /coursera/i,
      /edx/i,
      /pluralsight/i,
      /linkedin learning/i,
      /skillshare/i,
      /khan academy/i,
      /codecademy/i,
      /freecodecamp/i,
      /egghead/i,
      /frontendmasters/i,
    ],
    categoryName: 'Learning',
  },
  // Planning
  {
    patterns: [
      /calendar/i,
      /trello/i,
      /asana/i,
      /jira/i,
      /monday\.com/i,
      /todoist/i,
      /notion/i,
      /airtable/i,
      /clickup/i,
      /basecamp/i,
    ],
    categoryName: 'Planning',
  },
  // Social Media (Distraction)
  {
    patterns: [
      /twitter\.com/i,
      /x\.com/i,
      /facebook\.com/i,
      /instagram\.com/i,
      /tiktok\.com/i,
      /reddit\.com/i,
      /linkedin\.com(?!\/learning)/i,
      /snapchat/i,
      /pinterest/i,
      /tumblr/i,
    ],
    categoryName: 'Social Media',
  },
  // Entertainment (Distraction)
  {
    patterns: [
      /youtube\.com/i,
      /netflix/i,
      /hulu/i,
      /disney\+/i,
      /twitch/i,
      /spotify/i,
      /apple music/i,
      /soundcloud/i,
      /hbo/i,
      /prime video/i,
      /gaming/i,
      /steam/i,
    ],
    categoryName: 'Entertainment',
  },
  // Shopping (Distraction)
  {
    patterns: [
      /amazon\.com/i,
      /ebay/i,
      /walmart/i,
      /target/i,
      /etsy/i,
      /aliexpress/i,
      /shopping/i,
      /cart/i,
      /checkout/i,
    ],
    categoryName: 'Shopping',
  },
];

function inferCategory(activity: ActivityData, categories: Category[]): Category | null {
  const searchText = `${activity.appName} ${activity.windowTitle} ${activity.url || ''}`;

  for (const pattern of BUILTIN_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(searchText)) {
        return categories.find((c) => c.name === pattern.categoryName) || null;
      }
    }
  }

  return null;
}

// Utility to create rules from UI
export function createRule(
  field: RuleCondition['field'],
  operator: RuleCondition['operator'],
  value: string,
  categoryId?: string,
  projectId?: string,
  priority: number = 0
): Omit<Rule, 'id' | 'createdAt'> {
  return {
    projectId,
    categoryId,
    condition: {
      field,
      operator,
      value,
      caseSensitive: false,
    },
    priority,
    isEnabled: true,
  };
}

// Suggest rules based on activity history
export function suggestRules(
  activities: { appName: string; windowTitle: string; url?: string }[],
  categories: Category[]
): Omit<Rule, 'id' | 'createdAt'>[] {
  const suggestions: Omit<Rule, 'id' | 'createdAt'>[] = [];
  const seen = new Set<string>();

  for (const activity of activities) {
    // Suggest app-based rules
    if (!seen.has(activity.appName)) {
      seen.add(activity.appName);
      const inferredCategory = inferCategory(activity, categories);
      if (inferredCategory) {
        suggestions.push(
          createRule('appName', 'equals', activity.appName, inferredCategory.id)
        );
      }
    }

    // Suggest domain-based rules for URLs
    if (activity.url) {
      try {
        const url = new URL(activity.url);
        const domain = url.hostname;
        if (!seen.has(domain)) {
          seen.add(domain);
          const inferredCategory = inferCategory(activity, categories);
          if (inferredCategory) {
            suggestions.push(createRule('url', 'contains', domain, inferredCategory.id));
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }
  }

  return suggestions;
}

// Validate rule condition
export function validateRuleCondition(condition: RuleCondition): string | null {
  if (!condition.value || condition.value.trim() === '') {
    return 'Value cannot be empty';
  }

  if (condition.operator === 'regex') {
    try {
      new RegExp(condition.value);
    } catch {
      return 'Invalid regular expression';
    }
  }

  return null;
}

// Test rule against sample data
export function testRule(
  rule: Omit<Rule, 'id' | 'createdAt'>,
  testData: ActivityData[]
): { matched: ActivityData[]; unmatched: ActivityData[] } {
  const matched: ActivityData[] = [];
  const unmatched: ActivityData[] = [];

  for (const data of testData) {
    if (matchCondition(data, rule.condition)) {
      matched.push(data);
    } else {
      unmatched.push(data);
    }
  }

  return { matched, unmatched };
}
