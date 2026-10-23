/**
 * DTO de deporte 
 * integracion para APIs 
*/
// entidad padre
export interface Deporte {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

// creacion de un objeto deporte
export interface DeporteCreateDto {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
}

// actualizacion de un objeto existente
export type DeporteUpdateDto = Partial<DeporteCreateDto>;

// para busquedas
export interface DeporteSelectOption {
    id: number;
    nombre: string;
}

// conteo y estadisticas de ayuda
export interface EstadisticasDeporteDTO {
    total: number;
    activos: number;
    inactivos: number;
}