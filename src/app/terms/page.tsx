import { FileText, Mail } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - TimeVault',
  description: 'Terms of Service for TimeVault Privacy-First Time Tracking',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Welcome to TimeVault. By using our app, you agree to these simple, fair Terms of Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By using TimeVault, you agree to these Terms and our Privacy Policy. If you disagree, please do not use the app.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              TimeVault is a privacy-first time tracking app. Your data stays on your device by default. We provide tools for tracking time, analyzing productivity, and generating reports - all without requiring your data to leave your device.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Free & Paid Tiers</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-indigo-900 mb-2">Free Forever</h3>
              <p className="text-indigo-800 mb-4">Core time tracking features are free forever with no account required.</p>
              <h3 className="font-semibold text-indigo-900 mb-2">Pro Features</h3>
              <p className="text-indigo-800">Advanced features like detailed analytics, encrypted cloud backup, and project tracking require a Pro subscription.</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Your Data, Your Control</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>All time tracking data is stored locally on your device</li>
              <li>We cannot see, access, or analyze your time data</li>
              <li>Cloud backup (Pro) is end-to-end encrypted - only you have the key</li>
              <li>You can export or delete your data at any time</li>
              <li>Deleting the app removes all local data</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Pro Subscription</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Personal:</strong> $4.99/month or $39.99/year</li>
              <li><strong>Pro:</strong> $9.99/month or $79.99/year</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Cancel anytime through your device&apos;s app store</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Refund Policy</h2>
            <p className="text-gray-600 mb-6">
              Subscriptions are managed through the Apple App Store or Google Play. Refunds follow their respective policies. For issues, contact us and we&apos;ll help resolve them.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Reverse engineer or modify the app</li>
              <li>Use the app for illegal purposes</li>
              <li>Attempt to circumvent subscription requirements</li>
              <li>Share Pro features with non-subscribers</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. No Warranties</h2>
            <p className="text-gray-600 mb-6">
              TimeVault is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted service or that the app will meet all your needs. Time tracking accuracy depends on proper use.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              We are not liable for lost data, lost productivity, or any damages arising from app use. Since data is stored locally, you are responsible for device backups.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to Service</h2>
            <p className="text-gray-600 mb-6">
              We may update features and these terms. Significant changes will be communicated in-app. Continued use constitutes acceptance of changes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-6">
              You may stop using TimeVault anytime by deleting the app. We may terminate accounts that violate these terms. Your local data remains yours regardless.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about these Terms? Contact us:
                  </p>
                  <a href="mailto:legal@timevault.app" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    legal@timevault.app
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Back to TimeVault
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
