import Swal from "sweetalert2";

export async function showConfirmDialog({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  icon = "warning",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}) {
  const isDelete =
    confirmButtonText.toLowerCase().includes("delete") ||
    icon === "delete" ||
    icon === "warning";

  const iconMarkup = isDelete
    ? `<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-500/10 mb-4 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" x2="10" y1="11" y2="17"></line>
          <line x1="14" x2="14" y1="11" y2="17"></line>
        </svg>
      </div>`
    : `<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-500/10 mb-4 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>`;

  const html = `
    <div class="text-center px-1">
      ${iconMarkup}
      <h3 class="text-xl font-bold text-slate-900 tracking-tight mb-2">${title}</h3>
      <p class="text-sm text-slate-600 leading-relaxed">${text}</p>
      <div class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500 shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>This action is permanent and cannot be undone.</span>
      </div>
    </div>
  `;

  const result = await Swal.fire({
    html,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "ta-confirm-popup max-w-sm w-full",
      htmlContainer: "swal2-html-container",
      actions: "swal2-actions",
      confirmButton:
        "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer",
      cancelButton:
        "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 active:scale-95 rounded-xl transition-all cursor-pointer",
    },
  });

  return result.isConfirmed;
}

export default showConfirmDialog;


