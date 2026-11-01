import { z } from 'zod';

export const alumnoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .trim(),
  rut: z
    .string()
    .min(1, 'El RUT es obligatorio')
    .max(12, 'El RUT no puede exceder 12 caracteres')
    .trim(),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria'),
  fechInscripcion: z
    .string()
    .min(1, 'La fecha de inscripción es obligatoria'),
  activo: z.boolean().default(true),
});

export type AlumnoFormData = z.infer<typeof alumnoSchema>;