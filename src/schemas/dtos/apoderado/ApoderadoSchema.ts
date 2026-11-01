import { z } from 'zod';
export const apoderadoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  contacto: z.string().min(1, 'El contacto es obligatorio'),
  parentesco: z.string().min(1, 'El parentesco es obligatorio'),
  activo: z.boolean().default(true),
});
export type ApoderadoFormData = z.infer<typeof apoderadoSchema>;