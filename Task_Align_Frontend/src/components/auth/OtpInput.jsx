import { useRef } from "react";
import { KeyRound, AlertCircle } from "lucide-react";

export default function OtpInput({
  label = "OTP",
  value = "",
  onChange,
  error,
  required = true,
  maxLength = 6,
  className = "",
}) {
  const inputsRef = useRef([]);

  const valString = String(value || "");
  const digits = Array.from({ length: maxLength }, (_, i) => valString[i] || "");

  const updateOtp = (newDigits) => {
    const combined = newDigits.join("");
    onChange?.({ target: { name: "otp", value: combined } });
  };

  const handleInputChange = (e, index) => {
    const raw = e.target.value;
    const digit = raw.replace(/\D/g, "").slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateOtp(nextDigits);

    if (digit && index < maxLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < maxLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const pasteDigits = pasteData.replace(/\D/g, "").slice(0, maxLength);
    if (!pasteDigits) return;

    const nextDigits = Array.from({ length: maxLength }, (_, i) => pasteDigits[i] || "");
    updateOtp(nextDigits);

    const nextFocusIndex = Math.min(pasteDigits.length, maxLength - 1);
    inputsRef.current[nextFocusIndex]?.focus();
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 sm:text-sm">
          <KeyRound size={16} className="text-slate-400" />
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`h-11 w-11 sm:h-12 sm:w-12 text-center text-lg font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 ${
              error
                ? "border-red-300 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 bg-slate-50/50 text-slate-800 focus:border-[#657166] focus:bg-white focus:ring-[#657166]/20"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
