import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TimelineItem from "@/components/employee/TimelineItem";

export default function TimelineCard({ items }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item, i) => (
          <TimelineItem key={item.id} {...item} isLast={i === items.length - 1} />
        ))}
      </CardContent>
    </Card>
  );
}
