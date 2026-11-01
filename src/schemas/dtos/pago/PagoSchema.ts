import { z } from 'zod';
export const pagoSchema = z.object({
  monto: z.number().min(1, 'El monto debe ser mayor a 0'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  metodoPago: z.string().min(1, 'El método es obligatorio'),
  estado: z.string().min(1, 'El estado es obligatorio'),
});
export type PagoFormData = z.infer<typeof pagoSchema>;