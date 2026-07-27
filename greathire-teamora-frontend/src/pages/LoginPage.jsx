import HeroPanel from "@/components/sections/HeroPanel";
import LoginPanel from "@/components/sections/LoginPanel";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <HeroPanel />
      <LoginPanel />
    </div>
  );
}





