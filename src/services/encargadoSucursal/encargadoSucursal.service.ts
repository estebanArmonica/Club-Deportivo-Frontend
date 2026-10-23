import api from "../api";
import {
    EncargadoSucursal,
    EncargadoSucursalCreateDto,
    EncargadoSucursalUpdateDto,
    TurnoEncargado,
    EncargadoSucursalAsignacionParams,
    EncargadoSucursalEstadisticaItem,
    EstadisticasEncargadoSucursalDTO,
} from "../../schemas/dtos/encargadoSucursal/EncargadoSucursalDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class EncargadoSucursalService {
    private readonly BASE_URL = '/encargado-sucursal';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa (con usuario y sucursal) */
    async getAll(): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/list-all`
        );
        return data;
    }

    /** Asignación por ID (con todas las relaciones) */
    async getById(id: number): Promise<EncargadoSucursal> {
        const { data } = await api.get<EncargadoSucursal>(
            `${this.BASE_URL}/list-encargado/${id}`
        );
        return data;
    }

    /** Solo asignaciones activas */
    async getActivos(): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/activos`
        );
        return data;
    }

    /** Asignaciones activas por sucursal */
    async getBySucursal(sucursalId: number): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Asignaciones activas por usuario (encargado) */
    async getByUsuario(usuarioId: number): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/usuario/${usuarioId}`
        );
        return data;
    }

    /** Asignaciones por turno (todas, activas e inactivas) */
    async getByTurno(turno: TurnoEncargado): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/turno/${turno}`
        );
        return data;
    }

    /** Asignaciones activas por sucursal + turno */
    async getBySucursalAndTurno(
        sucursalId: number,
        turno: TurnoEncargado
    ): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}/turno/${turno}`
        );
        return data;
    }

    /** Asignaciones activas por club (vía sucursal) */
    async getByClub(clubId: number): Promise<EncargadoSucursal[]> {
        const { data } = await api.get<EncargadoSucursal[]>(
            `${this.BASE_URL}/club/${clubId}`
        );
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
     */

    /** Crear asignación encargado ↔ sucursal */
    async create(
        asignacion: EncargadoSucursalCreateDto
    ): Promise<EncargadoSucursal> {
        const { data } = await api.post<EncargadoSucursal>(
            `${this.BASE_URL}/create-encargado`,
            asignacion
        );
        return data;
    }

    /** Actualizar asignación */
    async update(
        id: number,
        asignacion: EncargadoSucursalUpdateDto
    ): Promise<EncargadoSucursal> {
        const { data } = await api.put<EncargadoSucursal>(
            `${this.BASE_URL}/update-encargado/${id}`,
            asignacion
        );
        return data;
    }

    /** Desactivar asignación (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-encargado/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿Existe la asignación por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}`);
        return data;
    }

    /** ¿La asignación está activa? */
    async isActivo(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activo`
        );
        return data;
    }

    /**
     * ¿El usuario ya está asignado a esa sucursal con ese turno?
     * ⚠️ 3 @RequestParam: usuarioId, sucursalId, turno.
     */
    async existsUsuarioAsignadoSucursalTurno({
        usuarioId,
        sucursalId,
        turno,
    }: EncargadoSucursalAsignacionParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/asignacion`,
            { params: { usuarioId, sucursalId, turno } }
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
     */

    async getEstadisticas(): Promise<EstadisticasEncargadoSucursalDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (
            arr: any[] | undefined
        ): EncargadoSucursalEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            activos: Number(data.activos ?? 0),
            inactivos: Number(data.inactivos ?? 0),
            asignacionesPorSucursal: mapItems(data.asignacionesPorSucursal),
            asignacionesPorUsuario: mapItems(data.asignacionesPorUsuario),
            asignacionesPorTurno: mapItems(data.asignacionesPorTurno),
            asignacionesPorClub: mapItems(data.asignacionesPorClub),
        };
    }
}

// Exportación de instancia única (singleton)
export const encargadoSucursalService = new EncargadoSucursalService();
export default encargadoSucursalService;