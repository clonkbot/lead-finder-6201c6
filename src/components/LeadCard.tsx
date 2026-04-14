interface LeadCardProps {
  lead: {
    placeId: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    reviewCount?: number;
    businessTypes: string[];
    googleMapsLink: string;
    score: number;
    demandLevel: string;
  };
  onSave: () => void;
}

export function LeadCard({ lead, onSave }: LeadCardProps) {
  const getDemandColor = (level: string) => {
    switch (level) {
      case "High Demand":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Medium Demand":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatTypes = (types: string[]) => {
    return types
      .slice(0, 3)
      .map((t) => t.replace(/_/g, " "))
      .join(", ");
  };

  const copyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 md:p-4 hover:border-slate-600 transition-all group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-semibold text-white text-sm md:text-base truncate">{lead.name}</h3>
            <span className={`px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full border ${getDemandColor(lead.demandLevel)}`}>
              {lead.demandLevel}
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm truncate mb-2">{lead.address}</p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
            {lead.rating && (
              <span className="flex items-center gap-1 text-amber-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {lead.rating.toFixed(1)}
              </span>
            )}
            <span className="text-slate-500">
              {lead.reviewCount || 0} reviews
            </span>
            <span className="text-slate-500 hidden sm:inline">
              {formatTypes(lead.businessTypes)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
            <span className="text-amber-400 font-bold text-sm md:text-base">{lead.score}</span>
          </div>
          <div className="flex gap-1.5">
            {lead.phone && (
              <button
                onClick={copyPhone}
                title="Copy phone"
                className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            )}
            <a
              href={lead.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in Maps"
              className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit website"
                className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
            <button
              onClick={onSave}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
