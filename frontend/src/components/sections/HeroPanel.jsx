import { TrendingUp, BarChart3, ClipboardCheck } from "lucide-react";
import FeaturePill from "./FeaturePill";
import DashboardPreview from "./DashboardPreview";

export default function HeroPanel() {
  return (
    
    <div className="relative hidden h-full flex-col overflow-hidden bg-hero-gradient px-10 py-12 lg:flex lg:px-16 lg:py-14 ">
      <div className="flex items-center gap-3 ">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <span className="text-sm font-extrabold">GH</span>
        </div>
        <div>
          <p className="text-[17px] font-bold leading-tight text-primary">
            GreatHire WorkTrack
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Powered by Babde Pvt. Ltd.
          </p>
        </div>
      </div>

      <div className="mt-14 max-w-lg">
        <h1 className="text-[44px] font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white">
          Monitor Your Remote Workforce With Confidence
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-slate-600 dark:text-slate-300">
          Track attendance, monitor work hours, approve leave requests and
          manage your engineering workforce from one unified platform.
        </p>
      </div>

      <div className="mt-9 flex max-w-lg flex-wrap gap-3">
        <FeaturePill
          icon={TrendingUp}
          label="Live Workforce Monitoring"
          iconClassName="text-primary"
        />
        <FeaturePill
          icon={BarChart3}
          label="Attendance Analytics"
          iconClassName="text-primary"
        />
        <FeaturePill
          icon={ClipboardCheck}
          label="Leave Management"
          iconClassName="text-brand-amber"
        />
      </div>

      <div className="mt-auto -mx-16 -mb-14 px-16 pt-10">
        <DashboardPreview />
      </div>
    </div>
    
  );
}
