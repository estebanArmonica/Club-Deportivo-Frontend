import { z } from 'zod';
export const asistenciaSchema = z.object({
  id_clase: z.number().min(1, 'Selecciona una clase'),
  id_pago: z.number().min(1, 'Selecciona un pago'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  asistio: z.boolean().default(true),
});
export type AsistenciaFormData = z.infer<typeof asistenciaSchema>;