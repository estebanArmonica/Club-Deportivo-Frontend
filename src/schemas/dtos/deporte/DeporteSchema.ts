import { z } from 'zod';

export const deporteSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre es obligatorio.')
        .max(100, 'E nombre no puede exceder 100 caracteres.')
    .trim(),
    descripcion: z
        .string()
        .max(255, 'La descripcion no puede exceder 255 caracteres.')
        .optional()
    .or(z.literal('')),
    activo: z.boolean().default(true),
});

export type DeporteFormData = z.infer<typeof deporteSchema>;