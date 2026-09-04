import { toDirectImageUrl } from "../utils/driveImage";

export default function ContentCard({ item }) {
  return (
    <div className="card flex flex-col h-full">
      {item.image && (
        <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-white/5">
          <img
            src={toDirectImageUrl(item.image)}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {item.category && <div className="section-eyebrow mb-2">{item.category}</div>}
      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
      {item.shortDescription && <p className="text-white/60 text-sm leading-relaxed">{item.shortDescription}</p>}
      {item.type === "career" && item.meta && (
        <div className="mt-3 flex gap-2 text-xs text-white/50">
          {item.meta.location && <span className="px-2 py-1 bg-white/5 rounded-full">{item.meta.location}</span>}
          {item.meta.employmentType && <span className="px-2 py-1 bg-white/5 rounded-full">{item.meta.employmentType}</span>}
        </div>
      )}
    </div>
  );
}
