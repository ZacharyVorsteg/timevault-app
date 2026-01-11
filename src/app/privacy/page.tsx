import { Shield, Lock, Eye, Mail, Database } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - TimeVault',
  description: 'Privacy Policy for TimeVault Privacy-First Time Tracking',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              TimeVault is built on a simple principle: your time tracking data belongs to you, not us. This Privacy Policy explains our privacy-first approach.
            </p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">Local-First Architecture</h3>
                  <p className="text-indigo-800">All your time tracking data is stored locally on your device. We cannot see, access, or analyze your productivity data - ever.</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Our Privacy-First Promise</h2>
            <div className="grid gap-4 mb-6">
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Your data stays on your device</p>
                  <p className="text-sm text-green-700">Time entries, categories, and reports never leave your device unless you explicitly export them</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                <Eye className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">No tracking or analytics on your data</p>
                  <p className="text-sm text-green-700">We do not analyze what you track, when you work, or how productive you are</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">No cloud sync required</p>
                  <p className="text-sm text-green-700">The app works entirely offline. Cloud backup is optional and encrypted end-to-end</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Do Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Account Information (Pro users only)</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Email address (for account recovery)</li>
              <li>Password (encrypted, we cannot read it)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Anonymous Usage Analytics</h3>
            <p className="text-gray-600 mb-4">We collect minimal, anonymous data to improve the app:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>App version and device type</li>
              <li>Feature usage (e.g., &quot;Pomodoro timer started&quot; - not what you were tracking)</li>
              <li>Crash reports</li>
            </ul>
            <p className="text-gray-600 mb-6">
              <strong>This can be disabled</strong> in Settings → Privacy → Analytics.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Payment Information</h3>
            <p className="text-gray-600 mb-6">
              For Pro subscriptions, payments are processed by Stripe. We never see or store your credit card information.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. What We Never Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Your time entries or tracked activities</li>
              <li>Project or task names</li>
              <li>Your productivity patterns or work hours</li>
              <li>Screen content or app usage outside TimeVault</li>
              <li>Location data</li>
              <li>Contact information</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Optional Cloud Backup</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">
                If you enable cloud backup (Pro feature):
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Data is encrypted on your device before upload</li>
                <li>We cannot decrypt or read your backed-up data</li>
                <li>Only you have the encryption key</li>
                <li>You can delete cloud backups anytime</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Full Data Control</h4>
                <p className="text-sm text-gray-600">Your data lives on your device - export or delete anytime</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Disable Analytics</h4>
                <p className="text-sm text-gray-600">Turn off all anonymous usage tracking</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account Deletion</h4>
                <p className="text-sm text-gray-600">Delete your account and all server-side data</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Portability</h4>
                <p className="text-sm text-gray-600">Export all data in standard formats (CSV, JSON)</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Data Security</h2>
            <p className="text-gray-600 mb-6">
              Since your data stays on your device, security is primarily in your hands. We recommend enabling device encryption and using a strong device passcode. For cloud backups, we use AES-256 encryption with keys only you possess.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy periodically. Our commitment to local-first, privacy-respecting design will never change.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about this Privacy Policy? Contact us:
                  </p>
                  <a href="mailto:privacy@timevault.app" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    privacy@timevault.app
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
