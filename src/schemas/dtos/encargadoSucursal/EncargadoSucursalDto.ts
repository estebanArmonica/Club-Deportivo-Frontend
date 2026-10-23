// ============================================
// Tipos base
// ============================================
export type TurnoEncargado = 'MAÑANA' | 'TARDE' | 'NOCHE' | string;

// ============================================
// Entidad principal (tabla de asociación)
// ============================================
export interface EncargadoSucursal {
    id: number;
    turno: TurnoEncargado;
    activo: boolean;
    id_usuario: number;      // encargado
    id_sucursal: number;
    // agrega aquí los demás campos reales (fechaAsignacion, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface EncargadoSucursalCreateDto {
    turno: TurnoEncargado;
    activo?: boolean;
    id_usuario: number;
    id_sucursal: number;
}

export type EncargadoSucursalUpdateDto = Partial<EncargadoSucursalCreateDto>;

// ============================================
// Validación de asignación duplicada
// ============================================
export interface EncargadoSucursalAsignacionParams {
    usuarioId: number;
    sucursalId: number;
    turno: TurnoEncargado;
}

// ============================================
// Estadísticas
// ============================================
export interface EncargadoSucursalEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasEncargadoSucursalDTO {
    total: number;
    activos: number;
    inactivos: number;
    asignacionesPorSucursal: EncargadoSucursalEstadisticaItem[];
    asignacionesPorUsuario: EncargadoSucursalEstadisticaItem[];
    asignacionesPorTurno: EncargadoSucursalEstadisticaItem[];
    asignacionesPorClub: EncargadoSucursalEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasEncargadoSucursalDTO del back
}