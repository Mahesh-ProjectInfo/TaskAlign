import { createContext, useContext, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "ta_token";
const COMPAT_TOKEN_KEY = "taskalign_token";
const USER_KEY = "ta_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(COMPAT_TOKEN_KEY) || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((authData) => {
    if (!authData) return;
    const extractedToken = authData.token;
    const userData = {
      userId: authData.userId,
      fullName: authData.fullName || authData.name || "User",
      email: authData.email || "",
      mobileNumber: authData.mobileNumber || "",
      gender: authData.gender || "",
      state: authData.state || "",
      country: authData.country || "",
      profilePicture: authData.profilePicture || null,
      initials: (authData.fullName || authData.name || "U")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };

    if (extractedToken) {
      localStorage.setItem(TOKEN_KEY, extractedToken);
      localStorage.setItem(COMPAT_TOKEN_KEY, extractedToken);
      setToken(extractedToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const updateUserProfile = useCallback((profileData) => {
    setUser((prev) => {
      const updated = { ...prev, ...profileData };
      if (profileData.fullName) {
        updated.initials = profileData.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(COMPAT_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("completed_assignment_ids");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      updateUserProfile,
    }),
    [user, token, login, logout, updateUserProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
