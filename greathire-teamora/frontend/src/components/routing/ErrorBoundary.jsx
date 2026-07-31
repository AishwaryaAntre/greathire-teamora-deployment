import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Structured logging on the frontend would go here (e.g. Sentry). For now,
    // at minimum this keeps the failure visible in devtools instead of silent.
    console.error("[ErrorBoundary] Uncaught render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This page hit an unexpected error. Reloading usually fixes it — if it keeps happening, let us
              know via Support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
