import { useEffect, useState } from "react";
import api from "../api/axios";
import { toDirectImageUrl } from "../utils/driveImage";

const SECTION_DEFS = [
  { key: "home_hero", label: "Homepage Hero", hasButtons: true },
  { key: "about_company", label: "About / Company Page", hasButtons: false },
];

export default function SectionsManager() {
  const [sections, setSections] = useState({});
  const [saving, setSaving] = useState(null);
  const [savedFlash, setSavedFlash] = useState(null);

  useEffect(() => {
    api.get("/sections").then((res) => {
      const map = {};
      res.data.forEach((s) => (map[s.key] = s));
      setSections(map);
    });
  }, []);

  function updateField(key, field, value) {
    setSections((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { key }), [field]: value },
    }));
  }

  function updateButton(key, index, field, value) {
    setSections((prev) => {
      const buttons = [...(prev[key]?.buttons || [])];
      buttons[index] = { ...buttons[index], [field]: value };
      return { ...prev, [key]: { ...(prev[key] || { key }), buttons } };
    });
  }

  async function handleSave(key) {
    setSaving(key);
    try {
      const payload = sections[key] || { key };
      const res = await api.put(`/sections/admin/${key}`, payload);
      setSections((prev) => ({ ...prev, [key]: res.data }));
      setSavedFlash(key);
      setTimeout(() => setSavedFlash(null), 1500);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Homepage / Text Sections</h1>
      <p className="text-white/50 mb-8">Edit the wording shown on key pages without touching code.</p>

      <div className="space-y-8">
        {SECTION_DEFS.map((def) => {
          const s = sections[def.key] || {};
          return (
            <div key={def.key} className="card space-y-4">
              <h2 className="font-semibold">{def.label}</h2>

              <div>
                <label className="text-sm text-white/70 block mb-1">Eyebrow / Title</label>
                <input
                  value={s.title || ""}
                  onChange={(e) => updateField(def.key, "title", e.target.value)}
                  className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-1">Headline</label>
                <input
                  value={s.subtitle || ""}
                  onChange={(e) => updateField(def.key, "subtitle", e.target.value)}
                  className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-1">Body text</label>
                <textarea
                  rows={4}
                  value={s.body || ""}
                  onChange={(e) => updateField(def.key, "body", e.target.value)}
                  className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/70 block mb-1">Image (Google Drive link)</label>
                <div className="flex items-center gap-4">
                  {s.image && (
                    <img
                      src={toDirectImageUrl(s.image)}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-lg border border-white/10 bg-white/5"
                      onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                      onLoad={(e) => (e.currentTarget.style.visibility = "visible")}
                    />
                  )}
                  <input
                    type="text"
                    value={s.image || ""}
                    onChange={(e) => updateField(def.key, "image", e.target.value)}
                    placeholder="Paste Google Drive share link (Anyone with the link → Viewer)"
                    className="flex-1 bg-ink border border-white/15 rounded-lg px-4 py-2.5 focus:border-accent outline-none text-sm"
                  />
                </div>
              </div>

              {def.hasButtons && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-sm text-white/70 block">Button {i + 1}</label>
                      <input
                        placeholder="Label"
                        value={s.buttons?.[i]?.label || ""}
                        onChange={(e) => updateButton(def.key, i, "label", e.target.value)}
                        className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                      />
                      <input
                        placeholder="Link (e.g. /contact)"
                        value={s.buttons?.[i]?.link || ""}
                        onChange={(e) => updateButton(def.key, i, "link", e.target.value)}
                        className="w-full bg-ink border border-white/15 rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button onClick={() => handleSave(def.key)} disabled={saving === def.key} className="btn-primary !py-2 !px-6 text-sm disabled:opacity-50">
                  {saving === def.key ? "Saving…" : "Save"}
                </button>
                {savedFlash === def.key && <span className="text-accent text-sm">Saved ✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
