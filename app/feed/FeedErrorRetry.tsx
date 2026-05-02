'use client';

export function FeedErrorRetry() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-primary text-black px-8 py-3 rounded-2xl font-bold"
    >
      Try Again
    </button>
  );
}
