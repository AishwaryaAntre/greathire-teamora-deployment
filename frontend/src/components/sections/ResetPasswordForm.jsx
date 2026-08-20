import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";

export default function ResetPasswordForm() {
  let navigate = useNavigate();
  let [searchParams] = useSearchParams();
  let token = searchParams.get("token") || "";

  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [error, setError] = useState("");
  let [submitting, setSubmitting] = useState(false);
  let [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="p-8 text-center sm:p-9">
        <h2 className="text-[22px] font-bold leading-tight text-slate-900 dark:text-white">
          Invalid Reset Link
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <Link
          to="/forgot-password"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full text-[15px]")}
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 text-center sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-[22px] font-bold leading-tight text-slate-900 dark:text-white">
          Password Reset
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your password has been updated. Redirecting you to sign in...
        </p>
        <Link to="/" className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full text-[15px]")}>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-9">
      <Badge className="bg-secondary text-primary">RESET PASSWORD</Badge>

      <h2 className="mt-4 text-[26px] font-bold leading-tight text-slate-900 dark:text-white">
        Create New Password
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Choose a new password for your Teamora account.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-slate-700 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full text-[15px]" disabled={submitting}>
        {submitting ? "Resetting..." : "Reset Password"}
      </Button>

      <Link
        to="/"
        className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
    </form>
  );
}
