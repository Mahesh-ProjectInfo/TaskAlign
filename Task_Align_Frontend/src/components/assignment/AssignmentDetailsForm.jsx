import StepCard from "./StepCard.jsx";
import InputField from "@/components/common/InputField.jsx";
import { ASSIGNMENT_TYPE_CARDS } from "./constants.js";
import { isValidAssignmentName } from "@/utils/validators.js";

export default function AssignmentDetailsForm({ draft, onChange, onTypeChange, errors = {}, setErrors }) {
  const handleNameChange = (e) => {
    const raw = e.target.value;
    const clean = raw
      .replace(/[^A-Za-z0-9 ]/g, "")
      .replace(/^\s+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, 100);

    onChange({ name: clean });

    if (setErrors) {
      const err = isValidAssignmentName(clean);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.name = err;
        } else {
          delete next.name;
        }
        return next;
      });
    }
  };

  return (
    <StepCard
      step={1}
      title="Assignment Details"
      description="Choose the assignment category and give your assignment a descriptive name."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Select Assignment Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ASSIGNMENT_TYPE_CARDS.map((card) => {
              const active = draft.type === (card.title || card.name);
              const Icon = card.icon;
              const theme = card.theme || {
                inactiveCard: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50",
                activeCard: "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20",
                inactiveIcon: "bg-slate-100 text-slate-600",
                activeIcon: "bg-blue-600 text-white",
              };
              return (
                <button
                  type="button"
                  key={card.title || card.name}
                  onClick={() => onTypeChange(card.title || card.name)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active ? theme.activeCard : theme.inactiveCard
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                      active ? theme.activeIcon : theme.inactiveIcon
                    }`}
                  >
                    {Icon ? (
                      <Icon size={18} />
                    ) : (
                      <span className="text-lg">{card.emoji || "📋"}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{card.title || card.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.desc || card.description}</p>
                </button>
              );
            })}
          </div>
          {errors.type && <p className="mt-1.5 text-xs text-red-500">{errors.type}</p>}
        </div>

        <InputField
          label="Assignment Name"
          required
          maxLength={100}
          value={draft.name}
          onChange={handleNameChange}
          placeholder="e.g. Q3 Regional Marketing & Operations"
          error={errors.name}
        />

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1.5">
            Description / Scope (Optional)
          </label>
          <textarea
            rows={3}
            value={draft.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Add notes, requirements, or scope information for this assignment..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
      </div>
    </StepCard>
  );
}
