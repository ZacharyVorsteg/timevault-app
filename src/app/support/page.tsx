'use client'

import { useState } from 'react'
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle, Shield } from 'lucide-react'

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-indigo-100 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
          <p className="text-lg text-gray-600">Get help with TimeVault - privacy-first support</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="mailto:support@timevault.app" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Response within 48 hours</p>
            <span className="text-indigo-600 font-medium text-sm">support@timevault.app</span>
          </a>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 text-sm mb-3">Join our Discord</p>
            <span className="text-green-600 font-medium text-sm">Coming soon</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Note</h3>
            <p className="text-gray-600 text-sm mb-3">We never ask for your time data</p>
            <span className="text-purple-600 font-medium text-sm">100% private</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">We&apos;ll get back to you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="For our response only"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Question</option>
                  <option value="subscription">Pro Subscription</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="privacy">Privacy Question</option>
                  <option value="data">Data Export Help</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="How can we help? (Never share your time data - we don't need it!)"
                />
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-sm text-indigo-800">
                <strong>Privacy note:</strong> We never need or want your time tracking data. Please don&apos;t include it in support requests.
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Where is my data stored?</h3>
              <p className="text-gray-600">All time tracking data is stored locally on your device. We never see it, store it, or have access to it.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I delete the app?</h3>
              <p className="text-gray-600">All local data is deleted with the app. If you have Pro with cloud backup enabled, encrypted backups remain available.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I export my data?</h3>
              <p className="text-gray-600">Go to Settings → Export Data. You can export to CSV or JSON format for use in other tools.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I use TimeVault offline?</h3>
              <p className="text-gray-600">Yes! TimeVault works 100% offline. No internet connection is ever required for time tracking.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h3>
              <p className="text-gray-600">Cancel through your device&apos;s app store (Apple App Store or Google Play). You keep access until the end of your billing period.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to TimeVault
          </a>
        </div>
      </div>
    </div>
  )
}
