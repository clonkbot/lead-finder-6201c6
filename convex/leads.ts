import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {
    statusFilter: v.optional(v.string()),
    demandFilter: v.optional(v.string()),
    hasPhoneFilter: v.optional(v.boolean()),
    newBusinessFilter: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let leads = await ctx.db
      .query("leads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (args.statusFilter && args.statusFilter !== "all") {
      leads = leads.filter((l) => l.status === args.statusFilter);
    }

    if (args.demandFilter && args.demandFilter !== "all") {
      leads = leads.filter((l) => l.demandLevel === args.demandFilter);
    }

    if (args.hasPhoneFilter) {
      leads = leads.filter((l) => l.phone && l.phone.length > 0);
    }

    if (args.newBusinessFilter) {
      leads = leads.filter((l) => (l.reviewCount ?? 0) < 20);
    }

    return leads;
  },
});

export const saveLead = mutation({
  args: {
    placeId: v.string(),
    name: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    businessTypes: v.array(v.string()),
    googleMapsLink: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    score: v.number(),
    demandLevel: v.string(),
    serviceType: v.string(),
    city: v.string(),
    area: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check for duplicate
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_user_and_placeId", (q) =>
        q.eq("userId", userId).eq("placeId", args.placeId)
      )
      .first();

    if (existing) {
      return { success: false, message: "Lead already exists" };
    }

    await ctx.db.insert("leads", {
      ...args,
      userId,
      status: "Not Contacted",
      createdAt: Date.now(),
    });

    return { success: true, message: "Lead saved" };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const lead = await ctx.db.get(args.id);
    if (!lead || lead.userId !== userId) {
      throw new Error("Lead not found");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteLead = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const lead = await ctx.db.get(args.id);
    if (!lead || lead.userId !== userId) {
      throw new Error("Lead not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const saveMultipleLeads = mutation({
  args: {
    leads: v.array(
      v.object({
        placeId: v.string(),
        name: v.string(),
        address: v.string(),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        rating: v.optional(v.number()),
        reviewCount: v.optional(v.number()),
        businessTypes: v.array(v.string()),
        googleMapsLink: v.string(),
        latitude: v.number(),
        longitude: v.number(),
        score: v.number(),
        demandLevel: v.string(),
        serviceType: v.string(),
        city: v.string(),
        area: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let savedCount = 0;
    let duplicateCount = 0;

    for (const lead of args.leads) {
      const existing = await ctx.db
        .query("leads")
        .withIndex("by_user_and_placeId", (q) =>
          q.eq("userId", userId).eq("placeId", lead.placeId)
        )
        .first();

      if (!existing) {
        await ctx.db.insert("leads", {
          ...lead,
          userId,
          status: "Not Contacted",
          createdAt: Date.now(),
        });
        savedCount++;
      } else {
        duplicateCount++;
      }
    }

    return { savedCount, duplicateCount };
  },
});

export const searchPlaces = action({
  args: {
    serviceType: v.string(),
    city: v.string(),
    area: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("Google Places API key not configured");
    }

    const location = args.area ? `${args.area}, ${args.city}` : args.city;

    const queries = [
      `restaurants in ${location}`,
      `cafes in ${location}`,
      `salons in ${location}`,
      `offices in ${location}`,
      `retail stores in ${location}`,
      `real estate in ${location}`,
      `apartments in ${location}`,
      `builders in ${location}`,
    ];

    const matchCategories = [
      "restaurant",
      "cafe",
      "salon",
      "beauty_salon",
      "hair_care",
      "office",
      "retail",
      "real_estate",
      "real_estate_agency",
      "apartment",
      "general_contractor",
      "store",
      "shopping_mall",
      "clothing_store",
      "furniture_store",
    ];

    const allResults: any[] = [];
    const seenPlaceIds = new Set<string>();

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results) {
          for (const place of data.results) {
            if (seenPlaceIds.has(place.place_id)) continue;
            seenPlaceIds.add(place.place_id);

            // Get details for phone and website
            const detailsResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website&key=${apiKey}`
            );
            const detailsData = await detailsResponse.json();
            const details = detailsData.result || {};

            const reviewCount = place.user_ratings_total || 0;
            const types = place.types || [];

            const categoryMatch = types.some((t: string) =>
              matchCategories.some(
                (mc) => t.includes(mc) || mc.includes(t)
              )
            );

            // Filter: include if review count < 50 OR category matches
            if (reviewCount >= 50 && !categoryMatch) continue;

            // Calculate score
            let score = 0;
            if (reviewCount < 20) score += 30;
            else if (reviewCount < 50) score += 20;
            if (categoryMatch) score += 20;
            if (details.formatted_phone_number) score += 15;
            if (details.website) score += 15;

            // Determine demand level
            let demandLevel = "Low Demand";
            if (score >= 70) demandLevel = "High Demand";
            else if (score >= 40) demandLevel = "Medium Demand";

            allResults.push({
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address || "",
              phone: details.formatted_phone_number || undefined,
              website: details.website || undefined,
              rating: place.rating || undefined,
              reviewCount: reviewCount,
              businessTypes: types,
              googleMapsLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
              latitude: place.geometry?.location?.lat || 0,
              longitude: place.geometry?.location?.lng || 0,
              score,
              demandLevel,
              serviceType: args.serviceType,
              city: args.city,
              area: args.area,
            });
          }
        }
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }

    // Sort by score descending
    allResults.sort((a, b) => b.score - a.score);

    return allResults.slice(0, 50); // Return top 50
  },
});
