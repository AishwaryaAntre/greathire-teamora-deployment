import QuickActionButton from "@/components/employee/QuickActionButton";

export default function QuickActionsGrid({ actions, onAction }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <QuickActionButton key={action.id} {...action} onClick={() => onAction?.(action.id)} />
      ))}
    </div>
  );
}
