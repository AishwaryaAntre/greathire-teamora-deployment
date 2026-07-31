import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import HolidayItem from "@/components/employee/HolidayItem";

export default function UpcomingHolidaysCard({ holidays }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Holidays</CardTitle>
        <button onClick={() => navigate("/leave")} className="text-xs font-semibold text-primary hover:underline">
          View All
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {holidays.map((holiday) => (
          <HolidayItem key={holiday.id} {...holiday} />
        ))}
      </CardContent>
    </Card>
  );
}
