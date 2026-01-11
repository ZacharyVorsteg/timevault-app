// Stripe utilities for one-time payments
// Note: Actual Stripe logic runs on server via API routes

export interface CheckoutOptions {
  tier: 'personal' | 'pro';
  email?: string;
}

export interface LicenseValidation {
  isValid: boolean;
  tier: 'free' | 'personal' | 'pro';
  email?: string;
  purchasedAt?: Date;
}

// Pricing info
export const PRICING = {
  personal: {
    price: 49,
    name: 'Personal',
    features: [
      'Unlimited time tracking',
      'All productivity reports',
      'CSV export',
      'Manual timer & Pomodoro',
      'Custom categories',
      'Rule-based categorization',
    ],
  },
  pro: {
    price: 79,
    name: 'Pro',
    features: [
      'Everything in Personal',
      'Unlimited projects',
      'Billable hours tracking',
      'PDF invoice generation',
      'Advanced analytics',
      'Priority support',
    ],
  },
};

// Initiate checkout
export async function createCheckoutSession(options: CheckoutOptions): Promise<string | null> {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Checkout error:', error);
    return null;
  }
}

// Verify purchase after redirect
export async function verifyPurchase(sessionId: string): Promise<LicenseValidation> {
  try {
    const response = await fetch('/api/stripe/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify purchase');
    }

    return await response.json();
  } catch (error) {
    console.error('Verification error:', error);
    return { isValid: false, tier: 'free' };
  }
}

// Generate license key (simple approach - more sophisticated in production)
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 4;
  const segmentLength = 4;

  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(segment);
  }

  return parts.join('-');
}

// Validate license key format
export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(key.toUpperCase());
}

// Feature gating based on tier
export function hasFeature(tier: 'free' | 'personal' | 'pro', feature: string): boolean {
  const features: Record<string, ('free' | 'personal' | 'pro')[]> = {
    'basic-tracking': ['free', 'personal', 'pro'],
    'today-view': ['free', 'personal', 'pro'],
    'activity-log': ['free', 'personal', 'pro'],
    'manual-timer': ['free', 'personal', 'pro'],
    'pomodoro': ['free', 'personal', 'pro'],
    'daily-summary': ['free', 'personal', 'pro'],
    'productivity-reports': ['personal', 'pro'],
    'csv-export': ['personal', 'pro'],
    'custom-categories': ['personal', 'pro'],
    'custom-rules': ['personal', 'pro'],
    'unlimited-projects': ['pro'],
    'billable-hours': ['pro'],
    'pdf-invoice': ['pro'],
    'advanced-analytics': ['pro'],
  };

  const allowedTiers = features[feature];
  return allowedTiers ? allowedTiers.includes(tier) : false;
}

// Get feature limit based on tier
export function getFeatureLimit(tier: 'free' | 'personal' | 'pro', feature: string): number {
  const limits: Record<string, Record<string, number>> = {
    projects: {
      free: 3,
      personal: 10,
      pro: Infinity,
    },
    rules: {
      free: 5,
      personal: 50,
      pro: Infinity,
    },
    historyDays: {
      free: 7,
      personal: 365,
      pro: Infinity,
    },
  };

  return limits[feature]?.[tier] ?? Infinity;
}

// Format price for display
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}
