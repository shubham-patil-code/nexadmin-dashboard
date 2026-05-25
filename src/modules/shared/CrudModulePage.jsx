import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { useCrudModule } from "../../hooks/useCrudModule";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";
import DataTable from "../../components/common/DataTable";

export default function CrudModulePage({ title, moduleKey, fields }) {
  const { items, loading, createItem, deleteItem } = useCrudModule(moduleKey);
  const [form, setForm] = useState(Object.fromEntries(fields.map((f) => [f.key, ""])));
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const columns = useMemo(() => ["id", ...fields.map((f) => f.key)], [fields]);

  const validate = () => {
    const nextErrors = {};
    fields.forEach((field) => {
      if (field.required && !String(form[field.key] || "").trim()) {
        nextErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onAdd = async () => {
    if (!validate()) return;
    await createItem(form);
    setForm(Object.fromEntries(fields.map((f) => [f.key, ""])));
    setErrors({});
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
        <button type="button" className="btn-primary gap-2" onClick={() => setOpen(true)}>
          <Plus size={16} /> Add New
        </button>
      </div>

      <AppModal open={open} title={`Create ${title}`} onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((field) => (
            <FormField key={field.key} label={field.label} required={field.required} error={errors[field.key]}>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.label}
                value={form[field.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              />
            </FormField>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <button type="button" className="btn-primary gap-2" onClick={onAdd}>
            <Save size={16} /> Save
          </button>
        </div>
      </AppModal>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Save size={16} className="text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Records</h3>
        </div>
        {loading ? (
          <div className="p-6 text-xs text-gray-500">Loading...</div>
        ) : (
          <DataTable columns={columns} rows={items} onDelete={deleteItem} />
        )}
      </div>
    </div>
  );
}
