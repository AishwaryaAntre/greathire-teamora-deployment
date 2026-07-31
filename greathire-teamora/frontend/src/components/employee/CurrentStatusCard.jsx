import { Card, CardContent } from "@/components/ui/card";
import TaskLoadRing from "@/components/employee/TaskLoadRing";

export default function CurrentStatusCard({ status }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Current Status: {status.state}
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <dt className="w-28 text-muted-foreground">Check-In:</dt>
                <dd className="font-medium text-foreground">{status.checkIn}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-28 text-muted-foreground">Current Session:</dt>
                <dd className="font-medium text-foreground">{status.currentSession}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="w-28 text-muted-foreground">Today's Goal:</dt>
                <dd className="font-medium text-foreground">{status.todaysGoal}</dd>
              </div>
            </dl>
          </div>

          <TaskLoadRing percent={status.taskLoadPercent} />
        </div>
      </CardContent>
    </Card>
  );
}
