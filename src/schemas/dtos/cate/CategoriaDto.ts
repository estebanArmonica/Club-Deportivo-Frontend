// Entidad principal (como viene del backend)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  edadMinima?: number;
  edadMaxima?: number;
  activa: boolean;
  deporte?: Deporte;      // Relación con deporte
  deporteId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// para usar select (más simple para busquedas)
export interface Deporte {
  id: number;
  nombre: string;
  activo?: boolean;
}

// DTO para crear/editar una categoría
export interface CategoriaCreateDto {
  nombre: string;
  descripcion?: string;
  edadMinima?: number;
  edadMaxima?: number;
  deporteId: number;
  activa?: boolean;
}

// DTO para actualizar
export interface CategoriaUpdateDto extends Partial<CategoriaCreateDto> {}

// DTO de estadísticas
export interface EstadisticasCategoriaDTO {
  total: number;
  activas: number;
  inactivas: number;
  porDeporte?: { deporteId: number; deporteNombre: string; cantidad: number }[];
  promedioEdadMinima?: number;
  promedioEdadMaxima?: number;
}

// Opción para selects (lo que devuelve /select)
export interface CategoriaSelectOption {
  id: number;
  nombre: string;
}