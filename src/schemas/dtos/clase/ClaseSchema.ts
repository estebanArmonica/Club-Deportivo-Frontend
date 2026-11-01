import { z } from 'zod';
export const claseSchema = z.object({
  id_grupo: z.number().min(1, 'Selecciona un grupo'),
  fechClase: z.string().min(1, 'La fecha es obligatoria'),
  horaInicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  horaFin: z.string().min(1, 'La hora de fin es obligatoria'),
  estado: z.string().default('PROGRAMADA'),
  activo: z.boolean().default(true),
});
export type ClaseFormData = z.infer<typeof claseSchema>;