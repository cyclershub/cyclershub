import { z } from "zod"

export const UserTypeValidator = z.object({
	id: z.number(),
	uid: z.string().length(36),
	email: z.string().max(255),
	password: z.string().min(6),
	username: z.string().min(4).max(60)
})

export const UserRegisterValidator = z.object({
	username: z.string().min(4).max(60),
	email: z.string().max(255),
	password: z.string().min(6),
})

export type UserType = z.infer<typeof UserTypeValidator>