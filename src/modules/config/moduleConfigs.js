export const moduleConfigs = {
  patients: {
    title: "Patient Management",
    fields: [
      { key: "name", label: "Patient Name", required: true },
      { key: "dept", label: "Department", required: true },
      { key: "status", label: "Status", required: true },
      { key: "contact", label: "Contact", required: true },
    ],
  },
  appointments: {
    title: "Appointment Management",
    fields: [
      { key: "patient", label: "Patient", required: true },
      { key: "doctor", label: "Doctor", required: true },
      { key: "date", label: "Date", required: true },
      { key: "status", label: "Status", required: true },
    ],
  },
  staff: {
    title: "Doctors & Staff",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Role", required: true },
      { key: "dept", label: "Department", required: true },
      { key: "status", label: "Status", required: true },
    ],
  },
  billing: {
    title: "Billing & Payments",
    fields: [
      { key: "patient", label: "Patient", required: true },
      { key: "amount", label: "Amount", required: true },
      { key: "paid", label: "Paid", required: true },
      { key: "status", label: "Status", required: true },
    ],
  },
  inventory: {
    title: "Inventory Management",
    fields: [
      { key: "name", label: "Item Name", required: true },
      { key: "category", label: "Category", required: true },
      { key: "stock", label: "Stock", required: true },
      { key: "minStock", label: "Min Stock", required: true },
    ],
  },
  reports: {
    title: "Reports & Analytics",
    fields: [
      { key: "title", label: "Report Title", required: true },
      { key: "value", label: "Value", required: true },
      { key: "trend", label: "Trend", required: true },
    ],
  },
  notifications: {
    title: "Notifications",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "message", label: "Message", required: true },
      { key: "read", label: "Read", required: false },
    ],
  },
};
