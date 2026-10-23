// ============================================
// Entidad principal
// ============================================
export interface Grupo {
    id: number;
    nombre: string;
    precio: number;          // BigDecimal → number en TS
    capacidad: number;
    horaInicio: string;      // ISO time "HH:mm:ss"
    horaFin: string;         // ISO time "HH:mm:ss"
    activo: boolean;
    id_categoria: number;
    id_sucursal: number;
    // agrega aquí los demás campos reales (cupos, edadMin, edadMax, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface GrupoCreateDto {
    nombre: string;
    precio: number;
    capacidad: number;
    horaInicio: string;
    horaFin: string;
    activo?: boolean;
    id_categoria: number;
    id_sucursal: number;
}

export type GrupoUpdateDto = Partial<GrupoCreateDto>;

// ============================================
// Select option
// ============================================
export interface GrupoSelectOption {
    id: number;
    nombre: string;
}

// ============================================
// Filtros
// ============================================
export interface GrupoFiltrosPrecio {
    min: number;
    max: number;
}

export interface GrupoFiltrosCapacidad {
    min: number;
    max: number;
}

export interface GrupoFiltrosHorario {
    horaInicio: string;  // "HH:mm:ss"
    horaFin: string;     // "HH:mm:ss"
}

// ============================================
// Estadísticas
// ============================================
export interface GrupoEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasGrupoDTO {
    total: number;
    activos: number;
    inactivos: number;
    gruposPorCategoria: GrupoEstadisticaItem[];
    gruposPorSucursal: GrupoEstadisticaItem[];
    gruposPorMes: GrupoEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasGrupoDTO del back
}