import * as z from "zod";

export const messageValidate = z.object({
    // senderId: z.string(),
    // friendId: z.string(),
    message: z.string().max(150).min(1)
})
