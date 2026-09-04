import { useEffect, useState } from "react";
import api from "../api/axios";
import PublicLayout from "../components/PublicLayout";
import { toDirectImageUrl } from "../utils/driveImage";

export default function About() {
  const [section, setSection] = useState(null);

  useEffect(() => {
    api.get("/sections/about_company").then((res) => setSection(res.data)).catch(() => {});
  }, []);

  return (
    <PublicLayout>
      <section className="container-x pt-16 pb-24 max-w-3xl mx-auto text-center">
        <div className="section-eyebrow mb-3">Company</div>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">{section?.title || "About Sensora Technology"}</h1>
        {section?.image && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={toDirectImageUrl(section.image)}
              alt={section?.title || "About Sensora"}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <p className="text-white/70 text-lg leading-relaxed">
          {section?.body ||
            "Sensora Technology Private Limited is a deep-tech engineering company working across advanced sensing, autonomous systems, robotics, drones, VTOL platforms and intelligent electronics."}
        </p>
        <p className="text-accent uppercase tracking-widest text-sm mt-10">
          Sensing → Intelligence → Decision → Autonomous Action
        </p>
      </section>
    </PublicLayout>
  );
}
