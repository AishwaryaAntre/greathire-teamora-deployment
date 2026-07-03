import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import SocialLoginButton from "./SocialLoginButton";
import { GoogleIcon, MicrosoftIcon } from "./BrandIcons";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-9">
      <Badge className="bg-secondary text-primary">WELCOME BACK</Badge>

      <h2 className="mt-4 text-[26px] font-bold leading-tight text-slate-900">
        Sign in to Teamora
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in using your company account.
      </p>

      <div className="mt-7 space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a
            href="#forgot-password"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={rememberMe}
          onCheckedChange={setRememberMe}
        />
        <span className="text-sm text-slate-600">Remember me for 30 days</span>
      </label>

      <Button type="submit" size="lg" className="mt-6 w-full text-[15px]">
        Sign In
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground">
          OR CONTINUE WITH
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <SocialLoginButton icon={<GoogleIcon />} label="Google" />
        <SocialLoginButton icon={<MicrosoftIcon />} label="Microsoft" />
      </div>
    </form>
  );
}
