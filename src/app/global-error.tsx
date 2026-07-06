'use client';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 antialiased">
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-3xl font-bold text-zinc-950">
            Something went wrong
          </h1>
          <p className="text-zinc-600">
            The application encountered an unexpected error.
          </p>
          <p className="text-sm text-zinc-500">{error.message}</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
