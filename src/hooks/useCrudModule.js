import { useCallback, useEffect, useState } from "react";
import { hospitalService } from "../services/api/hospitalService";

export function useCrudModule(moduleKey) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await hospitalService.list(moduleKey);
    setItems(data);
    setLoading(false);
  }, [moduleKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createItem = async (payload) => {
    const newItem = await hospitalService.create(moduleKey, payload);
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = async (id, payload) => {
    const updated = await hospitalService.update(moduleKey, id, payload);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const deleteItem = async (id) => {
    await hospitalService.remove(moduleKey, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, loading, refresh, createItem, updateItem, deleteItem };
}
