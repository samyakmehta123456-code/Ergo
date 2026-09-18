import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().optional().nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  category: z.string().min(1, "Category is required").default("General"),
  dueDate: z.string().optional().nullable(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type TaskInput = z.infer<typeof TaskSchema>;
