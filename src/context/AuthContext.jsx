import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = {
  superadmin: { id: "u1", name: "Super Admin", email: "superadmin@nexacare.com", role: "superadmin" },
  admin: { id: "u2", name: "Hospital Admin", email: "admin@nexacare.com", role: "admin" },
  user: { id: "u3", name: "Front Desk User", email: "user@nexacare.com", role: "user" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ role }) => {
    const key = role || "user";
    const sessionUser = DEMO_USERS[key] || DEMO_USERS.user;
    setUser(sessionUser);
    return sessionUser;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
