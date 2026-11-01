import { z } from 'zod';
export const reservaSchema = z.object({
  id_equipo: z.number().min(1, 'Selecciona un equipo'),
  id_cancha: z.number().min(1, 'Selecciona una cancha'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  horaInicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  horaFin: z.string().min(1, 'La hora de fin es obligatoria'),
  estado: z.string().default('PENDIENTE'),
});
export type ReservaFormData = z.infer<typeof reservaSchema>;