export default function PageError({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-red-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
