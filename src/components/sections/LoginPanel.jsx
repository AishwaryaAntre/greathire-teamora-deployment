import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import TopBar from "@/components/layout/TopBar";
import LoginForm from "./LoginForm";
import SiteFooter from "@/components/layout/SiteFooter";

export default function LoginPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar />

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <Card>
            <LoginForm />
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Need help?{" "}
              <a
                href="#contact-administrator"
                className="font-semibold text-primary hover:underline"
              >
                Contact Administrator
              </a>
            </p>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
              <Lock className="h-3 w-3" />
              ENTERPRISE-GRADE ENCRYPTION
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
