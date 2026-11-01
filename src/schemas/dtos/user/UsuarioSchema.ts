import { z } from 'zod';

// Esquema base (sin contraseña)
const baseUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').trim(),
  email: z.string().email('Debe ser un correo válido').min(1, 'El email es obligatorio'),
  activo: z.boolean().default(true),
});

// Esquema para CREAR (contraseña obligatoria)
export const usuarioCreateSchema = baseUsuarioSchema.extend({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Esquema para EDITAR (contraseña opcional)
export const usuarioUpdateSchema = baseUsuarioSchema.extend({
  password: z.string().optional().or(z.literal('')),
});

export type UsuarioCreateFormData = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdateFormData = z.infer<typeof usuarioUpdateSchema>;