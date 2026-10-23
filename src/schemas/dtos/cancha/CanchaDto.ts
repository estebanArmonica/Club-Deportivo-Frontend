// ============================================
// Tipos base
// ============================================
export type CanchaTipo = 'FUTBOL' | 'BASKET' | 'TENIS' | 'PADEL' | string;

// ============================================
// Entidad principal
// ============================================
export interface Cancha {
    id: number;
    nombre: string;
    tipo: CanchaTipo;
    capacidad: number;
    disponible: boolean;
    activo?: boolean;
    id_sucursal: number;
    // agrega aquí los demás campos reales (precioHora, techada, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface CanchaCreateDto {
    nombre: string;
    tipo: CanchaTipo;
    capacidad: number;
    disponible?: boolean;
    activo?: boolean;
    id_sucursal: number;
}

export type CanchaUpdateDto = Partial<CanchaCreateDto>;

// ============================================
// Select options
// ============================================
export interface CanchaSelectOption {
    id: number;
    nombre: string;
}

/** Select que incluye el tipo (para mostrar "Nombre (Tipo)") */
export interface CanchaSelectOptionWithTipo {
    id: number;
    nombre: string;
    tipo: CanchaTipo;
}

// ============================================
// Filtros
// ============================================
export interface CanchaFiltrosCapacidad {
    min: number;
    max: number;
}

// ============================================
// Estadísticas
// ============================================
export interface CanchaEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasCanchaDTO {
    total: number;
    disponibles: number;
    noDisponibles: number;
    canchasPorTipo: CanchaEstadisticaItem[];
    canchasPorSucursal: CanchaEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasCanchaDTO del back
}