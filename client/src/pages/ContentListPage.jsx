import { useEffect, useState } from "react";
import api from "../api/axios";
import PublicLayout from "../components/PublicLayout";
import ContentCard from "../components/ContentCard";

export default function ContentListPage({ type, eyebrow, title, description }) {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/content", { params: { type } })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  const categories = ["all", ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filtered = category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <PublicLayout>
      <section className="container-x pt-16 pb-10 text-center">
        <div className="section-eyebrow mb-3">{eyebrow}</div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        {description && <p className="text-white/60 max-w-2xl mx-auto">{description}</p>}
      </section>

      {categories.length > 2 && (
        <div className="container-x flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-xs border transition-colors ${
                category === c ? "bg-accent text-ink border-accent" : "border-white/20 text-white/60 hover:border-accent"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      )}

      <section className="container-x pb-24">
        {loading ? (
          <p className="text-center text-white/50">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/50">Nothing published here yet — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <ContentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
