import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, LogIn, Send, AlertCircle } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard.jsx";
import AuthHeader from "@/components/auth/AuthHeader.jsx";
import LoginMethodToggle from "@/components/auth/LoginMethodToggle.jsx";
import InputField from "@/components/common/InputField.jsx";
import PasswordInput from "@/components/common/PasswordInput.jsx";
import OtpInput from "@/components/auth/OtpInput.jsx";
import Checkbox from "@/components/common/Checkbox.jsx";
import Button from "@/components/common/Button.jsx";
import { isValidEmail, isValidMobile, isOtp } from "@/utils/validators.js";
import { authService } from "@/services/authService.js";
import { parseApiError } from "@/utils/errorHandler.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuthContextUser } = useAuth();
  const [tab, setTab] = useState("email");

  // Global server error alert
  const [serverError, setServerError] = useState("");

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [emailErrors, setEmailErrors] = useState({});
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Mobile login state
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  // Testing purpose only - mobile login OTP from backend response
  const [serverOtp, setServerOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileErrors, setMobileErrors] = useState({});
  const [mobileTouched, setMobileTouched] = useState(false);
  const [otpTouched, setOtpTouched] = useState(false);

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
      setEmailErrors((prev) => ({ ...prev, email: isValidEmail(clean) }));
    }
  };

  const handlePasswordChange = (e) => {
    const clean = e.target.value.replace(/\s/g, "").slice(0, 20);
    setPassword(clean);
    if (passwordTouched) {
      setEmailErrors((prev) => ({
        ...prev,
        password: !clean ? "Password is required" : null,
      }));
    }
  };

  const handleMobileChange = (e) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(clean);
    setMobileTouched(true);
    setMobileErrors((prev) => ({ ...prev, mobile: isValidMobile(clean) }));
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailErrors((prev) => ({ ...prev, email: isValidEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setEmailErrors((prev) => ({
      ...prev,
      password: !password ? "Password is required" : null,
    }));
  };

  const handleMobileBlur = () => {
    setMobileTouched(true);
    setMobileErrors((prev) => ({ ...prev, mobile: isValidMobile(mobile) }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setServerError("");
    setEmailTouched(true);
    setPasswordTouched(true);

    const emailErr = isValidEmail(email);
    const passErr = !password ? "Password is required" : null;
    const errs = {};
    if (emailErr) errs.email = emailErr;
    if (passErr) errs.password = passErr;
    setEmailErrors(errs);
    if (Object.keys(errs).length) return;

    setEmailLoading(true);
    try {
      const response = await authService.login({
        email,
        password,
        rememberme: remember,
      });
      setAuthContextUser(response);
      navigate("/dashboard");
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length) {
        setEmailErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setServerError("");
    setMobileTouched(true);
    const mobErr = isValidMobile(mobile);
    if (mobErr) {
      setMobileErrors((prev) => ({ ...prev, mobile: mobErr }));
      return;
    }
    setMobileErrors({});
    setSendingOtp(true);

    try {
      const response = await authService.sendMobileOtp({
        mobileNumber: mobile,
      });

      console.log("Mobile OTP:", response);
      setServerOtp(response);
      setOtpSent(true);
      setShowOtp(false);
    } catch (err) {
      const parsed = parseApiError(err);
      setServerError(parsed.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleMobileLogin = async (e) => {
    e.preventDefault();
    setServerError("");
    setMobileTouched(true);
    setOtpTouched(true);

    const mobErr = isValidMobile(mobile);
    let otpErr = null;
    if (!otpSent) otpErr = "Send an OTP before logging in";
    else if (!isOtp(otp)) otpErr = "Enter the OTP sent to your mobile";

    const errs = {};
    if (mobErr) errs.mobile = mobErr;
    if (otpErr) errs.otp = otpErr;
    setMobileErrors(errs);
    if (Object.keys(errs).length) return;

    setMobileLoading(true);
    try {
      const response = await authService.mobileLogin({
        mobileNumber: mobile,
        otp,
      });
      setAuthContextUser(response);
      navigate("/dashboard");
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length) {
        setMobileErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message);
    } finally {
      setMobileLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Welcome Back" subtitle="Login to continue to Task Align." />

      <LoginMethodToggle
        activeTab={tab}
        onChange={(t) => {
          setTab(t);
          setServerError("");
        }}
      />

      {serverError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {tab === "email" && (
        <form className="space-y-4" onSubmit={handleEmailLogin} noValidate>
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
            error={emailErrors.email}
          />
          <PasswordInput
            label="Password"
            icon={Lock}
            required
            maxLength={20}
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={emailErrors.password}
          />

          <div className="flex items-center justify-between text-sm py-1">
            <Checkbox
              label="Remember Me"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <Link
              to="/forgot-password"
              className="font-semibold text-accent-main hover:text-accent-hover transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            size="full"
            loading={emailLoading}
            disabled={emailLoading}
            icon={LogIn}
          >
            Login
          </Button>
        </form>
      )}

      {tab === "mobile" && (
        <form className="space-y-4" onSubmit={handleMobileLogin} noValidate>
          <InputField
            label="Mobile Number"
            icon={Phone}
            type="tel"
            required
            maxLength={10}
            placeholder="9876543210"
            value={mobile}
            onChange={handleMobileChange}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
              }
            }}
            onBlur={handleMobileBlur}
            error={mobileErrors.mobile}
          />

          {otpSent && (
            <OtpInput
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (otpTouched) {
                  setMobileErrors((prev) => ({
                    ...prev,
                    otp: !isOtp(e.target.value) ? "Enter the OTP sent to your mobile" : null,
                  }));
                }
              }}
              error={mobileErrors.otp}
            />
          )}

          <div className={otpSent ? "grid grid-cols-2 gap-3" : "grid"}>
            <Button
              type="button"
              variant="outline"
              loading={sendingOtp}
              disabled={sendingOtp}
              onClick={handleSendOtp}
              icon={Send}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </Button>

            {otpSent && (
              <Button type="submit" loading={mobileLoading} disabled={mobileLoading} icon={LogIn}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Login - Testing Purpose Only */}
          {otpSent && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setShowOtp((prev) => !prev)}
                className="text-sm font-medium text-[#657166] hover:text-[#1E2421]"
              >
                {showOtp ? "Hide OTP" : "Show OTP"}
              </button>

              {showOtp && (
                <p className="mt-2 text-sm font-semibold text-green-600">OTP: {serverOtp}</p>
              )}
            </div>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-accent-main hover:text-accent-hover transition-colors ml-1"
        >
          Register
        </Link>
      </p>

    </AuthCard>
  );
}
