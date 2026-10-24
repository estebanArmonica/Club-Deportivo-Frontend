import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  descripcion: z
    .string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .optional()
    .or(z.literal('')),
  edadMin: z
    .number({ error: 'La edad mínima debe ser un número' })
    .min(0, 'La edad no puede ser negativa')
    .max(100, 'Edad inválida'),
  edadMax: z
    .number({ error: 'La edad máxima debe ser un número' })
    .min(0, 'La edad no puede ser negativa')
    .max(100, 'Edad inválida'),
  id_deporte: z
    .number({ error: 'Debes seleccionar un deporte' })
    .min(1, 'Debes seleccionar un deporte'),
  activo: z.boolean().default(true),
}).refine((data) => data.edadMax >= data.edadMin, {
  message: 'La edad máxima debe ser mayor o igual a la mínima',
  path: ['edadMax'],
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;