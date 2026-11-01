import { z } from 'zod';
export const clubSchema = z.object({
  nombre: z.string().min(1, 'Obligatorio'),
  cuit: z.string().min(1, 'Obligatorio'),
  email: z.string().email('Email inválido'),
  direccion: z.string().optional(),
  fechCreacion: z.string().min(1, 'Obligatorio'),
  activo: z.boolean().default(true),
});
export type ClubFormData = z.infer<typeof clubSchema>;