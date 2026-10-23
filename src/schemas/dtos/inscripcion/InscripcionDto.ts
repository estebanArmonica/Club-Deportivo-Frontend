// ============================================
// Tipos base
// ============================================
export type InscripcionEstado =
    | 'ACTIVA'
    | 'SUSPENDIDA'
    | 'FINALIZADA'
    | 'CANCELADA'
    | string;

// ============================================
// Entidad principal
// ============================================
export interface Inscripcion {
    id: number;
    fechaInscripcion: string;   // ISO date "YYYY-MM-DD"
    estado: InscripcionEstado;
    activo: boolean;
    id_alumno: number;
    id_grupo: number;
    id_apoderado?: number;
    // agrega aquí los demás campos reales (monto, observaciones, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface InscripcionCreateDto {
    fechaInscripcion: string;
    estado: InscripcionEstado;
    activo?: boolean;
    id_alumno: number;
    id_grupo: number;
    id_apoderado?: number;
}

export type InscripcionUpdateDto = Partial<InscripcionCreateDto>;

// ============================================
// Filtros
// ============================================
export interface InscripcionFiltrosFecha {
    inicio: string;
    fin: string;
}

export interface InscripcionAlumnoGrupoParams {
    alumnoId: number;
    grupoId: number;
}

// ============================================
// Estadísticas
// ============================================
export interface InscripcionEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasInscripcionDTO {
    total: number;
    activas: number;
    suspendidas: number;
    finalizadas: number;
    canceladas: number;
    inscripcionesPorEstado: InscripcionEstadisticaItem[];
    inscripcionesPorGrupo: InscripcionEstadisticaItem[];
    inscripcionesPorCategoria: InscripcionEstadisticaItem[];
    inscripcionesPorSucursal: InscripcionEstadisticaItem[];
    inscripcionesPorMes: InscripcionEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasInscripcionDTO del back
}