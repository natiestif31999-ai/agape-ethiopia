"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4 py-8">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-5xl">📡</div>

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          You&apos;re Offline
        </h1>

        <p className="mb-6 text-gray-600">
          It looks like you&apos;ve lost your internet connection. Some features
          may not be available right now.
        </p>

        <div className="mb-6 space-y-2 rounded-md bg-amber-50 p-4 text-left text-sm text-amber-800">
          <p className="font-semibold">What you can do:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Check your internet connection</li>
            <li>View previously cached pages</li>
            <li>Review saved information</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:border-gray-400"
          >
            Go Back
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Your app will work normally once you reconnect to the internet.
        </p>
      </div>
    </main>
  );
}
