'use client';

import React from 'react';

const comparisons = [
  {
    feature: 'Data Storage',
    timeVault: 'Local only (IndexedDB)',
    rescueTime: 'Cloud servers',
    toggl: 'Cloud servers',
  },
  {
    feature: 'Network Requests',
    timeVault: 'Zero during use',
    rescueTime: 'Constant sync',
    toggl: 'Constant sync',
  },
  {
    feature: 'Account Required',
    timeVault: 'No',
    rescueTime: 'Yes',
    toggl: 'Yes',
  },
  {
    feature: 'Works Offline',
    timeVault: 'Yes, fully',
    rescueTime: 'Limited',
    toggl: 'Limited',
  },
  {
    feature: 'Pricing',
    timeVault: 'One-time $49-79',
    rescueTime: '$12/mo',
    toggl: '$10/mo',
  },
  {
    feature: 'Data Export',
    timeVault: 'Full JSON/CSV',
    rescueTime: 'Limited',
    toggl: 'CSV only',
  },
  {
    feature: 'Open Source',
    timeVault: 'Client-side verifiable',
    rescueTime: 'No',
    toggl: 'No',
  },
  {
    feature: 'Telemetry',
    timeVault: 'None',
    rescueTime: 'Yes',
    toggl: 'Yes',
  },
];

export function ComparisonTable() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How we compare
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See why privacy-first makes a difference
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                <th className="text-center py-4 px-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <span className="font-semibold text-primary-700 dark:text-primary-400">
                      TimeVault
                    </span>
                  </div>
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-600 dark:text-gray-400">
                  RescueTime
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Toggl
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      {row.timeVault.includes('Zero') ||
                      row.timeVault.includes('No') ||
                      row.timeVault.includes('None') ||
                      row.timeVault.includes('Yes') ||
                      row.timeVault.includes('Local') ||
                      row.timeVault.includes('Full') ||
                      row.timeVault.includes('One-time') ||
                      row.timeVault.includes('verifiable') ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : null}
                      {row.timeVault}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                    {row.rescueTime}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                    {row.toggl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          * Annual cost comparison: TimeVault saves you $200+ over 2 years vs monthly subscriptions
        </p>
      </div>
    </section>
  );
}
