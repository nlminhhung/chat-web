import * as z from "zod";

export const messageValidate = z.object({
  message: z
    .string()
    .max(500)
    .min(1)
});

