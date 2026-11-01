import { z } from 'zod';
export const inscripcionSchema = z.object({
  id_alumno: z.number().min(1, 'Selecciona un alumno'),
  id_grupo: z.number().min(1, 'Selecciona un grupo'),
  id_apoderado: z.number().min(1, 'Selecciona un apoderado'),
  fechaInscripcion: z.string().min(1, 'La fecha es obligatoria'),
  estado: z.string().default('ACTIVA'),
});
export type InscripcionFormData = z.infer<typeof inscripcionSchema>;