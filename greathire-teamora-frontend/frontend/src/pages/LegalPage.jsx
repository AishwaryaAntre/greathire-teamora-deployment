import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import SiteFooter from "@/components/layout/SiteFooter";
import { Card } from "@/components/ui/card";

const CONTENT = {
  "privacy-policy": {
    title: "Privacy Policy",
    body: "GreatHire Teamora collects only the workforce data needed to run attendance, leave, and reporting features for your organization. Data is never sold or shared with third parties outside of your company's own Teamora instance. For the full policy text, contact your account administrator.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    body: "Use of Teamora is governed by the service agreement between your organization and GreatHire. Access is provided for legitimate workforce-management purposes only. For the complete terms, contact your account administrator.",
  },
  security: {
    title: "Security",
    body: "Teamora uses token-based authentication and encrypts data in transit. Access to employee records is limited to authenticated users within your organization. To report a security concern, use the Support contact below.",
  },
  support: {
    title: "Support",
    body: "Need help with your account or something isn't working as expected? Reach the Teamora support team at support@greathire-teamora.com and we'll get back to you as soon as possible.",
  },
};

export default function LegalPage({ slug }) {
  const navigate = useNavigate();
  const { title, body } = CONTENT[slug] || { title: "Not Found", body: "This page doesn't exist." };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar />

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Card className="p-8">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{body}</p>
        </Card>
      </div>

      <SiteFooter />
    </div>
  );
}
