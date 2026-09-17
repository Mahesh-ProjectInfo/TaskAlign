/**
 * Resource Bulk Upload Sample CSV Template Utility
 * Downloads resources-template.csv matching the expected schema of Task Align.
 */

export const RESOURCE_TEMPLATE_HEADERS = [
  "Assignment Type",
  "Resource Name",
  "Role",
  "Monthly Salary",
  "Performance Rating",
  "Skills",
];

export const RESOURCE_TEMPLATE_SAMPLE_ROW = [
  "Software Project Assignment",
  "John Doe",
  "Backend Developer",
  "80000",
  "85",
  "Java; Spring Boot; REST API",
];

export function downloadResourceTemplateCsv() {
  const csv =
    RESOURCE_TEMPLATE_HEADERS.join(",") +
    "\n" +
    RESOURCE_TEMPLATE_SAMPLE_ROW.map((v) => `"${v}"`).join(",") +
    "\n";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resources-template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
