import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_COLORS = {
  new: "border-accent text-accent",
  read: "border-white/20 text-white/60",
  archived: "border-white/10 text-white/30",
};

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    load();
  }, [filter]);

  function load() {
    setLoading(true);
    api
      .get("/contact/admin/all", { params: filter === "all" ? {} : { status: filter } })
      .then((res) => setSubmissions(res.data))
      .finally(() => setLoading(false));
  }

  async function markStatus(id, status) {
    await api.put(`/contact/admin/${id}/status`, { status });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this submission?")) return;
    await api.delete(`/contact/admin/${id}`);
    load();
  }

  function toggleExpand(item) {
    if (expanded === item._id) {
      setExpanded(null);
      return;
    }
    setExpanded(item._id);
    if (item.status === "new") markStatus(item._id, "read");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Contact Leads</h1>
      <p className="text-white/50 mb-6">Submissions from the "Build With Sensora" form.</p>

      <div className="flex gap-2 mb-6">
        {["all", "new", "read", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs border transition-colors ${
              filter === s ? "bg-accent text-ink border-accent" : "border-white/20 text-white/60 hover:border-accent"
            }`}
          >
            {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/50">Loading…</p>
      ) : submissions.length === 0 ? (
        <p className="text-white/50">No submissions here.</p>
      ) : (
        <div className="space-y-2">
          {submissions.map((item) => (
            <div key={item._id} className="card !p-4">
              <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(item)}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">{item.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/40 truncate">
                    {item.email} · {item.projectType} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-white/40 text-xs shrink-0">{expanded === item._id ? "Hide" : "View"}</span>
              </div>

              {expanded === item._id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  {item.company && <div className="text-sm"><span className="text-white/50">Company: </span>{item.company}</div>}
                  <div className="text-sm whitespace-pre-wrap">{item.message}</div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => markStatus(item._id, "new")} className="text-xs px-2.5 py-1 rounded-full border border-white/20 hover:border-accent">Mark New</button>
                    <button onClick={() => markStatus(item._id, "read")} className="text-xs px-2.5 py-1 rounded-full border border-white/20 hover:border-accent">Mark Read</button>
                    <button onClick={() => markStatus(item._id, "archived")} className="text-xs px-2.5 py-1 rounded-full border border-white/20 hover:border-accent">Archive</button>
                    <button onClick={() => handleDelete(item._id)} className="text-xs px-2.5 py-1 rounded-full border border-red-400/40 text-red-400 hover:border-red-400">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
