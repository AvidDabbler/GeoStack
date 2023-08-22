import { z } from "zod";

// Only use on the server
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  // MAPBOX_API_KEY: z.string(),
});

export const {
  NODE_ENV,
} = envSchema.parse(process.env);
const MAPBOX_API_KEY = "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g"
export {MAPBOX_API_KEY}