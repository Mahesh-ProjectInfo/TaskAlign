import { useState } from "react";
import SelectField from "@/components/common/SelectField.jsx";
import InputField from "@/components/common/InputField.jsx";
import Button from "@/components/common/Button.jsx";
import AlertMessage from "@/components/common/AlertMessage.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { isValidSkillName } from "@/utils/validators.js";
import { MD_ASSIGNMENT_TYPES } from "./constants.js";

export default function SkillForm({ mode = "add", form, onChange, error, onSave, onCancel }) {
  const { assignmentTypesList } = useMasterData();
  const typesOptions =
    assignmentTypesList && assignmentTypesList.length > 0
      ? assignmentTypesList
      : MD_ASSIGNMENT_TYPES;
  const readOnly = mode === "view";

  const [touched, setTouched] = useState({ type: false, name: false });
  const [fieldErrors, setFieldErrors] = useState({ type: "", name: "" });

  const handleTypeChange = (e) => {
    const val = e.target.value;
    onChange({ ...form, type: val });
    if (touched.type) {
      setFieldErrors((prev) => ({ ...prev, type: !val ? "Assignment Type is required." : "" }));
    }
  };

  const handleTypeBlur = () => {
    setTouched((prev) => ({ ...prev, type: true }));
    setFieldErrors((prev) => ({ ...prev, type: !form.type ? "Assignment Type is required." : "" }));
  };

  const handleNameChange = (e) => {
    const clean = e.target.value
      .replace(/[^A-Za-z ]/g, "")
      .replace(/^\s+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, 50);
    onChange({ ...form, name: clean });
    if (touched.name) {
      setFieldErrors((prev) => ({ ...prev, name: isValidSkillName(clean) || "" }));
    }
  };

  const handleNameBlur = () => {
    setTouched((prev) => ({ ...prev, name: true }));
    setFieldErrors((prev) => ({ ...prev, name: isValidSkillName(form.name) || "" }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (readOnly) return onCancel?.();

    setTouched({ type: true, name: true });
    const typeErr = !form.type ? "Assignment Type is required." : "";
    const nameErr = isValidSkillName(form.name) || "";
    setFieldErrors({ type: typeErr, name: nameErr });

    if (typeErr || nameErr) return;
    onSave();
  };

  return (
    <form className="space-y-4 pt-1" onSubmit={handleSubmit} noValidate>
      {error && <AlertMessage type="error" message={error} />}

      <SelectField
        label="Assignment Type"
        required
        disabled={readOnly}
        value={form.type}
        onChange={handleTypeChange}
        onBlur={handleTypeBlur}
        options={typesOptions}
        placeholder="Select Assignment Type"
        error={fieldErrors.type}
      />

      <InputField
        label="Skill Name"
        required
        disabled={readOnly}
        maxLength={50}
        value={form.name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        placeholder="e.g. React.js / Node.js"
        error={fieldErrors.name}
      />

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && (
          <Button variant="primary" type="submit">
            {mode === "add" ? "Add Skill" : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  );
}
