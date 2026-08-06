import QuickActionButton from "@/components/employee/QuickActionButton";

// Which quick actions make sense from each getCurrentStatus() state — the
// panel used to render all 4 as always-clickable regardless of state.
const ALLOWED_ACTIONS_BY_STATE = {
  "Not Checked In": ["check-in"],
  "Checked Out": ["check-in"],
  Working: ["start-break", "check-out"],
  "On Break": ["resume-work", "check-out"],
};

export default function QuickActionsGrid({ actions, onAction, currentState }) {
  const allowed = ALLOWED_ACTIONS_BY_STATE[currentState] || null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const disabled = allowed ? !allowed.includes(action.id) : false;
        return (
          <QuickActionButton
            key={action.id}
            {...action}
            onClick={() => onAction?.(action.id)}
            disabled={disabled}
            disabledReason={disabled ? `Not available while ${currentState}` : undefined}
          />
        );
      })}
    </div>
  );
}
