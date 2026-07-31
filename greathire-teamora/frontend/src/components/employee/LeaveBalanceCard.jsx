import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeaveBalanceItem from "@/components/employee/LeaveBalanceItem";

export default function LeaveBalanceCard({ balances, onApply }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {balances.map((balance) => (
          <LeaveBalanceItem key={balance.id} {...balance} />
        ))}

        <Button variant="outline" className="w-full text-primary" onClick={onApply}>
          Apply For Leave
        </Button>
      </CardContent>
    </Card>
  );
}
