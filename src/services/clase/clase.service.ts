import api from "../api";
import {
    Clase,
    ClaseCreateDto,
    ClaseUpdateDto,
    ClaseEstado,
    ClaseFiltrosFecha,
    ClaseFiltrosHorario,
    ClaseEstadisticaItem,
    EstadisticasClaseDTO,
} from "../../schemas/dtos/clase/ClaseDto";

class ClaseService {
    private readonly BASE_URL = '/clases';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con grupo) */
    async getAll(): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Solo clases activas */
    async getActivas(): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/activas`);
        return data;
    }

    /** Clase por ID (con todas las relaciones) */
    async getById(id: number): Promise<Clase> {
        const { data } = await api.get<Clase>(`${this.BASE_URL}/list-clase/${id}`);
        return data;
    }

    /** Clases por estado */
    async getByEstado(estado: ClaseEstado): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/estado/${estado}`);
        return data;
    }

    /** Clases activas por grupo */
    async getByGrupo(grupoId: number): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/grupo/${grupoId}`);
        return data;
    }

    /** Clases por grupo y fecha puntual */
    async getByGrupoAndFecha(grupoId: number, fecha: string): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(
            `${this.BASE_URL}/grupo/${grupoId}/fecha`,
            { params: { fecha } }
        );
        return data;
    }

    /** Clases por grupo y rango de fechas */
    async getByGrupoAndFechas(
        grupoId: number,
        { inicio, fin }: ClaseFiltrosFecha
    ): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(
            `${this.BASE_URL}/grupo/${grupoId}/fechas`,
            { params: { inicio, fin } }
        );
        return data;
    }

    /** Clases por fecha puntual (con grupo) */
    async getByFecha(fecha: string): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/fecha`, {
            params: { fecha },
        });
        return data;
    }

    /** Clases por rango de fechas */
    async getByFechas({ inicio, fin }: ClaseFiltrosFecha): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /** Clases activas por categoría */
    async getByCategoria(categoriaId: number): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/categoria/${categoriaId}`);
        return data;
    }

    /** Clases activas por sucursal */
    async getBySucursal(sucursalId: number): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/sucursal/${sucursalId}`);
        return data;
    }

    /** Clases activas por club */
    async getByClub(clubId: number): Promise<Clase[]> {
        const { data } = await api.get<Clase[]>(`${this.BASE_URL}/club/${clubId}`);
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
    */

    /** Crear clase */
    async create(clase: ClaseCreateDto): Promise<Clase> {
        const { data } = await api.post<Clase>(
            `${this.BASE_URL}/create-clase`,
            clase
        );
        return data;
    }

    /** Actualizar clase */
    async update(id: number, clase: ClaseUpdateDto): Promise<Clase> {
        const { data } = await api.put<Clase>(
            `${this.BASE_URL}/update-clase/${id}`,
            clase
        );
        return data;
    }

    /** Cambiar estado arbitrario */
    async cambiarEstado(id: number, estado: ClaseEstado): Promise<Clase> {
        const { data } = await api.patch<Clase>(
            `${this.BASE_URL}/${id}/estado`,
            null,
            { params: { estado } }
        );
        return data;
    }

    /** Iniciar clase (transición de estado) */
    async iniciar(id: number): Promise<Clase> {
        const { data } = await api.patch<Clase>(`${this.BASE_URL}/${id}/iniciar`);
        return data;
    }

    /** Completar clase */
    async completar(id: number): Promise<Clase> {
        const { data } = await api.patch<Clase>(`${this.BASE_URL}/${id}/completar`);
        return data;
    }

    /** Cancelar clase */
    async cancelar(id: number): Promise<Clase> {
        const { data } = await api.patch<Clase>(`${this.BASE_URL}/${id}/cancelar`);
        return data;
    }

    /** Eliminar (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-clase/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
    */

    /** ¿La clase está activa? */
    async isActiva(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}/activa`);
        return data;
    }

    /** ¿Existe la clase por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/existe/${id}`);
        return data;
    }

    /** ¿Existe ya una clase en ese horario para el grupo? */
    async existeClaseEnHorario({
        grupoId,
        fecha,
        horaInicio,
        horaFin,
    }: ClaseFiltrosHorario): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/horario`, {
            params: { grupoId, fecha, horaInicio, horaFin },
        });
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
    */

    async getEstadisticas(): Promise<EstadisticasClaseDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        // Mapeo defensivo: el back devuelve List<Object[]> → { label, total }
        const mapItems = (arr: any[] | undefined): ClaseEstadisticaItem[] =>
            (arr ?? []).map((item) =>
                Array.isArray(item)
                    ? { label: String(item[0]), total: Number(item[1]) }
                    : { label: String(item.label ?? item[0]), total: Number(item.total ?? item[1]) }
            );

        return {
            total: Number(data.total ?? 0),
            activas: Number(data.activas ?? 0),
            inactivas: Number(data.inactivas ?? 0),
            clasesPorEstado: mapItems(data.clasesPorEstado),
            clasesPorGrupo: mapItems(data.clasesPorGrupo),
            clasesActivasPorGrupo: mapItems(data.clasesActivasPorGrupo),
            clasesPorCategoria: mapItems(data.clasesPorCategoria),
            clasesPorSucursal: mapItems(data.clasesPorSucursal),
            clasesPorMes: mapItems(data.clasesPorMes),
            clasesPorDiaSemana: mapItems(data.clasesPorDiaSemana),
        };
    }
}

export const claseService = new ClaseService();
export default claseService;