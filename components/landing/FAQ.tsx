'use client';

import React, { useState } from 'react';

const faqs = [
  {
    question: 'How can I verify that my data stays local?',
    answer:
      "Open your browser's developer tools (F12 or Cmd+Shift+I), go to the Network tab, and use TimeVault normally. You'll see zero network requests during regular operation. The only requests happen during purchase (to Stripe) or when you explicitly check for updates.",
  },
  {
    question: "What happens if I clear my browser data?",
    answer:
      "Since TimeVault stores data in IndexedDB, clearing browser data will delete your time tracking history. We strongly recommend using the Export feature regularly to back up your data. You can import it on any device or after clearing data.",
  },
  {
    question: 'Can I sync between devices?',
    answer:
      "Currently, TimeVault doesn't offer cloud sync (that would require sending data to servers, which defeats the privacy purpose). However, you can manually export your data from one device and import it on another. We're exploring end-to-end encrypted sync options for the future.",
  },
  {
    question: 'How accurate is the browser-based tracking?',
    answer:
      "Browser-based tracking captures the active tab's title and URL when TimeVault is open. For the most accurate tracking, we recommend keeping TimeVault open in a pinned tab. For full automatic tracking of all applications, we're developing a desktop app (coming soon).",
  },
  {
    question: "What's the difference between Personal and Pro?",
    answer:
      'Personal is perfect for individual users who want productivity insights and reports. Pro adds features for freelancers and consultants: billable hours tracking, unlimited projects, and PDF invoice generation for clients.',
  },
  {
    question: 'Is there a subscription or recurring payment?',
    answer:
      "No. TimeVault is a one-time purchase. Pay once, use forever. You'll receive all future updates included. We believe privacy-first software shouldn't have ongoing costs that incentivize data collection.",
  },
  {
    question: 'What about refunds?',
    answer:
      "We offer a 30-day money-back guarantee, no questions asked. If TimeVault doesn't work for you, just email us and we'll refund your purchase immediately.",
  },
  {
    question: 'Will there be a mobile app?',
    answer:
      "TimeVault is a Progressive Web App (PWA), which means you can install it on your phone right now. Just visit the site on your mobile browser and tap 'Add to Home Screen'. Native iOS and Android apps are on our roadmap.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Have questions? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
