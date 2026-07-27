import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import QuickLinkItem from "@/components/employee/QuickLinkItem";

export default function QuickLinksCard({ links }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {links.map((link) => (
          <QuickLinkItem key={link.id} {...link} />
        ))}
      </CardContent>
    </Card>
  );
}
