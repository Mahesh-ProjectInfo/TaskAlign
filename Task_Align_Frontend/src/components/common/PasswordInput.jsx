import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "./InputField.jsx";

export default function PasswordInput({
  label = "Password",
  name = "password",
  placeholder = "••••••••",
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  className = "",
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <InputField
      label={label}
      name={name}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      icon={Icon}
      className={className}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-ink-muted hover:text-ink-primary p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring shrink-0"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      }

      {...props}
    />
  );
}
