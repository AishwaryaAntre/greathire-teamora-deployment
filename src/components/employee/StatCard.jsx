import { Card, CardContent } from "@/components/ui/Card";

export default function StatCard({ label, value, suffix }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {value}
          {suffix && <span className="ml-1 text-sm font-semibold text-muted-foreground">{suffix}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
