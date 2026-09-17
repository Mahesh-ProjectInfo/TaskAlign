import { useRef } from "react";

export default function SixDigitOtpInput({
  value = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  verifying = false,
}) {
  const inputsRef = useRef([]);

  // Split value into 6 characters
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const handleKeyDown = (index, e) => {
    if (disabled || verifying) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        const newVal = newDigits.join("");
        onChange?.(newVal);
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        const newVal = newDigits.join("");
        onChange?.(newVal);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (index, e) => {
    if (disabled || verifying) return;
    const inputVal = e.target.value;
    const digit = inputVal.replace(/\D/g, "").slice(-1);

    if (!digit) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    const newVal = newDigits.join("");
    onChange?.(newVal);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newVal.length === 6) {
      onComplete?.(newVal);
    }
  };

  const handlePaste = (e) => {
    if (disabled || verifying) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      onChange?.(pastedData);
      const nextFocus = Math.min(pastedData.length, 5);
      inputsRef.current[nextFocus]?.focus();
      if (pastedData.length === 6) {
        onComplete?.(pastedData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, idx) => {
          const val = digits[idx];
          return (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={idx === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={val}
              disabled={disabled || verifying}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`OTP Digit ${idx + 1}`}
              className={`h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 disabled:bg-surface-muted disabled:opacity-60 ${
                error
                  ? "border-status-danger-border bg-status-danger-bg/50 text-status-danger-text focus:ring-status-danger-bg"
                  : val
                    ? "border-primary-500 bg-secondary-soft/50 text-ink-primary focus:ring-accent-ring"
                    : "border-border-default bg-surface-card text-ink-primary focus:border-accent-main focus:ring-accent-ring"
              }`}
            />
          );
        })}
      </div>

    </div>
  );
}
