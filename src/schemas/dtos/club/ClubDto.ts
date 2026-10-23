// ============================================
// Entidad principal
// ============================================
export interface Club {
    id: number;
    nombre: string;
    direccion?: string;
    cuit: string;
    email: string;
    fechCreacion: string;    // ISO date "YYYY-MM-DD"
    activo: boolean;
    // agrega aquí los demás campos reales (telefono, logo, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface ClubCreateDto {
    nombre: string;
    direccion?: string;
    cuit: string;
    email: string;
    fechCreacion: string;
    activo?: boolean;
}

export type ClubUpdateDto = Partial<ClubCreateDto>;

// ============================================
// Select options
// ============================================
export interface ClubSelectOption {
    id: number;
    nombre: string;
}

/** Select que incluye el CUIT (para mostrar "Nombre (CUIT)") */
export interface ClubSelectOptionWithCuit {
    id: number;
    nombre: string;
    cuit: string;
}

// ============================================
// Filtros
// ============================================
export interface ClubFiltrosFecha {
    inicio: string;
    fin: string;
}

// ============================================
// Estadísticas
// ============================================
export interface ClubEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasClubDTO {
    total: number;
    activos: number;
    inactivos: number;
    clubesPorMes: ClubEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasClubDTO del back
}