import { useState } from "react";

interface SearchFormProps {
  onSearch: (serviceType: string, city: string, area?: string) => void;
  isSearching: boolean;
}

export function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const [serviceType, setServiceType] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType.trim() || !city.trim()) return;
    onSearch(serviceType.trim(), city.trim(), area.trim() || undefined);
  };

  return (
    <div className="mb-6 md:mb-8 bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white">Find Potential Clients</h2>
          <p className="text-slate-400 text-xs md:text-sm">Discover businesses that need your services</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div>
            <label className="block text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">
              Service Type *
            </label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g., Interior Design"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Mumbai"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 md:mb-2">
              Area (Optional)
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., Bandra"
              className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching || !serviceType.trim() || !city.trim()}
              className="w-full py-2.5 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Clients</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
