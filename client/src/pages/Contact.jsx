import { useState } from "react";
import api from "../api/axios";
import PublicLayout from "../components/PublicLayout";

const projectTypes = [
  "Sensor Development",
  "Robotics",
  "Drone/VTOL",
  "Medical Technology",
  "Industrial Solution",
  "R&D Collaboration",
  "Other Custom Development",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: projectTypes[0],
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", company: "", projectType: projectTypes[0], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <PublicLayout>
      <section className="container-x pt-16 pb-24 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-eyebrow mb-3">Start a Project</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Build With Sensora</h1>
          <p className="text-white/60">Tell us what you're trying to sense, automate or make autonomous.</p>
        </div>

        {status === "sent" ? (
          <div className="card text-center py-14">
            <h2 className="text-xl font-semibold mb-2">Thanks — we'll be in touch.</h2>
            <p className="text-white/60">Our team typically responds within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-white/70 block mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-ink border border-white/15 rounded-lg px-4 py-3 focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-ink border border-white/15 rounded-lg px-4 py-3 focus:border-accent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-3 focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1">Project Type *</label>
              <select
                value={form.projectType}
                onChange={(e) => update("projectType", e.target.value)}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-3 focus:border-accent outline-none"
              >
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-white/70 block mb-1">Message *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full bg-ink border border-white/15 rounded-lg px-4 py-3 focus:border-accent outline-none"
              />
            </div>

            {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

            <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-50">
              {status === "sending" ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
      </section>
    </PublicLayout>
  );
}
