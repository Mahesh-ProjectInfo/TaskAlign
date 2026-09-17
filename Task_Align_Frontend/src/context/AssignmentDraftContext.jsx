import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const AssignmentDraftContext = createContext(null);

const EMPTY_DRAFT = {
  name: "",
  type: "",
  description: "",
  resources: [],
  tasks: [],
  budget: "",
  timeline: "",
  workingDays: "",
  optimizationType: "",
  result: null,
};

export function AssignmentDraftProvider({ children }) {
  const { token } = useAuth();
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const update = useCallback((patch) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const reset = useCallback(() => setDraft(EMPTY_DRAFT), []);

  useEffect(() => {
    if (!token) {
      setDraft(EMPTY_DRAFT);
    }
  }, [token]);

  const value = useMemo(() => ({ draft, setDraft, update, reset }), [draft, update, reset]);
  return (
    <AssignmentDraftContext.Provider value={value}>{children}</AssignmentDraftContext.Provider>
  );
}

export function useAssignmentDraft() {
  const ctx = useContext(AssignmentDraftContext);
  if (!ctx) throw new Error("useAssignmentDraft must be used within AssignmentDraftProvider");
  return ctx;
}
