import api from "../api";

import {
    Pago,
    PagoCreateDto,
    PagoUpdateDto,
    PagoEstado,
    PagoFiltrosFecha,
    PagoFiltrosMonto,
    PagoFiltrosEstadoFecha,
    PagoResumenDiarioItem,
    PagoEstadisticaItem,
    EstadisticasPagoDTO,
} from "../../schemas/dtos/pago/PagoDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class PagoService {
        private readonly BASE_URL = '/pagos';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa de pagos */
    async getAll(): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Pago por ID */
    async getById(id: number): Promise<Pago> {
        const { data } = await api.get<Pago>(`${this.BASE_URL}/list-pago/${id}`);
        return data;
    }

    /** Pagos por estado */
    async getByEstado(estado: PagoEstado): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/estado/${estado}`);
        return data;
    }

    /** Pagos por método de pago */
    async getByMetodoPago(metodoPago: string): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(
            `${this.BASE_URL}/metodo-pago/${metodoPago}`
        );
        return data;
    }

    /** Pagos por fecha puntual */
    async getByFecha(fecha: string): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/fecha`, {
            params: { fecha },
        });
        return data;
    }

    /** Pagos por rango de fechas */
    async getByFechas({ inicio, fin }: PagoFiltrosFecha): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /** Pagos por rango de monto */
    async getByMonto({ min, max }: PagoFiltrosMonto): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/monto`, {
            params: { min, max },
        });
        return data;
    }

    /** Pagos por estado + método de pago */
    async getByEstadoAndMetodoPago(
        estado: PagoEstado,
        metodoPago: string
    ): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(
            `${this.BASE_URL}/estado/${estado}/metodo-pago/${metodoPago}`
        );
        return data;
    }

    /** Pagos del día (hoy) */
    async getDelDia(): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/del-dia`);
        return data;
    }

    /** Pagos de la semana actual */
    async getDeLaSemana(): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/de-la-semana`);
        return data;
    }

    /** Pagos del mes actual */
    async getDelMes(): Promise<Pago[]> {
        const { data } = await api.get<Pago[]>(`${this.BASE_URL}/del-mes`);
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
     */

    /** Crear pago */
    async create(pago: PagoCreateDto): Promise<Pago> {
        const { data } = await api.post<Pago>(
            `${this.BASE_URL}/create-pago`,
            pago
        );
        return data;
    }

    /** Actualizar pago */
    async update(id: number, pago: PagoUpdateDto): Promise<Pago> {
        const { data } = await api.put<Pago>(
            `${this.BASE_URL}/update-pago/${id}`,
            pago
        );
        return data;
    }

    /** Cambiar estado arbitrario */
    async cambiarEstado(id: number, estado: PagoEstado): Promise<Pago> {
        const { data } = await api.patch<Pago>(
            `${this.BASE_URL}/cambiar/${id}/estado`,
            null,
            { params: { estado } }
        );
        return data;
    }

    /** Marcar como PAGADO */
    async marcarComoPagado(id: number): Promise<Pago> {
        const { data } = await api.patch<Pago>(`${this.BASE_URL}/pagado/${id}`);
        return data;
    }

    /** Marcar como CANCELADO */
    async marcarComoCancelado(id: number): Promise<Pago> {
        const { data } = await api.patch<Pago>(`${this.BASE_URL}/cancelado/${id}`);
        return data;
    }

    /** Marcar como REEMBOLSADO */
    async marcarComoReembolsado(id: number): Promise<Pago> {
        const { data } = await api.patch<Pago>(`${this.BASE_URL}/reembolsado/${id}`);
        return data;
    }

    /** Eliminar pago */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-pago/${id}`);
    }

    /**
     * ====================================================
     * Estadísticas y reportes
     * ====================================================
     */

    async getEstadisticas(): Promise<EstadisticasPagoDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): PagoEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            pagados: Number(data.pagados ?? 0),
            pendientes: Number(data.pendientes ?? 0),
            cancelados: Number(data.cancelados ?? 0),
            reembolsados: Number(data.reembolsados ?? 0),
            montoTotal: Number(data.montoTotal ?? 0),
            montoPagado: Number(data.montoPagado ?? 0),
            montoPendiente: Number(data.montoPendiente ?? 0),
            pagosPorEstado: mapItems(data.pagosPorEstado),
            pagosPorMetodoPago: mapItems(data.pagosPorMetodoPago),
            pagosPorMes: mapItems(data.pagosPorMes),
            pagosPorDiaSemana: mapItems(data.pagosPorDiaSemana),
        };
    }

    /**
     * Resumen diario entre fechas.
     * El back devuelve List<Object[]> → [{ fecha, total }].
     */
    async getResumenDiario({
        inicio,
        fin,
    }: PagoFiltrosFecha): Promise<PagoResumenDiarioItem[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/resumen-diario`, {
            params: { inicio, fin },
        });

        return data.map((item) =>
            Array.isArray(item)
                ? { fecha: String(item[0]), total: Number(item[1]) }
                : { fecha: String(item.fecha ?? item[0]), total: Number(item.total ?? item[1]) }
        );
    }

    /** Total de pagos entre fechas */
    async getTotalByFechas({ inicio, fin }: PagoFiltrosFecha): Promise<number> {
        const { data } = await api.get<number>(`${this.BASE_URL}/total-fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /** Total de pagos por estado entre fechas */
    async getTotalByEstadoAndFechas({
        estado,
        inicio,
        fin,
    }: PagoFiltrosEstadoFecha): Promise<number> {
        const { data } = await api.get<number>(
            `${this.BASE_URL}/total-estado-fechas`,
            { params: { estado, inicio, fin } }
        );
        return data;
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿El pago está en estado PAGADO? */
    async isPagado(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/pagado/${id}`
        );
        return data;
    }

    /** ¿El pago está en estado PENDIENTE? */
    async isPendiente(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/pendiente/${id}`
        );
        return data;
    }

    /** ¿Existe el pago por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe/${id}`
        );
        return data;
    }
}

export const pagoService = new PagoService();
export default pagoService;