import { useCallback, useEffect, useState } from "react";
import { aiService } from "../services/api/aiService";

export function useAIModule(moduleId, options = {}) {
  const { enabled = true, refreshInterval = 0 } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const load = useCallback(async () => {
    if (!enabled || !moduleId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getModuleData(moduleId);
      setData(result);
      setIsEmpty(!result?.table?.length && !result?.chart?.length);
    } catch (err) {
      setError(err?.message || "Failed to load module");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, moduleId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!refreshInterval || !enabled) return undefined;
    const id = setInterval(load, refreshInterval);
    return () => clearInterval(id);
  }, [refreshInterval, enabled, load]);

  return { data, loading, error, isEmpty, reload: load };
}

export function useAIInsights(options = {}) {
  const { refreshInterval = 30000 } = options;
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getInsightsDashboard();
      setDashboard(result);
    } catch (err) {
      setError(err?.message || "Failed to load AI insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!refreshInterval) return undefined;
    const id = setInterval(load, refreshInterval);
    return () => clearInterval(id);
  }, [refreshInterval, load]);

  return { dashboard, loading, error, reload: load };
}
