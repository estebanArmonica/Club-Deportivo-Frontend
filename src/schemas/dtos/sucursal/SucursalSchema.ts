import { z } from 'zod';

export const sucursalSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  direccion: z
    .string()
    .max(150, 'La dirección no puede exceder 150 caracteres')
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  id_club: z
    .number({ error: 'Debes seleccionar un club' })
    .min(1, 'Debes seleccionar un club'),
  activa: z.boolean().default(true),
});

export type SucursalFormData = z.infer<typeof sucursalSchema>;