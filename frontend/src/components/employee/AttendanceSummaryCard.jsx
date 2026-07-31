import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SummaryStatItem from "@/components/employee/SummaryStatItem";

export default function AttendanceSummaryCard({ items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <SummaryStatItem key={item.id} {...item} />
        ))}
      </CardContent>
    </Card>
  );
}
