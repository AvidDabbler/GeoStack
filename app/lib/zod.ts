import { z } from "zod";

export const zJsonCheck = z.string().refine((data) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
});

export const zSelectJson = z.object({
  id: z.string(),
  name: z.string(),
});