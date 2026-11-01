import { z } from 'zod';
export const profesorGrupoSchema = z.object({
  id_usuario: z.number().min(1, 'Selecciona un profesor'),
  id_grupo: z.number().min(1, 'Selecciona un grupo'),
  activo: z.boolean().default(true),
});
export type ProfesorGrupoFormData = z.infer<typeof profesorGrupoSchema>;