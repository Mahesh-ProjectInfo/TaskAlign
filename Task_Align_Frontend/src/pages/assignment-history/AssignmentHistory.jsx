import { ClipboardList } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import RecentAssignmentsTable from "@/components/dashboard/RecentAssignmentsTable.jsx";

export default function AssignmentHistory() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-4">
      <PageHeader
        icon={ClipboardList}
        title="Assignment History"
        description="Review previously created assignments and their outcomes."
      />

      <section className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-5 sm:p-6 space-y-4">
        <RecentAssignmentsTable emptyTitle="No assignments found." />
      </section>
    </div>
  );

}
