import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TimeVault Privacy Policy - Your data stays on your device. Period.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: January 2025</p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Privacy First, Always
          </h2>
          <p className="text-blue-800 dark:text-blue-200">
            TimeVault is built with privacy as its core principle. Your time tracking data
            <strong> never leaves your device</strong>. We cannot see, access, or sell your data
            because we literally do not have it.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Local-First Architecture</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All your time entries, projects, and analytics are stored locally in your browser
              using IndexedDB. This means:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>No account required to use the app</li>
              <li>No data is ever sent to our servers</li>
              <li>Your data works offline</li>
              <li>You have complete control over your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. What We Do Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you purchase a Pro license, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Email address (for license delivery and support)</li>
              <li>Payment information (processed securely by Stripe - we never see your card)</li>
              <li>License key (stored locally on your device)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              We do NOT collect: time entries, project names, clients, or any other productivity data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Analytics</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use privacy-respecting analytics (no cookies, no personal data) to understand
              basic usage patterns like page views. We do not track individual users or collect
              any personal information through analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Export</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You can export all your data at any time in CSV or JSON format. This is your data -
              you should always have full access to it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Deletion</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Since your data is stored locally, you can delete it at any time by clearing your
              browser data or using the app&apos;s built-in data management tools. We have nothing to delete
              because we never had your data in the first place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We use minimal third-party services:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Stripe</strong> - For payment processing (PCI-compliant)</li>
              <li><strong>Netlify</strong> - For hosting the web application</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Questions about privacy? Email us at{' '}
              <a href="mailto:privacy@timevault.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@timevault.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
