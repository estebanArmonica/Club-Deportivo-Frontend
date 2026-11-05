import { z } from 'zod';

export const profileInfoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().optional(),
  email: z.string().email('Debe ser un correo válido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  pais: z.string().optional(),
});

export const profilePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Debes ingresar tu contraseña actual'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas nuevas no coinciden',
  path: ['confirmPassword'],
});

export type ProfileInfoFormData = z.infer<typeof profileInfoSchema>;
export type ProfilePasswordFormData = z.infer<typeof profilePasswordSchema>;