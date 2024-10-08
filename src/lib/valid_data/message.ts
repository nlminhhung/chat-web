import * as z from "zod";

export const messageValidate = z.object({
    message: z.string().max(150).min(1)
})
