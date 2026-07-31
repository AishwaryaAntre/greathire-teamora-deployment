import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="text-sm text-slate-500">This page doesn't exist.</p>
      <Link to="/" className="text-sm font-semibold text-primary hover:underline">
        Back to login
      </Link>
    </div>
  );
}
