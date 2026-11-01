import { z } from 'zod';

export const grupoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  precio: z
    .number({ error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
  capacidad: z
    .number({ error: 'La capacidad debe ser un número' })
    .min(1, 'La capacidad mínima es 1'),
  horaInicio: z
    .string()
    .min(1, 'La hora de inicio es obligatoria'),
  horaFin: z
    .string()
    .min(1, 'La hora de fin es obligatoria'),
  id_categoria: z
    .number({ error: 'Debes seleccionar una categoría' })
    .min(1, 'Debes seleccionar una categoría'),
  id_sucursal: z
    .number({ error: 'Debes seleccionar una sucursal' })
    .min(1, 'Debes seleccionar una sucursal'),
  activo: z.boolean().default(true),
});

export type GrupoFormData = z.infer<typeof grupoSchema>;