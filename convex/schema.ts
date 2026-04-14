import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  leads: defineTable({
    userId: v.id("users"),
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
    status: v.string(),
    serviceType: v.string(),
    city: v.string(),
    area: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_placeId", ["userId", "placeId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_user_and_demandLevel", ["userId", "demandLevel"]),
});
