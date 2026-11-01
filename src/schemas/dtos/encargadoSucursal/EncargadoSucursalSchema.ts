import { z } from 'zod';
export const encargadoSchema = z.object({
  id_usuario: z.number().min(1, 'Selecciona un usuario'),
  id_sucursal: z.number().min(1, 'Selecciona una sucursal'),
  turno: z.string().min(1, 'Selecciona un turno'),
});
export type EncargadoFormData = z.infer<typeof encargadoSchema>;