// ============================================
// Tipos base
// ============================================
export type ClaseEstado = 'PROGRAMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA' | string;

// ============================================
// Entidad principal
// ============================================
export interface Clase {
    id: number;
    fechClase: string;      // ISO date "YYYY-MM-DD"
    horaInicio: string;     // ISO time "HH:mm:ss"
    horaFin: string;        // ISO time "HH:mm:ss"
    estado: ClaseEstado;
    activo: boolean;
    id_grupo: number | { id: number; nombre?: string }; // según cómo lo serialice el back
}

// ============================================
// DTOs de escritura (Create / Update)
// ============================================
export interface ClaseCreateDto {
    fechClase: string;
    horaInicio: string;
    horaFin: string;
    estado: ClaseEstado;
    activo?: boolean;
    id_grupo: number;
}

export type ClaseUpdateDto = Partial<ClaseCreateDto>;

// ============================================
// Filtros opcionales
// ============================================
export interface ClaseFiltrosFecha {
    inicio: string; // "YYYY-MM-DD"
    fin: string;    // "YYYY-MM-DD"
}

export interface ClaseFiltrosHorario {
    grupoId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}

// ============================================
// Estadísticas (espejo del EstadisticasClaseDTO)
// ============================================
export interface ClaseEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasClaseDTO {
    total: number;
    activas: number;
    inactivas: number;
    clasesPorEstado: ClaseEstadisticaItem[];
    clasesPorGrupo: ClaseEstadisticaItem[];
    clasesActivasPorGrupo: ClaseEstadisticaItem[];
    clasesPorCategoria: ClaseEstadisticaItem[];
    clasesPorSucursal: ClaseEstadisticaItem[];
    clasesPorMes: ClaseEstadisticaItem[];
    clasesPorDiaSemana: ClaseEstadisticaItem[];
}