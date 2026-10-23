// ============================================
// Entidad principal
// ============================================
export interface Sucursal {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    activo: boolean;
    id_club?: number;      // según cómo serialice el back la relación Club
    // agrega aquí los demás campos reales de tu entidad Sucursal
}

// ============================================
// DTOs de escritura
// ============================================
export interface SucursalCreateDto {
    nombre: string;
    direccion?: string;
    telefono?: string;
    activo?: boolean;
    id_club: number;
}

export type SucursalUpdateDto = Partial<SucursalCreateDto>;

// ============================================
// Select option
// ============================================
export interface SucursalSelectOption {
    id: number;
    nombre: string;
}

// ============================================
// Estadísticas
// ============================================
export interface EstadisticasSucursalDTO {
    total: number;
    activas: number;
    inactivas: number;
    // agrega aquí las listas extra que tenga tu DTO del back
    // (ej: sucursalesPorClub: { label: string; total: number }[])
}