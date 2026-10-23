import api from "../api";

import {
    ProfesorGrupo,
    ProfesorGrupoCreateDto,
    ProfesorGrupoUpdateDto,
    ProfesorGrupoAsignacionParams,
    ProfesorGrupoEstadisticaItem,
    EstadisticasProfesorGrupoDTO,
} from "../../schemas/dtos/profesorGrupo/ProfesorGrupoDto";

class ProfesorGrupoService {
    private readonly BASE_URL = '/profesor-grupos';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con usuario y grupo) */
    async getAll(): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Asignación por ID (con todas las relaciones) */
    async getById(id: number): Promise<ProfesorGrupo> {
        const { data } = await api.get<ProfesorGrupo>(
            `${this.BASE_URL}/list-asignaciones/${id}`
        );
        return data;
    }

    /** Solo asignaciones activas */
    async getActivos(): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(`${this.BASE_URL}/activos`);
        return data;
    }

    /** Asignaciones activas por grupo */
    async getByGrupo(grupoId: number): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(
            `${this.BASE_URL}/grupo/${grupoId}`
        );
        return data;
    }

    /** Asignaciones activas por usuario (profesor) */
    async getByUsuario(usuarioId: number): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(
            `${this.BASE_URL}/usuario/${usuarioId}`
        );
        return data;
    }

    /** Asignaciones activas por categoría (vía grupo) */
    async getByCategoria(categoriaId: number): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(
            `${this.BASE_URL}/categoria/${categoriaId}`
        );
        return data;
    }

    /** Asignaciones activas por sucursal (vía grupo) */
    async getBySucursal(sucursalId: number): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Asignaciones activas por club (vía grupo → sucursal) */
    async getByClub(clubId: number): Promise<ProfesorGrupo[]> {
        const { data } = await api.get<ProfesorGrupo[]>(
            `${this.BASE_URL}/club/${clubId}`
        );
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
    */

    /** Crear asignación profesor ↔ grupo */
    async create(asignacion: ProfesorGrupoCreateDto): Promise<ProfesorGrupo> {
        const { data } = await api.post<ProfesorGrupo>(
            `${this.BASE_URL}/create-asignacion`,
            asignacion
        );
        return data;
    }

    /** Actualizar asignación */
    async update(
        id: number,
        asignacion: ProfesorGrupoUpdateDto
    ): Promise<ProfesorGrupo> {
        const { data } = await api.put<ProfesorGrupo>(
            `${this.BASE_URL}/update-asignacion/${id}`,
            asignacion
        );
        return data;
    }

    /** Desactivar asignación (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-asignacion/${id}`);
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

    /** ¿El usuario ya está asignado a ese grupo? */
    async isUsuarioAsignadoGrupo({
        usuarioId,
        grupoId,
    }: ProfesorGrupoAsignacionParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/asignacion`,
            { params: { usuarioId, grupoId } }
        );
        return data;
    }

    /** ¿El grupo tiene profesores activos? */
    async hasProfesoresActivos(grupoId: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/grupo/${grupoId}/profesores`
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
    */

    async getEstadisticas(): Promise<EstadisticasProfesorGrupoDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        // Mapeo defensivo: List<Object[]> → { label, total }
        const mapItems = (arr: any[] | undefined): ProfesorGrupoEstadisticaItem[] =>
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
            activos: Number(data.activos ?? 0),
            inactivos: Number(data.inactivos ?? 0),
            asignacionesPorGrupo: mapItems(data.asignacionesPorGrupo),
            asignacionesPorProfesor: mapItems(data.asignacionesPorProfesor),
            asignacionesPorCategoria: mapItems(data.asignacionesPorCategoria),
            asignacionesPorSucursal: mapItems(data.asignacionesPorSucursal),
            asignacionesPorClub: mapItems(data.asignacionesPorClub),
        };
    }
}

export const profesorGrupoService = new ProfesorGrupoService();
export default profesorGrupoService;