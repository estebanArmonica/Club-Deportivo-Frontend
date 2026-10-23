// ============================================
// Tipos base
// ============================================
export type ReservaEstado = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | string;

// ============================================
// Entidad principal
// ============================================
export interface Reserva {
    id: number;
    fecha: string;          // ISO date "YYYY-MM-DD"
    horaInicio: string;     // ISO time "HH:mm:ss"
    horaFin: string;        // ISO time "HH:mm:ss"
    estado: ReservaEstado;
    activo: boolean;
    id_equipo?: number;
    id_cancha?: number;
    // agrega aquí los demás campos reales de tu entidad Reserva
}

// ============================================
// DTOs de escritura
// ============================================
export interface ReservaCreateDto {
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: ReservaEstado;
    activo?: boolean;
    id_equipo: number;
    id_cancha: number;
}

export type ReservaUpdateDto = Partial<ReservaCreateDto>;

// ============================================
// Filtros
// ============================================
export interface ReservaFiltrosFecha {
    inicio: string;
    fin: string;
}

export interface ReservaDisponibilidadParams {
    canchaId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}

// ============================================
// Estadísticas
// ============================================
export interface ReservaEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasReservaDTO {
    total: number;
    activas: number;
    inactivas: number;
    reservasPorEstado: ReservaEstadisticaItem[];
    reservasPorCancha: ReservaEstadisticaItem[];
    reservasPorEquipo: ReservaEstadisticaItem[];
    reservasPorSucursal: ReservaEstadisticaItem[];
    reservasPorMes: ReservaEstadisticaItem[];
    reservasPorDiaSemana: ReservaEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasReservaDTO del back
}