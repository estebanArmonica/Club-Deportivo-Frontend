import api from "../api";

import {
    Reserva,
    ReservaCreateDto,
    ReservaUpdateDto,
    ReservaEstado,
    ReservaFiltrosFecha,
    ReservaDisponibilidadParams,
    ReservaEstadisticaItem,
    EstadisticasReservaDTO,
} from "../../schemas/dtos/reserva/ReservaDto";

class ReservaService {
    private readonly BASE_URL = '/reservas';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con equipo y cancha) */
    async getAll(): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Reserva por ID (con todas las relaciones) */
    async getById(id: number): Promise<Reserva> {
        const { data } = await api.get<Reserva>(`${this.BASE_URL}/list-reserva/${id}`);
        return data;
    }

    /** Reservas por estado */
    async getByEstado(estado: ReservaEstado): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/estado/${estado}`);
        return data;
    }

    /** Reservas por equipo (todas) */
    async getByEquipo(equipoId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/equipo/${equipoId}`);
        return data;
    }

    /** Reservas activas por equipo */
    async getActivasByEquipo(equipoId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(
            `${this.BASE_URL}/equipo/${equipoId}/activas`
        );
        return data;
    }

    /** Reservas por cancha (todas) */
    async getByCancha(canchaId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/cancha/${canchaId}`);
        return data;
    }

    /** Reservas activas por cancha */
    async getActivasByCancha(canchaId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(
            `${this.BASE_URL}/cancha/${canchaId}/activas`
        );
        return data;
    }

    /** Reservas por cancha y fecha puntual */
    async getByCanchaAndFecha(canchaId: number, fecha: string): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(
            `${this.BASE_URL}/cancha/${canchaId}/fecha`,
            { params: { fecha } }
        );
        return data;
    }

    /** Reservas por rango de fechas */
    async getByFechas({ inicio, fin }: ReservaFiltrosFecha): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /** Reservas por sucursal */
    async getBySucursal(sucursalId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Reservas por club */
    async getByClub(clubId: number): Promise<Reserva[]> {
        const { data } = await api.get<Reserva[]>(`${this.BASE_URL}/club/${clubId}`);
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
    */

    /** Crear reserva */
    async create(reserva: ReservaCreateDto): Promise<Reserva> {
        const { data } = await api.post<Reserva>(
            `${this.BASE_URL}/create-reserva`,
            reserva
        );
        return data;
    }

    /** Actualizar reserva */
    async update(id: number, reserva: ReservaUpdateDto): Promise<Reserva> {
        const { data } = await api.put<Reserva>(
            `${this.BASE_URL}/update-reserva/${id}`,
            reserva
        );
        return data;
    }

    /** Cambiar estado arbitrario */
    async cambiarEstado(id: number, estado: ReservaEstado): Promise<Reserva> {
        const { data } = await api.patch<Reserva>(
            `${this.BASE_URL}/${id}/estado`,
            null,
            { params: { estado } }
        );
        return data;
    }

    /** Cancelar reserva */
    async cancelar(id: number): Promise<Reserva> {
        const { data } = await api.patch<Reserva>(`${this.BASE_URL}/${id}/cancelar`);
        return data;
    }

    /** Completar reserva */
    async completar(id: number): Promise<Reserva> {
        const { data } = await api.patch<Reserva>(`${this.BASE_URL}/${id}/completar`);
        return data;
    }

    /** Eliminar reserva */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-reserva/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /**
     * ¿Está la cancha disponible en ese horario?
     * ⚠️ El back recibe 4 @RequestParam; van en `params`.
    */
    async isCanchaDisponible({
        canchaId,
        fecha,
        horaInicio,
        horaFin,
    }: ReservaDisponibilidadParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/disponibilidad`,
            { params: { canchaId, fecha, horaInicio, horaFin } }
        );
        return data;
    }

    /** ¿El equipo tiene reservas activas? */
    async hasReservasActivas(equipoId: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/equipo/${equipoId}/reservas-activas`
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
    */

    async getEstadisticas(): Promise<EstadisticasReservaDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        // Mapeo defensivo: List<Object[]> → { label, total }
        const mapItems = (arr: any[] | undefined): ReservaEstadisticaItem[] =>
            (arr ?? []).map((item) =>
                Array.isArray(item)
                    ? { label: String(item[0]), total: Number(item[1]) }
                    : {
                          label: String(item.label ?? item[0]),
                          total: Number(item.total ?? item[1]),
                      }
            );

        return {
            total: Number(data.total ?? 0),
            activas: Number(data.activas ?? 0),
            inactivas: Number(data.inactivas ?? 0),
            reservasPorEstado: mapItems(data.reservasPorEstado),
            reservasPorCancha: mapItems(data.reservasPorCancha),
            reservasPorEquipo: mapItems(data.reservasPorEquipo),
            reservasPorSucursal: mapItems(data.reservasPorSucursal),
            reservasPorMes: mapItems(data.reservasPorMes),
            reservasPorDiaSemana: mapItems(data.reservasPorDiaSemana),
        };
    }
}

export const reservaService = new ReservaService();
export default reservaService;