import { Button } from "@/components/ui/button";

export default function SocialLoginButton({ icon, label, onClick }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full font-semibold text-slate-700 dark:text-slate-200"
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}
