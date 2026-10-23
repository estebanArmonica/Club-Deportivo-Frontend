// ============================================
// Tipos base
// ============================================
export type PagoEstado = 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'REEMBOLSADO' | string;
export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | string;

// ============================================
// Entidad principal
// ============================================
export interface Pago {
    id: number;
    monto: number;
    fecha: string;          // ISO date "YYYY-MM-DD"
    estado: PagoEstado;
    metodoPago: MetodoPago;
    activo?: boolean;
    // agrega aquí los demás campos reales de tu entidad Pago
}

// ============================================
// DTOs de escritura
// ============================================
export interface PagoCreateDto {
    monto: number;
    fecha: string;
    estado: PagoEstado;
    metodoPago: MetodoPago;
    // + ids de relaciones (inscripcion, estudiante, etc.) según tu entidad
}

export type PagoUpdateDto = Partial<PagoCreateDto>;

// ============================================
// Filtros
// ============================================
export interface PagoFiltrosFecha {
    inicio: string;
    fin: string;
}

export interface PagoFiltrosMonto {
    min: number;
    max: number;
}

export interface PagoFiltrosEstadoFecha extends PagoFiltrosFecha {
    estado: PagoEstado;
}

// ============================================
// Reportes
// ============================================
export interface PagoResumenDiarioItem {
    fecha: string;   // "YYYY-MM-DD"
    total: number;   // monto total del día
}

// ============================================
// Estadísticas
// ============================================
export interface PagoEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasPagoDTO {
    total: number;
    pagados: number;
    pendientes: number;
    cancelados: number;
    reembolsados: number;
    montoTotal: number;
    montoPagado: number;
    montoPendiente: number;
    pagosPorEstado: PagoEstadisticaItem[];
    pagosPorMetodoPago: PagoEstadisticaItem[];
    pagosPorMes: PagoEstadisticaItem[];
    pagosPorDiaSemana: PagoEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasPagoDTO del back
}