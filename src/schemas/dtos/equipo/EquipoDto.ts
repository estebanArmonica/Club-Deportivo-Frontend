// ============================================
// Entidad principal
// ============================================
export interface Equipo {
    id: number;
    nombre: string;
    activo: boolean;
    id_grupo: number;
    id_usuario: number;      // profesor/entrenador
    id_capitan?: number;     // usuario capitán (nullable)
    // agrega aquí los demás campos reales de tu entidad Equipo
}

// ============================================
// DTOs de escritura
// ============================================
export interface EquipoCreateDto {
    nombre: string;
    activo?: boolean;
    id_grupo: number;
    id_usuario: number;
    id_capitan?: number;
}

export type EquipoUpdateDto = Partial<EquipoCreateDto>;

// ============================================
// Select option
// ============================================
export interface EquipoSelectOption {
    id: number;
    nombre: string;
}

// ============================================
// Validación capitán en grupo
// ============================================
export interface EquipoUsuarioGrupoParams {
    usuarioId: number;
    grupoId: number;
}

// ============================================
// Estadísticas
// ============================================
export interface EquipoEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasEquipoDTO {
    total: number;
    activos: number;
    inactivos: number;
    equiposPorGrupo: EquipoEstadisticaItem[];
    equiposPorCategoria: EquipoEstadisticaItem[];
    equiposPorSucursal: EquipoEstadisticaItem[];
    equiposPorMes: EquipoEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasEquipoDTO del back
}