import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import AuthCard from "@/components/auth/AuthCard.jsx";
import AuthHeader from "@/components/auth/AuthHeader.jsx";
import InputField from "@/components/common/InputField.jsx";
import PasswordInput from "@/components/common/PasswordInput.jsx";
import SixDigitOtpInput from "@/components/auth/SixDigitOtpInput.jsx";
import Button from "@/components/common/Button.jsx";
import { isValidEmail, isValidPassword, isValidConfirmPassword } from "@/utils/validators.js";
import { authService } from "@/services/authService.js";
import { parseApiError } from "@/utils/errorHandler.js";

export default function ForgotPassword() {
  // Step State: 1 = Email, 2 = OTP, 3 = Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form Fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // UI States
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Loading States
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleEmailChange = (e) => {
    const raw = e.target.value;
    let clean = raw.replace(/[^a-zA-Z0-9@._+-]/g, "");
    const atIndex = clean.indexOf("@");
    if (atIndex !== -1) {
      clean = clean.slice(0, atIndex + 1) + clean.slice(atIndex + 1).replace(/@/g, "");
    }
    clean = clean.slice(0, 100);
    setEmail(clean);
    if (emailTouched) {
      setErrors((prev) => ({ ...prev, email: isValidEmail(clean) }));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setErrors((prev) => ({ ...prev, email: isValidEmail(email) }));
  };

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setServerError("");
    setSuccessMsg("");
    setEmailTouched(true);

    const emailErr = isValidEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }
    setErrors({});

    setSendingOtp(true);
    try {
      const resMessage = await authService.forgotPassword({ email: email.trim() });
      setSuccessMsg(typeof resMessage === "string" ? resMessage : "OTP sent to your email.");
      setStep(2);
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(
        parsed.message || "Failed to send OTP. Please check your email and try again.",
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // --- STEP 2: VERIFY OTP (Triggered Real-Time when 6 Digits Entered) ---
  const handleVerifyOtp = async (otpValue) => {
    const codeToVerify = otpValue || otp;
    if (!codeToVerify || codeToVerify.length !== 6) return;

    setServerError("");
    setSuccessMsg("");
    setVerifyingOtp(true);

    try {
      const resMessage = await authService.verifyOtp({
        email: email.trim(),
        otp: codeToVerify,
      });
      setVerifiedOtp(codeToVerify);
      setSuccessMsg(typeof resMessage === "string" ? resMessage : "OTP verified successfully.");
      setStep(3);
    } catch (err) {
      const parsed = parseApiError(err);
      let errMsg = parsed.message;
      if (
        !errMsg ||
        errMsg.toLowerCase().includes("mobile") ||
        errMsg.toLowerCase().includes("field")
      ) {
        errMsg = "Invalid OTP. Please enter the correct verification code.";
      }
      setServerError(errMsg);
      setOtp(""); // Clear OTP boxes so user can retry typing easily
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setServerError("");
    setSuccessMsg("");
    setOtp("");
    setSendingOtp(true);
    try {
      const resMessage = await authService.forgotPassword({ email: email.trim() });
      setSuccessMsg(
        typeof resMessage === "string" ? resMessage : "A new OTP has been sent to your email.",
      );
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message || "Failed to resend OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handlePasswordChange = (e) => {
    const clean = e.target.value.replace(/\s/g, "").slice(0, 20);
    setPassword(clean);
    if (passwordTouched) {
      setErrors((prev) => ({ ...prev, password: isValidPassword(clean) }));
    }
    if (confirmTouched && confirm) {
      setErrors((prev) => ({ ...prev, confirm: isValidConfirmPassword(clean, confirm) }));
    }
  };

  const handleConfirmChange = (e) => {
    const clean = e.target.value.replace(/\s/g, "").slice(0, 20);
    setConfirm(clean);
    if (confirmTouched) {
      setErrors((prev) => ({ ...prev, confirm: isValidConfirmPassword(password, clean) }));
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setErrors((prev) => ({ ...prev, password: isValidPassword(password) }));
  };

  const handleConfirmBlur = () => {
    setConfirmTouched(true);
    setErrors((prev) => ({ ...prev, confirm: isValidConfirmPassword(password, confirm) }));
  };

  // --- STEP 3: RESET PASSWORD ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");
    setPasswordTouched(true);
    setConfirmTouched(true);

    const passErr = isValidPassword(password);
    const confirmErr = isValidConfirmPassword(password, confirm);
    const errs = {};
    if (passErr) errs.password = passErr;
    if (confirmErr) errs.confirm = confirmErr;

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setResetting(true);
    try {
      const resMessage = await authService.resetPassword({
        email: email.trim(),
        otp: verifiedOtp || otp,
        newPassword: password,
        confirmPassword: confirm,
      });
      setSuccessMsg(typeof resMessage === "string" ? resMessage : "Password reset successfully.");
      setStep(4);
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length) {
        setErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message || "Failed to reset password. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  // Return to Step 1 (Change Email)
  const handleBackToStep1 = () => {
    setStep(1);
    setOtp("");
    setVerifiedOtp("");
    setServerError("");
    setSuccessMsg("");
    setErrors({});
  };

  return (
    <AuthCard>
      {/* Header based on current step */}
      {step === 1 && (
        <AuthHeader
          title="Forgot Password"
          subtitle="Enter your registered email address and we'll send you a verification code."
        />
      )}

      {step === 2 && (
        <AuthHeader
          title="Enter Verification Code"
          subtitle={`We've sent a 6-digit verification code to ${email}.`}
        />
      )}

      {step === 3 && (
        <AuthHeader
          title="Reset Password"
          subtitle="Create a strong new password for your account."
        />
      )}

      {step === 4 && (
        <AuthHeader
          title="Password Reset Completed"
          subtitle="Your password has been reset successfully. You can now log in with your new credentials."
        />
      )}

      {/* Global Alerts */}
      {serverError && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && step !== 4 && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ================= STEP 1: EMAIL INPUT ================= */}
      {step === 1 && (
        <form className="space-y-4" onSubmit={handleSendOtp} noValidate>
          <InputField
            label="Email Address"
            icon={Mail}
            type="email"
            required
            maxLength={100}
            placeholder="you@company.com"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
              }
              if (e.key === "@" && email.includes("@")) {
                e.preventDefault();
              }
            }}
            onBlur={handleEmailBlur}
            error={errors.email}
          />

          <div className="pt-2">
            <Button
              type="submit"
              size="full"
              loading={sendingOtp}
              disabled={sendingOtp}
              className="h-11 justify-center"
            >
              Send OTP
            </Button>
          </div>
        </form>
      )}

      {/* ================= STEP 2: OTP VERIFICATION ================= */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Targeted Email Badge */}
          <div className="flex items-center justify-between rounded-xl bg-surface-app border border-border-default px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-ink-primary truncate">{email}</span>
            <button
              type="button"
              onClick={handleBackToStep1}
              className="text-xs font-semibold text-accent-main hover:text-accent-hover transition-colors shrink-0 ml-2"
            >
              Change Email
            </button>
          </div>

          {/* Real-Time 6-Digit OTP Boxes */}
          <div className="py-2">
            <SixDigitOtpInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOtp}
              disabled={verifyingOtp}
              error={Boolean(serverError)}
              verifying={verifyingOtp}
            />
          </div>

          {/* Verifying Spinner Indicator */}
          {verifyingOtp && (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-accent-main">
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying OTP...</span>
            </div>
          )}

          {/* Resend Action */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              disabled={sendingOtp || verifyingOtp}
              onClick={handleResendOtp}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-secondary hover:text-accent-main disabled:opacity-50 transition-colors"
            >
              <RefreshCcw size={14} className={sendingOtp ? "animate-spin" : ""} />
              {sendingOtp ? "Sending new OTP..." : "Didn't receive code? Resend OTP"}
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: NEW PASSWORD ================= */}
      {step === 3 && (
        <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
          <PasswordInput
            label="New Password"
            icon={Lock}
            required
            maxLength={20}
            placeholder="Uppercase, lowercase, number & special char"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            icon={ShieldCheck}
            required
            maxLength={20}
            placeholder="Re-enter new password"
            value={confirm}
            onChange={handleConfirmChange}
            onBlur={handleConfirmBlur}
            onPaste={(e) => e.preventDefault()}
            error={errors.confirm}
          />

          <div className="pt-2">
            <Button
              type="submit"
              size="full"
              loading={resetting}
              disabled={resetting}
              className="h-11 justify-center"
            >
              Reset Password
            </Button>
          </div>
        </form>
      )}

      {/* ================= STEP 4: SUCCESS ================= */}
      {step === 4 && (
        <div className="space-y-5 pt-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-status-success-bg text-status-success-text border border-status-success-border">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-sm text-slate-600">
            Your password has been reset successfully. Please return to login and sign in with your
            new password.
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-main hover:bg-accent-hover py-3 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            Go to Login
          </Link>
        </div>
      )}

      {/* Back to Login Footer (Steps 1, 2, 3) */}
      {step !== 4 && (
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-main hover:text-accent-hover transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      )}

    </AuthCard>
  );
}
