export default function FormField({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {label} {required ? "*" : ""}
      </span>
      <div className="mt-1">{children}</div>
      {error ? <p className="text-xs text-red-600 mt-1">{error}</p> : null}
    </label>
  );
}
