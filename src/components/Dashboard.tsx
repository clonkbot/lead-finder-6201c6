import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LeadTable } from "./LeadTable";
import { SearchForm } from "./SearchForm";
import { LeadCard } from "./LeadCard";

interface Lead {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  businessTypes: string[];
  googleMapsLink: string;
  latitude: number;
  longitude: number;
  score: number;
  demandLevel: string;
  serviceType: string;
  city: string;
  area?: string;
}

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [statusFilter, setStatusFilter] = useState("all");
  const [demandFilter, setDemandFilter] = useState("all");
  const [hasPhoneFilter, setHasPhoneFilter] = useState(false);
  const [newBusinessFilter, setNewBusinessFilter] = useState(false);
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const leads = useQuery(api.leads.list, {
    statusFilter,
    demandFilter,
    hasPhoneFilter,
    newBusinessFilter,
  });

  const searchPlaces = useAction(api.leads.searchPlaces);
  const saveMultipleLeads = useMutation(api.leads.saveMultipleLeads);

  const handleSearch = async (serviceType: string, city: string, area?: string) => {
    setIsSearching(true);
    setShowResults(true);
    try {
      const results = await searchPlaces({ serviceType, city, area });
      setSearchResults(results);
    } catch (error: any) {
      console.error("Search failed:", error);
      alert(error.message || "Search failed. Please check your API configuration.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAll = async () => {
    if (searchResults.length === 0) return;
    const result = await saveMultipleLeads({ leads: searchResults });
    alert(`Saved ${result.savedCount} leads. ${result.duplicateCount} duplicates skipped.`);
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSaveLead = async (lead: Lead) => {
    await saveMultipleLeads({ leads: [lead] });
    setSearchResults((prev) => prev.filter((l) => l.placeId !== lead.placeId));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial from-orange-500/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight">Lead Finder</h1>
              <p className="text-amber-500 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hidden sm:block">Demand Engine</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8">
        {/* Search Form */}
        <SearchForm onSearch={handleSearch} isSearching={isSearching} />

        {/* Search Results */}
        {showResults && (
          <div className="mb-6 md:mb-8 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Search Results</h2>
                <p className="text-slate-400 text-xs md:text-sm">
                  {isSearching
                    ? "Searching for potential clients..."
                    : `Found ${searchResults.length} potential leads`}
                </p>
              </div>
              <div className="flex gap-2">
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
                  >
                    Save All ({searchResults.length})
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSearchResults([]);
                  }}
                  className="px-4 py-2 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {isSearching ? (
              <div className="flex items-center justify-center py-12 md:py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 font-mono text-sm">Scanning businesses...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-3 md:gap-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {searchResults.map((lead) => (
                  <LeadCard key={lead.placeId} lead={lead} onSave={() => handleSaveLead(lead)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16 text-slate-500">
                <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm md:text-base">No leads found matching criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Saved Leads Section */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Saved Leads</h2>
              <p className="text-slate-400 text-xs md:text-sm">
                {leads === undefined ? "Loading..." : `${leads.length} leads in your pipeline`}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <select
                value={demandFilter}
                onChange={(e) => setDemandFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Demand</option>
                <option value="High Demand">High Demand</option>
                <option value="Medium Demand">Medium Demand</option>
                <option value="Low Demand">Low Demand</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Not Contacted">Not Contacted</option>
                <option value="Contacted">Contacted</option>
                <option value="Potential">Potential</option>
                <option value="Not Potential">Not Potential</option>
              </select>
              <button
                onClick={() => setHasPhoneFilter(!hasPhoneFilter)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                  hasPhoneFilter
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                Has Phone
              </button>
              <button
                onClick={() => setNewBusinessFilter(!newBusinessFilter)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                  newBusinessFilter
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                New Business
              </button>
            </div>
          </div>

          {/* Table */}
          <LeadTable leads={leads || []} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-slate-800/50">
        <p className="text-slate-600 text-xs">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
}
