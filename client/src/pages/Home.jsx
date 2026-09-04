import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PublicLayout from "../components/PublicLayout";
import ContentCard from "../components/ContentCard";
import { toDirectImageUrl } from "../utils/driveImage";

export default function Home() {
  const [hero, setHero] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    api.get("/sections/home_hero").then((res) => setHero(res.data)).catch(() => {});
    api.get("/content", { params: { type: "technology" } }).then((res) => setTechnologies(res.data.slice(0, 6)));
    api.get("/content", { params: { type: "solution" } }).then((res) => setSolutions(res.data.slice(0, 6)));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="container-x pt-20 pb-24 text-center">
        <div className="section-eyebrow mb-4">{hero?.title || "SENSORA TECHNOLOGY"}</div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          {hero?.subtitle || "Sensing Intelligence. Engineering Autonomy."}
        </h1>
        <p className="text-white/60 mt-6 max-w-2xl mx-auto text-lg">
          {hero?.body ||
            "From microscopic sensing elements to intelligent autonomous machines, Sensora Technology develops technologies that perceive, understand and interact with the physical world."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {(hero?.buttons?.length ? hero.buttons : [
            { label: "Explore Our Technologies", link: "/technologies" },
            { label: "Build With Sensora", link: "/contact" },
          ]).map((b) => (
            <Link key={b.label} to={b.link} className={b.label.toLowerCase().includes("build") ? "btn-ghost" : "btn-primary"}>
              {b.label}
            </Link>
          ))}
        </div>
        <p className="text-white/30 text-sm mt-10 tracking-widest uppercase">
          Sensing → Connectivity → Intelligence → Autonomy → Real-World Application
        </p>
        {hero?.image && (
          <div className="mt-12 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10">
            <img
              src={toDirectImageUrl(hero.image)}
              alt={hero?.title || "Sensora Technology"}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </section>

      {/* Technologies preview */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-eyebrow mb-2">Technology Pillars</div>
            <h2 className="text-2xl md:text-3xl font-bold">Advanced Sensors, Robotics & Autonomous Systems</h2>
          </div>
          <Link to="/technologies" className="text-accent text-sm hidden md:block hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((t) => (
            <ContentCard key={t._id} item={t} />
          ))}
        </div>
      </section>

      {/* Solutions preview */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-eyebrow mb-2">Applications</div>
            <h2 className="text-2xl md:text-3xl font-bold">Solutions Across Industries</h2>
          </div>
          <Link to="/solutions" className="text-accent text-sm hidden md:block hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <ContentCard key={s._id} item={s} />
          ))}
        </div>
      </section>

      {/* Custom dev pitch */}
      <section className="container-x py-20 text-center">
        <div className="card max-w-3xl mx-auto py-14 px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a problem that needs sensing, intelligence or autonomy?
          </h2>
          <p className="text-white/60 mb-8">Sensora can develop the solution — from requirement to field-validated product.</p>
          <Link to="/contact" className="btn-primary">Build With Sensora</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
