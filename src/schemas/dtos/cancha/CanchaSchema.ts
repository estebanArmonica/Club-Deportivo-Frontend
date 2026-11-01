import { z } from 'zod';

export const canchaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').trim(),
  tipo: z.string().min(1, 'El tipo es obligatorio'), // Fútbol, Básquet, etc.
  capacidad: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  id_sucursal: z.number().min(1, 'Debes seleccionar una sucursal'),
  disponible: z.boolean().default(true),
  activo: z.boolean().default(true),
});

export type CanchaFormData = z.infer<typeof canchaSchema>;