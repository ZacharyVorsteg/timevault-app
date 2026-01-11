import { FileQuestion, Home, Clock } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="w-8 h-8 text-gray-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Page not found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This page doesn't exist. Let's get you back to tracking your time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Start Tracking
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
