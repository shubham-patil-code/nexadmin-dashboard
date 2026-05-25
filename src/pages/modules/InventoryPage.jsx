import { useMemo, useState } from "react";
import { AlertTriangle, Package2, Plus, ShoppingCart, Truck, Search, CheckCircle2, TrendingDown } from "lucide-react";
import AppModal from "../../components/common/AppModal";
import FormField from "../../components/common/FormField";
import { useCrudModule } from "../../hooks/useCrudModule";

const initialItemForm = {
  name: "",
  category: "Medicine",
  stock: "",
  minStock: "",
  vendor: "",
  purchaseDate: "",
  purchaseQty: "",
  purchaseCost: "",
};

export default function InventoryPage() {
  const { items, loading, createItem, updateItem } = useCrudModule("inventory");
  const { items: suppliers } = useCrudModule("suppliers");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialItemForm);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (it) =>
        String(it.name || "").toLowerCase().includes(q) ||
        String(it.id || "").toLowerCase().includes(q) ||
        String(it.category || "").toLowerCase().includes(q) ||
        String(it.vendor || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const lowStockCount = filtered.filter((it) => Number(it.stock || 0) <= Number(it.minStock || 0)).length;
  const vendorCount = new Set(filtered.map((it) => it.vendor).filter(Boolean)).size;
  const totalStock = filtered.reduce((sum, it) => sum + Number(it.stock || 0), 0);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Item name is required";
    if (!form.stock || Number(form.stock) < 0) next.stock = "Valid stock is required";
    if (!form.minStock || Number(form.minStock) < 0) next.minStock = "Valid min stock is required";
    if (!form.vendor.trim()) next.vendor = "Vendor is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onAdd = async () => {
    if (!validate()) return;
    const selectedSupplier = suppliers.find((s) => s.name === form.vendor);
    await createItem({
      name: form.name,
      category: form.category,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      vendor: form.vendor,
      supplierId: selectedSupplier?.id,
      purchaseDate: form.purchaseDate || "-",
      purchaseQty: Number(form.purchaseQty || 0),
      purchaseCost: Number(form.purchaseCost || 0),
    });
    setForm(initialItemForm);
    setErrors({});
    setOpen(false);
  };

  const onReceiveStock = async (item) => {
    const qtyStr = window.prompt(`Enter received quantity for ${item.name}`, "0");
    if (!qtyStr) return;
    const qty = Number(qtyStr);
    if (!Number.isFinite(qty) || qty <= 0) return;
    await updateItem(item.id, { ...item, stock: Number(item.stock || 0) + qty });
  };

  const getStockStatus = (stock, minStock) => {
    const s = Number(stock || 0);
    const m = Number(minStock || 0);
    if (s <= m) return { label: 'Low Stock', color: 'text-red-700 bg-red-50 border-red-200', barColor: 'bg-red-500' };
    if (s <= m * 1.5) return { label: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-amber-500' };
    return { label: 'Healthy', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track medicines, equipment, vendors, and stock levels.
          </p>
        </div>
        <button type="button" className="btn-primary gap-2" onClick={() => setOpen(true)}>
          <Plus size={16} />
          Add Inventory Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Package2 size={48} className="text-blue-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-blue-800 mb-1">Total Stock Units</div>
          <p className="text-base font-bold text-blue-900">{totalStock.toLocaleString()}</p>
          <div className="mt-3 text-xs text-blue-700 font-medium flex items-center gap-1">
            <CheckCircle2 size={14} /> Tracking {filtered.length} unique items
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-soft relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Truck size={48} className="text-slate-600" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Active Vendors</div>
          <p className="text-base font-bold text-slate-900">{vendorCount}</p>
          <div className="mt-3 text-xs text-slate-500 font-medium flex items-center gap-1">
            Across all categories
          </div>
        </div>

        <div className={`p-5 rounded-xl border shadow-soft relative overflow-hidden ${lowStockCount > 0 ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <AlertTriangle size={48} className={lowStockCount > 0 ? 'text-red-600' : 'text-emerald-600'} />
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${lowStockCount > 0 ? 'text-red-800' : 'text-emerald-800'}`}>Low Stock Alerts</div>
          <p className={`text-base font-bold ${lowStockCount > 0 ? 'text-red-900' : 'text-emerald-900'}`}>{lowStockCount}</p>
          <div className={`mt-3 text-xs font-medium flex items-center gap-1 ${lowStockCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
            <TrendingDown size={14} /> {lowStockCount > 0 ? 'Requires immediate action' : 'All stock levels are healthy'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
              <ShoppingCart size={20} />
            </div>
            <h2 className="font-semibold text-slate-900 text-base">Stock Tracker</h2>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine, equipment..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Package2 size={48} className="text-slate-300 mb-4" />
            <p className="font-medium text-slate-700 text-base">No inventory items found</p>
            <p className="text-xs">Add some items to start tracking your stock.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase text-sm font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Item & Category</th>
                  <th className="px-6 py-4 font-semibold">Stock Level</th>
                  <th className="px-6 py-4 font-semibold">Vendor & Purchase Info</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((it) => {
                  const status = getStockStatus(it.stock, it.minStock);
                  const progress = Math.min(100, Math.max(5, (Number(it.stock || 0) / (Number(it.minStock || 1) * 3)) * 100));

                  return (
                    <tr key={it.id} className={`hover:bg-slate-50/50 transition-colors ${status.label === 'Low Stock' ? 'bg-red-50/20' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{it.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{it.id} • {it.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700">{it.stock} units</span>
                            <span className="text-slate-400">Min: {it.minStock}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full ${status.barColor}`} style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">{it.vendor || "-"}</span>
                          <span className="text-xs text-slate-500 mt-0.5">
                            Bought: {it.purchaseQty || 0} on {it.purchaseDate || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${status.color}`}>
                          {status.label === 'Low Stock' && <AlertTriangle size={12} />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-lg transition-colors border border-brand-100"
                          onClick={() => onReceiveStock(it)}
                        >
                          Receive Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppModal open={open} title="Add Inventory Item" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Item Name" required error={errors.name}>
            <input
              className="input-control"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Paracetamol 500mg"
            />
          </FormField>
          <FormField label="Category">
            <select
              className="input-control"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              <option>Medicine</option>
              <option>Equipment</option>
              <option>Consumable</option>
              <option>Surgical</option>
            </select>
          </FormField>
          <FormField label="Current Stock" required error={errors.stock}>
            <input
              type="number"
              className="input-control"
              value={form.stock}
              onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
            />
          </FormField>
          <FormField label="Minimum Stock (Alert Level)" required error={errors.minStock}>
            <input
              type="number"
              className="input-control"
              value={form.minStock}
              onChange={(e) => setForm((p) => ({ ...p, minStock: e.target.value }))}
            />
          </FormField>

          <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Vendor & Purchase Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Vendor Name" required error={errors.vendor}>
                <input
                  className="input-control"
                  value={form.vendor}
                  onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))}
                  placeholder="Supplier Name"
                />
              </FormField>
              <FormField label="Purchase Date">
                <input
                  type="date"
                  className="input-control"
                  value={form.purchaseDate}
                  onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))}
                />
              </FormField>
              <FormField label="Purchase Quantity">
                <input
                  type="number"
                  className="input-control"
                  value={form.purchaseQty}
                  onChange={(e) => setForm((p) => ({ ...p, purchaseQty: e.target.value }))}
                />
              </FormField>
              <FormField label="Total Purchase Cost (₹)">
                <input
                  type="number"
                  className="input-control"
                  value={form.purchaseCost}
                  onChange={(e) => setForm((p) => ({ ...p, purchaseCost: e.target.value }))}
                />
              </FormField>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn-primary" onClick={onAdd}>
            Save Item
          </button>
        </div>
      </AppModal>
    </div>
  );
}
