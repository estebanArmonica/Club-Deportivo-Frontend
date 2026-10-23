// ============================================
// Entidad principal
// ============================================
export interface Asistencia {
    id: number;
    asistio: boolean;
    fecha: string;          // ISO date "YYYY-MM-DD"
    activo?: boolean;
    id_clase: number;
    id_pago: number;
    id_alumno?: number;     // según cómo lo derive el back de pago
    // agrega aquí los demás campos reales (observaciones, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface AsistenciaCreateDto {
    asistio: boolean;
    fecha: string;
    id_clase: number;
    id_pago: number;
}

export type AsistenciaUpdateDto = Partial<AsistenciaCreateDto>;

/** Parámetros del POST /registrar (3 @RequestParam) */
export interface AsistenciaRegistrarParams {
    claseId: number;
    pagoId: number;
    asistio: boolean;
}

/** Validación de unicidad clase + pago */
export interface AsistenciaClasePagoParams {
    claseId: number;
    pagoId: number;
}

// ============================================
// Filtros
// ============================================
export interface AsistenciaFiltrosFecha {
    inicio: string;
    fin: string;
}

// ============================================
// Estadísticas
// ============================================
export interface AsistenciaEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasAsistenciaDTO {
    total: number;
    presentes: number;
    ausentes: number;
    asistenciasPorClase: AsistenciaEstadisticaItem[];
    asistenciasPorGrupo: AsistenciaEstadisticaItem[];
    asistenciasPorAlumno: AsistenciaEstadisticaItem[];
    asistenciasPorMes: AsistenciaEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasAsistenciaDTO del back
}