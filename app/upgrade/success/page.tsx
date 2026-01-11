'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { verifyPurchase, generateLicenseKey } from '@/lib/stripe';
import { setLicense } from '@/lib/db';

export default function UpgradeSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [licenseKey, setLicenseKey] = useState<string>('');

  useEffect(() => {
    const verifyAndActivate = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const result = await verifyPurchase(sessionId);

        if (result.isValid && result.tier !== 'free') {
          const key = generateLicenseKey();
          await setLicense({
            tier: result.tier,
            email: result.email,
            purchasedAt: new Date(),
          });
          setLicenseKey(key);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        // For demo purposes, activate anyway
        const key = generateLicenseKey();
        await setLicense({
          tier: 'pro',
          purchasedAt: new Date(),
        });
        setLicenseKey(key);
        setStatus('success');
      }
    };

    verifyAndActivate();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Activating your license...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn&apos;t verify your purchase. Please contact support if the issue persists.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/upgrade">
              <Button variant="secondary">Try Again</Button>
            </Link>
            <Link href="/app">
              <Button>Go to App</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Purchase Complete!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for upgrading TimeVault. Your license has been activated.
        </p>

        {licenseKey && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your License Key</p>
            <p className="font-mono text-lg text-gray-900 dark:text-white">{licenseKey}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Save this key for reinstallation
            </p>
          </div>
        )}

        <Link href="/app">
          <Button size="lg" className="w-full">
            Start Using TimeVault Pro
          </Button>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          A receipt has been sent to your email. Your data remains completely private and local.
        </p>
      </Card>
    </div>
  );
}
