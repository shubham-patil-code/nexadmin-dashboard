import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { hospitalService } from "../services/api/hospitalService";

const BadgeContext = createContext({
  badges: {},
  refreshBadges: () => {},
});

/**
 * Badge rules — only ACTIONABLE alerts are counted:
 *
 * Appointments : Scheduled or Rescheduled (upcoming, needs attention)
 * Inventory    : Items where stock < minStock (critical low-stock)
 * Reports      : Entries with trend "Monitor" (need admin action)
 * Notifications: Unread notifications
 */

const POLL_INTERVAL_MS = 30_000; // auto-refresh every 30 seconds

export function BadgeProvider({ children }) {
  const [badges, setBadges] = useState({
    appointments: 0,
    inventory: 0,
    reports: 0,
    notifications: 0,
  });
  const intervalRef = useRef(null);

  const computeBadges = useCallback(async () => {
    try {
      const [appointments, inventory, reports, notifications] = await Promise.all([
          hospitalService.list("appointments"),
          hospitalService.list("inventory"),
          hospitalService.list("reports"),
          hospitalService.list("notifications"),
        ]);

      // Appointments: count only Scheduled/Rescheduled (actionable — not completed or cancelled)
      const appointmentBadge = appointments.filter(
        (a) => a.status === "Scheduled" || a.status === "Rescheduled"
      ).length;

      // Inventory: items where current stock is below minimum threshold
      const inventoryBadge = inventory.filter(
        (item) => Number(item.stock ?? item.quantity ?? 0) < Number(item.minStock ?? 0)
      ).length;

      // Reports: entries that need monitoring/action
      const reportBadge = reports.filter(
        (r) => String(r.trend || "").toLowerCase() === "monitor"
      ).length;

      // Notifications: unread count
      const notificationBadge = notifications.filter((n) => !n.read).length;

      setBadges({
        appointments: appointmentBadge,
        inventory: inventoryBadge,
        reports: reportBadge,
        notifications: notificationBadge,
      });
    } catch (err) {
      console.error("[BadgeContext] Failed to compute badges:", err);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    computeBadges();
    intervalRef.current = setInterval(computeBadges, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [computeBadges]);

  return (
    <BadgeContext.Provider value={{ badges, refreshBadges: computeBadges }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgeContext);
}
