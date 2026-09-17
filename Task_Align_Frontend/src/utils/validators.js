export const isValidFullName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Full name is required";
  if (str.length < 2) return "Full name must be at least 2 characters";
  if (str.length > 50) return "Full name must not exceed 50 characters";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Full name can contain letters and single spaces only";
  if (str.includes("  ")) return "Only single spaces are allowed between names";
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(str))
    return "Full name can contain letters and single spaces only";
  return null;
};

export const isValidAssignmentName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Assignment Name is required.";
  if (str.length < 2) return "Assignment Name must be at least 2 characters.";
  if (str.length > 100) return "Assignment Name must not exceed 100 characters.";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Assignment Name can contain letters, numbers, and single spaces only.";
  if (str.includes("  ")) return "Only single spaces are allowed between words.";
  if (!/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/.test(str))
    return "Assignment Name can contain letters, numbers, and single spaces only.";
  return null;
};


export const isValidEmail = (v) => {
  const str = v || "";
  if (!str.trim()) return "Email address is required";
  if (str.includes(" ")) return "Email address cannot contain spaces";
  if (str.length > 100) return "Email address cannot exceed 100 characters";
  if (str.includes("..")) return "Email address cannot contain consecutive dots";
  if (str.startsWith(".")) return "Username cannot start with a dot";

  const parts = str.split("@");
  if (parts.length !== 2) return "Enter a valid email address";

  const [localPart, domainPart] = parts;

  if (!localPart) return "Enter a valid email address";
  if (localPart.endsWith(".")) return "Username cannot end with a dot";
  if (!/^[A-Za-z0-9._+-]+$/.test(localPart)) return "Enter a valid email address";

  if (!domainPart) return "Enter a valid email address";
  if (
    !/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*\.[A-Za-z]{2,}$/.test(
      domainPart,
    )
  ) {
    return "Enter a valid email address";
  }

  return null;
};

export const isValidMobile = (v) => {
  const str = v || "";
  if (!str.trim()) return "Mobile number is required";
  if (!/^[6-9]/.test(str)) return "Mobile number must start with 6, 7, 8, or 9";
  if (str.length !== 10) return "Mobile number must contain exactly 10 digits";
  return null;
};

export const isValidPassword = (v) => {
  const str = v || "";
  if (!str) return "Password is required";
  if (str.includes(" ")) return "Password cannot contain spaces";
  if (str.length < 8) return "Password must be at least 8 characters";
  if (str.length > 20) return "Password must not exceed 20 characters";
  if (!/[A-Z]/.test(str)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(str)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(str)) return "Password must contain at least one number";
  if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str)) {
    return "Password must contain at least one special character";
  }
  return null;
};

export const isValidConfirmPassword = (password, confirm) => {
  if (!confirm) return "Confirm password is required";
  if (confirm.includes(" ")) return "Confirm password cannot contain spaces";
  if (password !== confirm) return "Passwords do not match";
  return null;
};

export const isEmail = (v) => isValidEmail(v) === null;

export const isMobile = (v) => isValidMobile(v) === null;

export const isOtp = (v) => /^[0-9]{4,6}$/.test((v || "").trim());

export const isStrongPassword = (v) => isValidPassword(v) === null;

export const notEmpty = (v) => (v || "").trim().length > 0;

export const isValidRoleName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Role Name is required.";
  if (str.length < 2) return "Role Name must be at least 2 characters.";
  if (str.length > 50) return "Role Name must not exceed 50 characters.";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Role Name can contain letters and single spaces only.";
  if (str.includes("  ")) return "Only single spaces are allowed between words.";
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(str))
    return "Role Name can contain letters and single spaces only.";
  return null;
};

export const isValidSkillName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Skill Name is required.";
  if (str.length < 2) return "Skill Name must be at least 2 characters.";
  if (str.length > 50) return "Skill Name must not exceed 50 characters.";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Skill Name can contain letters and single spaces only.";
  if (str.includes("  ")) return "Only single spaces are allowed between words.";
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(str))
    return "Skill Name can contain letters and single spaces only.";
  return null;
};

export const isValidResourceName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Resource Name is required.";
  if (str.length < 2) return "Resource Name must be at least 2 characters.";
  if (str.length > 50) return "Resource Name must not exceed 50 characters.";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Resource Name can contain letters and single spaces only.";
  if (str.includes("  ")) return "Only single spaces are allowed between words.";
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(str))
    return "Resource Name can contain letters and single spaces only.";
  return null;
};

export const isValidSalary = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Monthly Salary is required.";
  if (str.startsWith("0")) return "Monthly Salary must be greater than 0.";
  if (str.includes(" ")) return "Monthly Salary cannot contain spaces.";
  if (!/^\d+(\.\d{1,2})?$/.test(str))
    return "Enter a valid salary amount (up to 2 decimal places).";
  const num = Number(str);
  if (Number.isNaN(num) || num <= 0) return "Monthly Salary must be greater than 0.";
  if (str.length > 10) return "Monthly Salary must not exceed 10 characters.";
  return null;
};

export const isValidRating = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Performance Rating is required.";
  if (str.startsWith("0")) return "Performance Rating must be between 1 and 100.";
  if (str.includes(" ")) return "Performance Rating cannot contain spaces.";
  if (!/^\d+(\.\d{1,2})?$/.test(str)) return "Performance Rating must be a valid number.";
  const num = Number(str);
  if (Number.isNaN(num)) return "Performance Rating must be a valid number.";
  if (num < 1) return "Performance Rating must be at least 1.";
  if (num > 100) return "Performance Rating must not exceed 100.";
  return null;
};

export const isValidTaskName = (v) => {
  const str = v || "";
  if (!str.trim()) return "Task Name is required.";
  if (str.length < 2) return "Task Name must be at least 2 characters.";
  if (str.length > 50) return "Task Name must not exceed 50 characters.";
  if (str.startsWith(" ") || str.endsWith(" "))
    return "Task Name can contain letters and single spaces only.";
  if (str.includes("  ")) return "Only single spaces are allowed between words.";
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(str))
    return "Task Name can contain letters and single spaces only.";
  return null;
};

export const isValidEstimatedEffort = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Estimated effort is required";
  if (!/^\d+$/.test(str)) return "Estimated effort must contain numbers only";
  if (str.startsWith("0")) return "Estimated effort must be between 1 and 30 days";
  const num = Number(str);
  if (num < 1 || num > 30) return "Estimated effort must be between 1 and 30 days";
  return null;
};

export const isValidTotalBudget = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Total budget is required";
  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    return "Total budget must contain numbers only, with an optional decimal point";
  }
  const num = Number(str);
  if (Number.isNaN(num) || num <= 0) return "Total budget must be greater than 0";
  if (num > 99999999) return "Total budget cannot exceed ₹99,999,999";
  return null;
};

export const isValidTimeline = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Timeline is required";
  if (!/^\d+$/.test(str)) return "Timeline must contain numbers only";
  if (str.startsWith("0")) return "Timeline must be between 1 and 100 days";
  const num = Number(str);
  if (num < 1 || num > 100) return "Timeline must be between 1 and 100 days";
  return null;
};

export const isValidWorkingDays = (v) => {
  const str = String(v ?? "").trim();
  if (!str) return "Working days per month is required";
  if (!/^\d+$/.test(str)) return "Working days per month must contain numbers only";
  if (str.startsWith("0")) return "Working days per month must be between 1 and 31";
  const num = Number(str);
  if (num < 1 || num > 31) return "Working days per month must be between 1 and 31";
  return null;
};


