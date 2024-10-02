import * as z from "zod";

export const addFriendValidate = z.object({
    email: z.string().email(),
    message: z.string().max(100)
})
