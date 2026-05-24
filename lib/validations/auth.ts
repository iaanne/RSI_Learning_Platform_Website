// lib/validations/auth.ts
// =============================================================================
// Zod Schema — Validasi input login
// =============================================================================

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
