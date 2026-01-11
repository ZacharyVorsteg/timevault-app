'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with basic time tracking',
    features: [
      'Basic time tracking',
      'Today view & activity log',
      'Manual timer & Pomodoro',
      'Daily summary',
      '7 days of history',
      '3 projects',
    ],
    limitations: ['5 custom rules', 'No CSV export', 'No advanced reports'],
    cta: 'Start Free',
    href: '/app',
    popular: false,
  },
  {
    name: 'Personal',
    price: '$49',
    priceNote: 'one-time',
    description: 'Everything you need for personal productivity',
    features: [
      'Everything in Free',
      'Unlimited history',
      '10 projects',
      '50 custom rules',
      'Full productivity reports',
      'CSV export',
      'Custom categories',
    ],
    limitations: [],
    cta: 'Buy Personal',
    href: '/upgrade?tier=personal',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$79',
    priceNote: 'one-time',
    description: 'For freelancers and professionals',
    features: [
      'Everything in Personal',
      'Unlimited projects',
      'Unlimited rules',
      'Billable hours tracking',
      'PDF invoice generation',
      'Advanced analytics',
      'Priority support',
    ],
    limitations: [],
    cta: 'Buy Pro',
    href: '/upgrade?tier=pro',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, one-time pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            No subscriptions. No recurring fees. Pay once, use forever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm ${
                plan.popular
                  ? 'ring-2 ring-primary-500 scale-105'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-500 text-white text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span className="text-gray-500 dark:text-gray-400">{plan.priceNote}</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>

                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full mb-6"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
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
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={`limit-${i}`} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400 dark:text-gray-500 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include lifetime updates and a 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
}
