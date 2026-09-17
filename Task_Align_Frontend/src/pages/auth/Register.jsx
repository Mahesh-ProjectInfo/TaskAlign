import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Country, State } from "country-state-city";
import AuthCard from "@/components/auth/AuthCard.jsx";
import AuthHeader from "@/components/auth/AuthHeader.jsx";
import InputField from "@/components/common/InputField.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import PasswordInput from "@/components/common/PasswordInput.jsx";
import Button from "@/components/common/Button.jsx";
import {
  isValidFullName,
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidConfirmPassword,
} from "@/utils/validators.js";
import { authService } from "@/services/authService.js";
import { parseApiError } from "@/utils/errorHandler.js";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    country: "",
    state: "",
    password: "",
    confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, []);

  const selectedCountryObj = useMemo(() => {
    if (!form.country) return null;
    return Country.getAllCountries().find((c) => c.name === form.country);
  }, [form.country]);

  const stateOptions = useMemo(() => {
    if (!selectedCountryObj) return [];
    return State.getStatesOfCountry(selectedCountryObj.isoCode).map((s) => ({
      value: s.name,
      label: s.name,
    }));
  }, [selectedCountryObj]);

  const validateSingleField = (key, val, currentForm) => {
    switch (key) {
      case "fullName":
        return isValidFullName(val);
      case "email":
        return isValidEmail(val);
      case "mobile":
        return isValidMobile(val);
      case "gender":
        return !val ? "Gender is required" : null;
      case "country":
        return !val ? "Country is required" : null;
      case "state":
        return !val ? "State is required" : null;
      case "password":
        return isValidPassword(val);
      case "confirm":
        return isValidConfirmPassword(currentForm.password, val);
      default:
        return null;
    }
  };

  const setField = (k) => (e) => {
    const raw = e.target.value;
    let clean = raw;

    if (k === "fullName") {
      clean = raw
        .replace(/[^A-Za-z ]/g, "")
        .replace(/^\s+/, "")
        .replace(/ {2,}/g, " ")
        .slice(0, 50);
    } else if (k === "email") {
      clean = raw.replace(/[^a-zA-Z0-9@._+-]/g, "");
      const atIndex = clean.indexOf("@");
      if (atIndex !== -1) {
        clean = clean.slice(0, atIndex + 1) + clean.slice(atIndex + 1).replace(/@/g, "");
      }
      clean = clean.slice(0, 100);
    } else if (k === "mobile") {
      clean = raw.replace(/\D/g, "").slice(0, 10);
    } else if (k === "password") {
      clean = raw.replace(/\s/g, "").slice(0, 20);
    } else if (k === "confirm") {
      clean = raw.replace(/\s/g, "").slice(0, 64);
    }

    setForm((f) => {
      const updated = { ...f, [k]: clean };
      if (k === "country") {
        updated.state = "";
      }

      setTouched((prevTouched) => {
        const nextTouched = { ...prevTouched, [k]: true };

        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };

          const err = validateSingleField(k, clean, updated);
          if (err) {
            nextErrors[k] = err;
          } else {
            delete nextErrors[k];
          }

          if (k === "country") {
            delete nextErrors.state;
          }

          if (k === "password" && (nextTouched.confirm || updated.confirm)) {
            const confirmErr = isValidConfirmPassword(clean, updated.confirm);
            if (confirmErr) {
              nextErrors.confirm = confirmErr;
            } else {
              delete nextErrors.confirm;
            }
          }

          return nextErrors;
        });

        return nextTouched;
      });

      return updated;
    });
  };

  const handleBlur = (k) => () => {
    setTouched((prev) => ({ ...prev, [k]: true }));
    const err = validateSingleField(k, form[k], form);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next[k] = err;
      } else {
        delete next[k];
      }
      return next;
    });
  };

  const validateForm = () => {
    const errs = {};

    const nameErr = isValidFullName(form.fullName);
    if (nameErr) errs.fullName = nameErr;

    const emailErr = isValidEmail(form.email);
    if (emailErr) errs.email = emailErr;

    const mobileErr = isValidMobile(form.mobile);
    if (mobileErr) errs.mobile = mobileErr;

    if (!form.gender) errs.gender = "Gender is required";
    if (!form.country) errs.country = "Country is required";
    if (!form.state) errs.state = "State is required";

    const passErr = isValidPassword(form.password);
    if (passErr) errs.password = passErr;

    const confirmErr = isValidConfirmPassword(form.password, form.confirm);
    if (confirmErr) errs.confirm = confirmErr;

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    setTouched({
      fullName: true,
      email: true,
      mobile: true,
      gender: true,
      country: true,
      state: true,
      password: true,
      confirm: true,
    });

    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobileNumber: form.mobile.trim(),
        gender: form.gender,
        country: form.country,
        state: form.state,
        password: form.password,
        confirmPassword: form.confirm,
      };

      const res = await authService.register(payload);
      setSuccessMsg(res.message || "Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length) {
        setErrors(parsed.fieldErrors);
      }
      setServerError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader title="Create Account" subtitle="Register to use Task Align." />

      {serverError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-700">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Full Name"
            icon={User}
            required
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={setField("fullName")}
            onBlur={handleBlur("fullName")}
            error={errors.fullName}
          />
          <InputField
            label="Email Address"
            icon={Mail}
            type="email"
            required
            maxLength={100}
            placeholder="you@company.com"
            value={form.email}
            onChange={setField("email")}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
              }
              if (e.key === "@" && form.email.includes("@")) {
                e.preventDefault();
              }
            }}
            onBlur={handleBlur("email")}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Mobile Number"
            icon={Phone}
            type="tel"
            required
            placeholder="9876543210"
            value={form.mobile}
            onChange={setField("mobile")}
            onBlur={handleBlur("mobile")}
            error={errors.mobile || errors.mobileNumber}
          />
          <SelectField
            label="Gender"
            name="gender"
            required
            placeholder="Select Gender"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={setField("gender")}
            onBlur={handleBlur("gender")}
            error={errors.gender}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Country"
            name="country"
            required
            placeholder="Select Country"
            options={countryOptions}
            value={form.country}
            onChange={setField("country")}
            onBlur={handleBlur("country")}
            error={errors.country}
          />
          <SelectField
            label="State"
            name="state"
            required
            disabled={!form.country}
            placeholder={form.country ? "Select State" : "Select Country first"}
            options={stateOptions}
            value={form.state}
            onChange={setField("state")}
            onBlur={handleBlur("state")}
            error={errors.state}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordInput
            label="Password"
            icon={Lock}
            required
            maxLength={20}
            placeholder="Uppercase, lowercase, digit & symbol"
            value={form.password}
            onChange={setField("password")}
            onBlur={handleBlur("password")}
            error={errors.password}
          />
          <PasswordInput
            label="Confirm Password"
            icon={ShieldCheck}
            required
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={setField("confirm")}
            onBlur={handleBlur("confirm")}
            onPaste={(e) => e.preventDefault()}
            error={errors.confirm || errors.confirmPassword}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" size="full" loading={loading} disabled={loading} icon={UserPlus}>
            Register
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Login
        </Link>
      </p>

    </AuthCard>
  );
}
