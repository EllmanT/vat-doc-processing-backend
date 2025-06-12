import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  docs:defineTable({
    userId:v.string(),
    fileName:v.string(),
    fileDisplayName:v.optional(v.string()),
    fileId:v.id("_storage"),
    uploadedAt:v.number(),
    size:v.number(),
    mimeType:v.string(),
    status:v.string(),

    // Fields for the extracted data
    tradeName:v.optional(v.string()),
    taxPayerName:v.optional(v.string()),
    tinNumber:v.optional(v.string()),
    vatNumber:v.optional(v.string()),


  })
});