import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TimeVault Terms of Service - Simple, fair terms for our privacy-first time tracker.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              By using TimeVault, you agree to these terms. TimeVault is a privacy-first time tracking
              application that stores all data locally on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Free vs Pro Features</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TimeVault offers a free tier with core functionality and Pro features for a one-time purchase:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Free:</strong> Basic time tracking, projects, daily/weekly views</li>
              <li><strong>Pro:</strong> Advanced analytics, data export, unlimited projects, priority support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. License and Payment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Pro licenses are:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>One-time purchase (no subscriptions)</li>
              <li>Valid for lifetime updates</li>
              <li>Refundable within 14 days if not satisfied</li>
              <li>Non-transferable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Your Data, Your Responsibility</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Since all data is stored locally on your device, you are responsible for backing up
              your data. We cannot recover data if you clear your browser storage or lose your device.
              We recommend regularly exporting your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. No Warranty</h2>
            <p className="text-gray-700 dark:text-gray-300">
              TimeVault is provided &quot;as is&quot; without warranties of any kind. We strive to provide
              a reliable service but cannot guarantee uninterrupted availability or that the app
              will be error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We are not liable for any indirect, incidental, or consequential damages arising from
              your use of TimeVault, including but not limited to data loss.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Acceptable Use</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Reverse engineer or decompile the application</li>
              <li>Share or distribute Pro license keys</li>
              <li>Use the service for any illegal purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update these terms occasionally. Continued use of TimeVault after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Questions? Contact us at{' '}
              <a href="mailto:hello@timevault.app" className="text-blue-600 dark:text-blue-400 hover:underline">
                hello@timevault.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
