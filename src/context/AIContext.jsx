import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { aiService } from "../services/api/aiService";
import { useAuth } from "./AuthContext";

const AIContext = createContext(null);

const AI_ALLOWED_ROLES = ["superadmin", "admin"];

export function AIProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const canAccessAI = isAuthenticated && AI_ALLOWED_ROLES.includes(user?.role);

  const [alerts, setAlerts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshGlobal = useCallback(async () => {
    if (!canAccessAI) return;
    setLoading(true);
    try {
      const [alertList, activityList, recs, rt] = await Promise.all([
        aiService.getAlerts(),
        aiService.getActivity(15),
        aiService.getRecommendations(),
        aiService.refreshRealtime(),
      ]);
      setAlerts(alertList);
      setActivity(activityList);
      setRecommendations(recs);
      setRealtime(rt);
    } finally {
      setLoading(false);
    }
  }, [canAccessAI]);

  useEffect(() => {
    refreshGlobal();
    if (!canAccessAI) return undefined;
    const interval = setInterval(refreshGlobal, 45000);
    return () => clearInterval(interval);
  }, [canAccessAI, refreshGlobal]);

  const dismissAlert = useCallback(async (alertId) => {
    await aiService.dismissAlert(alertId);
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  }, []);

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  const value = useMemo(
    () => ({
      canAccessAI,
      alerts,
      activity,
      recommendations,
      realtime,
      loading,
      unreadAlertCount,
      refreshGlobal,
      dismissAlert,
    }),
    [canAccessAI, alerts, activity, recommendations, realtime, loading, unreadAlertCount, refreshGlobal, dismissAlert],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}

export { AI_ALLOWED_ROLES };
