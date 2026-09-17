import SelectField from "@/components/common/SelectField.jsx";
import InputField from "@/components/common/InputField.jsx";
import Button from "@/components/common/Button.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";
import SkillMultiSelect from "./SkillMultiSelect.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { isValidResourceName, isValidSalary, isValidRating } from "@/utils/validators.js";
import { MD_ASSIGNMENT_TYPES } from "./constants.js";

export default function ResourceForm({
  mode = "add",
  form,
  formRoles = [],
  formSkills = [],
  onChange,
  onTypeChange,
  errors = {},
  setErrors,
  onSave,
  onCancel,
}) {
  const { assignmentTypesList } = useMasterData();
  const typesOptions =
    assignmentTypesList && assignmentTypesList.length > 0
      ? assignmentTypesList
      : MD_ASSIGNMENT_TYPES;
  const readOnly = mode === "view";

  const handleNameChange = (e) => {
    const clean = e.target.value
      .replace(/[^A-Za-z ]/g, "")
      .replace(/^\s+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, 50);
    onChange({ ...form, name: clean });
    if (setErrors) {
      setErrors((prev) => {
        const err = isValidResourceName(clean);
        const next = { ...prev };
        if (err) next.name = err;
        else delete next.name;
        return next;
      });
    }
  };

  const handleSalaryChange = (e) => {
    let raw = e.target.value;
    if (raw.startsWith("0")) {
      raw = raw.replace(/^0+/, "");
    }
    raw = raw.replace(/[^0-9.]/g, "");
    const firstDotIndex = raw.indexOf(".");
    if (firstDotIndex !== -1) {
      raw = raw.slice(0, firstDotIndex + 1) + raw.slice(firstDotIndex + 1).replace(/\./g, "");
      const [intPart, decPart] = raw.split(".");
      if (decPart && decPart.length > 2) {
        raw = `${intPart}.${decPart.slice(0, 2)}`;
      }
    }
    const clean = raw.slice(0, 10);
    onChange({ ...form, salary: clean });
    if (setErrors) {
      setErrors((prev) => {
        const err = isValidSalary(clean);
        const next = { ...prev };
        if (err) next.salary = err;
        else delete next.salary;
        return next;
      });
    }
  };

  const handleRatingChange = (e) => {
    let raw = e.target.value;
    if (raw.startsWith("0")) {
      raw = raw.replace(/^0+/, "");
    }
    raw = raw.replace(/[^0-9.]/g, "");
    const firstDotIndex = raw.indexOf(".");
    if (firstDotIndex !== -1) {
      raw = raw.slice(0, firstDotIndex + 1) + raw.slice(firstDotIndex + 1).replace(/\./g, "");
      const [intPart, decPart] = raw.split(".");
      if (decPart && decPart.length > 2) {
        raw = `${intPart}.${decPart.slice(0, 2)}`;
      }
    }
    let clean = raw.slice(0, 6);
    if (clean !== "" && !clean.endsWith(".")) {
      const num = Number(clean);
      if (num > 100) return;
    }
    onChange({ ...form, rating: clean });
    if (setErrors) {
      setErrors((prev) => {
        const err = isValidRating(clean);
        const next = { ...prev };
        if (err) next.rating = err;
        else delete next.rating;
        return next;
      });
    }
  };

  return (
    <div className="space-y-5 pt-1">
      {/* Section 1: Resource Overview */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
          Resource Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Assignment Type"
            required
            disabled={readOnly}
            value={form.type}
            onChange={(e) =>
              onTypeChange
                ? onTypeChange(e.target.value)
                : onChange({ ...form, type: e.target.value })
            }
            options={typesOptions}
            placeholder="Select Assignment Type"
            error={errors.type}
          />

          <InputField
            label="Resource Name"
            required
            disabled={readOnly}
            maxLength={50}
            value={form.name}
            onChange={handleNameChange}
            placeholder="e.g. Aarav Sharma"
            error={errors.name}
          />

          <div className="md:col-span-2">
            <SelectField
              label="Role"
              required
              disabled={readOnly || !form.type}
              value={form.role}
              onChange={(e) => onChange({ ...form, role: e.target.value })}
              options={formRoles}
              placeholder="Select Role"
              error={errors.role}
              hint={!form.type ? "Select Assignment Type first" : undefined}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Compensation & Rating */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
          Compensation & Rating
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Monthly Salary (₹)"
            required
            type="text"
            inputMode="decimal"
            maxLength={10}
            disabled={readOnly}
            value={form.salary}
            onChange={handleSalaryChange}
            placeholder="e.g. 80000"
            error={errors.salary}
          />

          <InputField
            label="Performance Rating"
            required
            type="text"
            inputMode="decimal"
            maxLength={6}
            disabled={readOnly}
            value={form.rating}
            onChange={handleRatingChange}
            placeholder="e.g. 85"
            error={errors.rating}
            helperText="Value between 1 and 100"
          />
        </div>
      </div>

      {/* Section 3: Skill Assignment */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100 mb-3">
          Skill Assignment
        </h3>
        <label className="block text-sm font-semibold text-slate-800">
          Skills <span className="text-red-500">*</span>
        </label>
        {readOnly ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(form.skills || []).map((s) => (
              <SkillTag key={s} label={s} tone="blue" />
            ))}
            {(!form.skills || form.skills.length === 0) && (
              <span className="text-sm text-slate-500">—</span>
            )}
          </div>
        ) : (
          <SkillMultiSelect
            options={formSkills}
            value={form.skills}
            onChange={(v) => onChange({ ...form, skills: v })}
            placeholder={form.type ? "Search and select skills..." : "Select Assignment Type first"}
          />
        )}
        {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
        {!errors.skills && !form.type && (
          <p className="mt-1 text-xs text-slate-500">
            Select Assignment Type first to filter skills
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button variant="primary" onClick={onSave}>
            {mode === "add" ? "Add Resource" : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}
