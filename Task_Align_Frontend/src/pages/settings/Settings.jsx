import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Pencil,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  AlertCircle,
  Save,
  Camera,
  Upload,
} from "lucide-react";
import InputField from "@/components/common/InputField.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import PasswordInput from "@/components/common/PasswordInput.jsx";
import Button from "@/components/common/Button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { authService } from "@/services/authService.js";
import { parseApiError } from "@/utils/errorHandler.js";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getProfileImageUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith("http")) return profilePicture;
  let cleanPath = profilePicture.replace(/\\/g, "/");
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }
  return `${API_BASE_URL}${cleanPath}`;
};

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile) updateUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const currentTabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    currentTabParam === "password" ? "password" : "profile"
  );
  const [isEditing, setIsEditing] = useState(currentTabParam === "edit");

  useEffect(() => {
    if (currentTabParam === "password") {
      setActiveTab("password");
    } else if (currentTabParam === "edit") {
      setActiveTab("profile");
      setIsEditing(true);
    } else if (currentTabParam === "profile") {
      setActiveTab("profile");
    }
  }, [currentTabParam]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    gender: user?.gender || "MALE",
    state: user?.state || "",
    country: user?.country || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(getProfileImageUrl(user?.profilePicture));
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        mobileNumber: user.mobileNumber || "",
        gender: user.gender || "MALE",
        state: user.state || "",
        country: user.country || "",
      });
      setAvatarPreview(getProfileImageUrl(user.profilePicture));
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      const payload = {
        fullName: editForm.fullName,
        mobileNumber: user?.mobileNumber || "",
        gender: editForm.gender,
        state: editForm.state,
        country: editForm.country,
      };
      const response = await authService.editProfile(payload, selectedProfilePicture);
      const profilePictureUrl = getProfileImageUrl(response.profilePicture);
      updateUserProfile({ ...response, profilePicture: response.profilePicture || null });
      setAvatarPreview(profilePictureUrl);
      setSelectedProfilePicture(null);
      setProfileSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setProfileError(parseApiError(err).message);
    } finally {
      setProfileLoading(false);
    }
  };

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError("New password is required.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(passwordForm);
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(parseApiError(err).message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-primary">Account & Settings</h1>
        <p className="text-sm text-ink-secondary mt-1">Manage your user profile and security credentials.</p>
      </div>

      <div className="flex border-b border-border-subtle gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => { changeTab("profile"); setIsEditing(false); }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "border-accent-main text-accent-main font-bold"
              : "border-transparent text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <User size={16} /> My Profile
        </button>
        <button
          type="button"
          onClick={() => changeTab("password")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "password"
              ? "border-accent-main text-accent-main font-bold"
              : "border-transparent text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <KeyRound size={16} /> Change Password
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-xs space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-lg font-bold text-ink-primary">My Profile</h2>
            <p className="text-xs text-ink-secondary">
              {isEditing ? "Update your personal details below." : "View and manage your account details."}
            </p>
          </div>


          {(profileError || profileSuccess) && (
            <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs sm:text-sm ${
              profileError ? "border border-status-danger-border bg-status-danger-bg text-status-danger-text" : "border border-status-success-border bg-status-success-bg text-status-success-text"
            }`}>
              {profileError ? <AlertCircle size={16} className="shrink-0 text-status-danger-text" /> : <CheckCircle2 size={16} className="shrink-0 text-status-success-text" />}
              <span>{profileError || profileSuccess}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-surface-app border border-border-subtle">
            <div className="relative group shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-surface-card shadow-sm" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full bg-accent-main text-2xl font-bold text-white shadow-sm">
                  {user?.initials || "U"}
                </div>
              )}
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 text-white cursor-pointer transition-opacity" title="Upload Picture">
                  <Camera size={18} />
                  <span className="text-[10px] font-semibold mt-0.5">Upload</span>
                </label>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-ink-primary truncate">{user?.fullName || "Not Specified"}</h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 text-accent-main hover:text-accent-hover px-2 py-0.5 rounded-lg hover:bg-accent-subtle transition-all cursor-pointer"
                    title="Edit Name & Profile"
                  >
                    <Pencil size={14} />
                    <span className="text-xs font-semibold">Edit</span>
                  </button>
                )}
              </div>
              <p className="text-sm text-ink-secondary truncate">{user?.email || "No Email Provided"}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-ink-secondary font-medium">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-card border border-border-subtle">
                  Mobile: {user?.mobileNumber || "N/A"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-card border border-border-subtle">
                  Gender: {user?.gender || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <form onSubmit={handleEditProfileSubmit} className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-card border border-border-subtle">
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border-strong bg-surface-card text-xs font-semibold text-ink-primary shadow-xs cursor-pointer hover:bg-surface-muted transition-colors"
                >
                  <Upload size={14} />
                  Choose Profile Picture
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <span className="text-xs text-ink-muted">PNG, JPG or GIF up to 2MB.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" icon={User} required value={editForm.fullName} onChange={(e) => setEditForm(p => ({...p, fullName: e.target.value}))} />
                <SelectField label="Gender" name="gender" required options={GENDER_OPTIONS} value={editForm.gender} onChange={(e) => setEditForm(p => ({...p, gender: e.target.value}))} />
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">Email Address <span className="text-xs text-ink-muted font-normal">(Read-only)</span></label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-muted text-ink-primary text-sm font-medium">
                    <Mail size={16} className="text-ink-secondary shrink-0" />
                    <span className="truncate">{user?.email || "—"}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1">Mobile Number <span className="text-xs text-ink-muted font-normal">(Read-only)</span></label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-muted text-ink-primary text-sm font-medium">
                    <Phone size={16} className="text-ink-secondary shrink-0" />
                    <span className="truncate">{user?.mobileNumber || "—"}</span>
                  </div>
                </div>
                <InputField label="State" icon={MapPin} placeholder="e.g. Maharashtra" value={editForm.state} onChange={(e) => setEditForm(p => ({...p, state: e.target.value}))} />
                <InputField label="Country" icon={Globe} placeholder="e.g. India" value={editForm.country} onChange={(e) => setEditForm(p => ({...p, country: e.target.value}))} />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={profileLoading} icon={Save}>Save Profile Changes</Button>
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { key: "fullName", label: "Full Name" },
                { key: "email", label: "Email Address" },
                { key: "mobileNumber", label: "Mobile Number" },
                { key: "gender", label: "Gender" },
                { key: "state", label: "State" },
                { key: "country", label: "Country" },
              ].map(({ key, label }) => (
                <div key={key} className="p-4 rounded-xl border border-border-subtle bg-surface-card">
                  <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">{label}</span>
                  <p className="text-sm font-semibold text-ink-primary">{user?.[key] || "—"}</p>
                </div>

              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "password" && (
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-xs space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h2 className="text-lg font-bold text-ink-primary">Change Password</h2>
            <p className="text-xs text-ink-secondary">Update your account password to keep your account secure.</p>
          </div>

          {(passwordError || passwordSuccess) && (
            <div className={`flex items-center gap-2 rounded-xl p-3.5 text-xs sm:text-sm ${
              passwordError ? "border border-status-danger-border bg-status-danger-bg text-status-danger-text" : "border border-status-success-border bg-status-success-bg text-status-success-text"
            }`}>
              {passwordError ? <AlertCircle size={16} className="shrink-0 text-status-danger-text" /> : <CheckCircle2 size={16} className="shrink-0 text-status-success-text" />}
              <span>{passwordError || passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            <PasswordInput label="Current Password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({...p, currentPassword: e.target.value}))} />
            <PasswordInput label="New Password" required placeholder="Uppercase, lowercase, digit & symbol" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({...p, newPassword: e.target.value}))} />
            <PasswordInput label="Confirm Password" required placeholder="Re-enter new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))} />
            <div className="pt-2">
              <Button type="submit" variant="primary" loading={passwordLoading} icon={KeyRound}>Change Password</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
