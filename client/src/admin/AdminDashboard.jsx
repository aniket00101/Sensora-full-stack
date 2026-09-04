import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const types = [
  { type: "technology", label: "Technologies" },
  { type: "solution", label: "Solutions" },
  { type: "product", label: "Products" },
  { type: "project", label: "Projects" },
  { type: "research", label: "R&D Items" },
  { type: "career", label: "Careers" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    api.get("/content/admin/all").then((res) => {
      const c = {};
      res.data.forEach((item) => {
        c[item.type] = (c[item.type] || 0) + 1;
      });
      setCounts(c);
    });
    api.get("/contact/admin/all", { params: { status: "new" } }).then((res) => setNewLeads(res.data.length));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-white/50 mb-8">Everything on the public site is controlled from here.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {types.map((t) => (
          <Link key={t.type} to={`/admin/content/${t.type}`} className="card">
            <div className="text-3xl font-bold mb-1">{counts[t.type] || 0}</div>
            <div className="text-white/60 text-sm">{t.label}</div>
          </Link>
        ))}
      </div>

      <Link to="/admin/submissions" className="card block max-w-sm">
        <div className="text-3xl font-bold mb-1 text-accent">{newLeads}</div>
        <div className="text-white/60 text-sm">New contact leads awaiting review</div>
      </Link>
    </div>
  );
}
