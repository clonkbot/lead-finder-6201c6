import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Lead {
  _id: Id<"leads">;
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
  status: string;
}

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const updateStatus = useMutation(api.leads.updateStatus);
  const deleteLead = useMutation(api.leads.deleteLead);
  const [expandedId, setExpandedId] = useState<Id<"leads"> | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Potential":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Not Potential":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
  };

  const handleStatusChange = async (id: Id<"leads">, status: string) => {
    await updateStatus({ id, status });
  };

  const handleDelete = async (id: Id<"leads">) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead({ id });
    }
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-slate-800/50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm md:text-base mb-2">No leads yet</p>
        <p className="text-slate-500 text-xs md:text-sm">Use the search form above to find potential clients</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reviews</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Demand</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="py-3 px-4">
                  <span className="font-medium text-white text-sm">{lead.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-400 text-sm capitalize">
                    {lead.businessTypes[0]?.replace(/_/g, " ") || "—"}
                  </span>
                </td>
                <td className="py-3 px-4 max-w-[200px]">
                  <span className="text-slate-400 text-sm truncate block">{lead.address}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {lead.phone ? (
                      <button
                        onClick={() => copyPhone(lead.phone!)}
                        className="text-slate-400 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {lead.phone}
                      </button>
                    ) : (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-slate-400 text-sm">{lead.reviewCount || 0}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30 text-amber-400 font-bold text-sm">
                    {lead.score}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getDemandColor(lead.demandLevel)}`}>
                    {lead.demandLevel}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-full border bg-transparent cursor-pointer focus:outline-none ${getStatusColor(lead.status)}`}
                  >
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Potential">Potential</option>
                    <option value="Not Potential">Not Potential</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={lead.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                      title="Open in Maps"
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
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                        title="Visit website"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete lead"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm truncate">{lead.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getDemandColor(lead.demandLevel)}`}>
                      {lead.demandLevel.split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">{lead.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30 text-amber-400 font-bold text-sm">
                    {lead.score}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === lead._id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {expandedId === lead._id && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-700/30 pt-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Type</p>
                    <p className="text-slate-300 capitalize">{lead.businessTypes[0]?.replace(/_/g, " ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Reviews</p>
                    <p className="text-slate-300">{lead.reviewCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Phone</p>
                    {lead.phone ? (
                      <button
                        onClick={() => copyPhone(lead.phone!)}
                        className="text-amber-400 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    ) : (
                      <p className="text-slate-600">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Status</p>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border bg-transparent cursor-pointer focus:outline-none ${getStatusColor(lead.status)}`}
                    >
                      <option value="Not Contacted">Not Contacted</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Potential">Potential</option>
                      <option value="Not Potential">Not Potential</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href={lead.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all"
                  >
                    Maps
                  </a>
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all"
                    >
                      Website
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
