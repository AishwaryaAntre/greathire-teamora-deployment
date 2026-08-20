import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";

export default function ForgotPasswordForm() {
  let [email, setEmail] = useState("");
  let [error, setError] = useState("");
  let [submitting, setSubmitting] = useState(false);
  let [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      // Always show the generic success state, whether or not the account
      // exists — the backend responds identically either way.
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 text-center sm:p-9">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-[22px] font-bold leading-tight text-slate-900 dark:text-white">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists with this email, we've sent a password reset link. The link will
          expire in 30 minutes.
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
        Forgot Password?
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your work email and we'll send you a password reset link.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-[18px] w-[18px] text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="pl-11"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full text-[15px]" disabled={submitting}>
        {submitting ? "Sending..." : "Send Reset Link"}
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
