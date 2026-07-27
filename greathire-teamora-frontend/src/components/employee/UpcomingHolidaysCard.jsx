import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import HolidayItem from "@/components/employee/HolidayItem";

export default function UpcomingHolidaysCard({ holidays }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Holidays</CardTitle>
        <button className="text-xs font-semibold text-primary hover:underline">View All</button>
      </CardHeader>
      <CardContent className="space-y-4">
        {holidays.map((holiday) => (
          <HolidayItem key={holiday.id} {...holiday} />
        ))}
      </CardContent>
    </Card>
  );
}
