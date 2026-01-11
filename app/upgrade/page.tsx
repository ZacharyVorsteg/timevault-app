'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Badge, Input } from '@/components/ui';
import { PRICING, createCheckoutSession, validateLicenseKeyFormat } from '@/lib/stripe';
import { setLicense, getLicense } from '@/lib/db';

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const preselectedTier = searchParams.get('tier') as 'personal' | 'pro' | null;

  const [selectedTier, setSelectedTier] = useState<'personal' | 'pro'>(preselectedTier || 'personal');
  const [isLoading, setIsLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [currentLicense, setCurrentLicense] = useState<{ tier: string } | null>(null);

  useEffect(() => {
    getLicense().then(setCurrentLicense);
  }, []);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const url = await createCheckoutSession({ tier: selectedTier });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateLicense = async () => {
    setLicenseError(null);

    if (!validateLicenseKeyFormat(licenseKey)) {
      setLicenseError('Invalid license key format. Please check and try again.');
      return;
    }

    // In a production app, you'd verify this with a server
    // For this privacy-first approach, we trust the format
    await setLicense({
      tier: 'pro', // Assume pro for manual entry
      email: undefined,
      purchasedAt: new Date(),
    });

    window.location.reload();
  };

  const plans = [
    {
      tier: 'personal' as const,
      ...PRICING.personal,
    },
    {
      tier: 'pro' as const,
      ...PRICING.pro,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">TimeVault</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Unlock powerful features with a one-time purchase
          </p>
        </div>

        {/* Current plan */}
        {currentLicense && currentLicense.tier !== 'free' && (
          <div className="mb-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200">
              You&apos;re currently on the{' '}
              <strong>{currentLicense.tier.charAt(0).toUpperCase() + currentLicense.tier.slice(1)}</strong>{' '}
              plan. Thank you for your support!
            </p>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`cursor-pointer transition-all ${
                selectedTier === plan.tier
                  ? 'ring-2 ring-primary-500 border-primary-500'
                  : ''
              }`}
              onClick={() => setSelectedTier(plan.tier)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">one-time</span>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedTier === plan.tier
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selectedTier === plan.tier && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Purchase button */}
        <div className="text-center mb-12">
          <Button size="lg" onClick={handlePurchase} isLoading={isLoading}>
            Purchase {selectedTier === 'personal' ? 'Personal' : 'Pro'} - $
            {selectedTier === 'personal' ? PRICING.personal.price : PRICING.pro.price}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            30-day money-back guarantee. Lifetime updates included.
          </p>
        </div>

        {/* License key activation */}
        <Card className="bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Already have a license key?
          </h3>
          <div className="flex gap-3">
            <Input
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              error={licenseError || undefined}
              className="font-mono"
            />
            <Button
              variant="secondary"
              onClick={handleActivateLicense}
              disabled={!licenseKey}
            >
              Activate
            </Button>
          </div>
        </Card>

        {/* Privacy note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Payment processed securely by Stripe. We never see your card details.</span>
          </div>
        </div>

        {/* Back to app */}
        <div className="mt-8 text-center">
          <Link
            href="/app"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to app
          </Link>
        </div>
      </div>
    </div>
  );
}
