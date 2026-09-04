import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { toDirectImageUrl } from "../utils/driveImage";

const TYPE_LABELS = {
  technology: "Technology",
  solution: "Solution",
  product: "Product",
  project: "Project",
  research: "R&D Item",
  career: "Career",
};

const emptyForm = {
  title: "",
  slug: "",
  category: "",
  shortDescription: "",
  description: "",
  image: "",
  tags: "",
  order: 0,
  published: true,
  meta: {},
};

export default function ContentManager() {
  const { type } = useParams();
  const label = TYPE_LABELS[type] || type;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item being edited, or "new"
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditing(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function load() {
    setLoading(true);
    api
      .get("/content/admin/all", { params: { type } })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }

  function startNew() {
    setForm({ ...emptyForm });
    setEditing("new");
    setError("");
  }

  function startEdit(item) {
    setForm({
      ...emptyForm,
      ...item,
      tags: (item.tags || []).join(", "),
      meta: item.meta || {},
    });
    setEditing(item._id);
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      type,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editing === "new") {
        await api.post("/content/admin", payload);
      } else {
        await api.put(`/content/admin/${editing}`, payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await api.delete(`/content/admin/${id}`);
    load();
  }

  async function togglePublished(item) {
    await api.put(`/content/admin/${item._id}`, { published: !item.published });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{label}s</h1>
          <p className="text-white/50 text-sm">Manage everything shown under "{label}" on the public site.</p>
        </div>
        {editing === null && (
          <button onClick={startNew} className="btn-primary !py-2 !px-5 text-sm">
            + New {label}
          </button>
        )}
      </div>

      {editing !== null && (
        <form onSubmit={handleSave} className="card mb-8 space-y-4">
          <h2 className="font-semibold">{editing === "new" ? `New ${label}` : `Edit ${label}`}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-1">Slug (leave blank to auto-generate)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-1">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Robotics, Sensors, Healthcare"
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 block mb-1">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1">Short description (card preview)</label>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1">Full description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70 block mb-1">Image (Google Drive link)</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img
                  src={toDirectImageUrl(form.image)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-lg border border-white/10 bg-white/5"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                  onLoad={(e) => (e.currentTarget.style.visibility = "visible")}
                />
              )}
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="Paste Google Drive share link (Anyone with the link → Viewer)"
                className="flex-1 bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none text-sm"
              />
            </div>
            <p className="text-xs text-white/40 mt-1">
              In Drive: right-click the image → Share → "Anyone with the link" → Viewer, then paste that link here.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-sm text-white/70 block mb-1">Display order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70 pb-2.5">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published (visible on the live site)
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary !py-2 !px-6 text-sm">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost !py-2 !px-6 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-white/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-white/50">No {label.toLowerCase()}s yet — add the first one.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="card !p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {item.image && (
                  <img
                    src={toDirectImageUrl(item.image)}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg shrink-0 bg-white/5"
                  />
                )}
                <div className="min-w-0">
                  <div className="font-semibold truncate">{item.title}</div>
                  <div className="text-xs text-white/40 truncate">
                    {item.category || "Uncategorized"} · order {item.order}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublished(item)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    item.published ? "border-accent text-accent" : "border-white/20 text-white/40"
                  }`}
                >
                  {item.published ? "Published" : "Draft"}
                </button>
                <button onClick={() => startEdit(item)} className="text-xs px-2.5 py-1 rounded-full border border-white/20 hover:border-accent">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="text-xs px-2.5 py-1 rounded-full border border-red-400/40 text-red-400 hover:border-red-400">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
