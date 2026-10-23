import api from "../api";
import {
    Grupo,
    GrupoCreateDto,
    GrupoUpdateDto,
    GrupoSelectOption,
    GrupoFiltrosPrecio,
    GrupoFiltrosCapacidad,
    GrupoFiltrosHorario,
    GrupoEstadisticaItem,
    EstadisticasGrupoDTO,
} from "../../schemas/dtos/grupo/GrupoDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class GrupoService {
    private readonly BASE_URL = '/grupos';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con categoría y sucursal) */
    async getAll(): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Solo grupos activos */
    async getActivos(): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/activos`);
        return data;
    }

    /** Grupo por ID (con categoría y sucursal) */
    async getById(id: number): Promise<Grupo> {
        const { data } = await api.get<Grupo>(`${this.BASE_URL}/list/${id}`);
        return data;
    }

    /** Búsqueda por nombre (parcial) */
    async search(nombre?: string): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /** Grupo por nombre exacto */
    async getByNombre(nombre: string): Promise<Grupo> {
        const { data } = await api.get<Grupo>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /** Grupos activos por categoría */
    async getByCategoria(categoriaId: number): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(
            `${this.BASE_URL}/categoria/${categoriaId}`
        );
        return data;
    }

    /** Grupos activos por sucursal */
    async getBySucursal(sucursalId: number): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Grupos activos por categoría + sucursal */
    async getByCategoriaAndSucursal(
        categoriaId: number,
        sucursalId: number
    ): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(
            `${this.BASE_URL}/cate/${categoriaId}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Grupos por rango de precio */
    async getByPrecio({ min, max }: GrupoFiltrosPrecio): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/precio`, {
            params: { min, max },
        });
        return data;
    }

    /** Grupos por rango de capacidad */
    async getByCapacidad({ min, max }: GrupoFiltrosCapacidad): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/cantidad`, {
            params: { min, max },
        });
        return data;
    }

    /** Grupos por rango de horario */
    async getByHorario({
        horaInicio,
        horaFin,
    }: GrupoFiltrosHorario): Promise<Grupo[]> {
        const { data } = await api.get<Grupo[]>(`${this.BASE_URL}/horario`, {
            params: { horaInicio, horaFin },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
    */

    /** Crear grupo */
    async create(grupo: GrupoCreateDto): Promise<Grupo> {
        const { data } = await api.post<Grupo>(
            `${this.BASE_URL}/create-grupo`,
            grupo
        );
        return data;
    }

    /** Actualizar grupo */
    async update(id: number, grupo: GrupoUpdateDto): Promise<Grupo> {
        const { data } = await api.put<Grupo>(
            `${this.BASE_URL}/update-grupo/${id}`,
            grupo
        );
        return data;
    }

    /** Eliminar grupo */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-grupo/${id}`);
    }

    /**
     * ==============================================================
     * Select y Estadísticas
     * ==============================================================
    */

    /** Opciones de select (todos los grupos) */
    async getSelectOptions(): Promise<GrupoSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por categoría */
    async getSelectOptionsByCategoria(
        categoriaId: number
    ): Promise<GrupoSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/categoria/${categoriaId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por sucursal */
    async getSelectOptionsBySucursal(
        sucursalId: number
    ): Promise<GrupoSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/sucursal/${sucursalId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Estadísticas de grupos */
    async getEstadisticas(): Promise<EstadisticasGrupoDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): GrupoEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            activos: Number(data.activos ?? 0),
            inactivos: Number(data.inactivos ?? 0),
            gruposPorCategoria: mapItems(data.gruposPorCategoria),
            gruposPorSucursal: mapItems(data.gruposPorSucursal),
            gruposPorMes: mapItems(data.gruposPorMes),
        };
    }

    /**
     * ====================================================
     * Validaciones y cupos
     * ====================================================
    */

    /** ¿El grupo está activo? */
    async isActivo(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activo`
        );
        return data;
    }

    /** ¿Existe el grupo por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe/${id}`
        );
        return data;
    }

    /** Cupos disponibles del grupo */
    async getCuposDisponibles(id: number): Promise<number> {
        const { data } = await api.get<number>(
            `${this.BASE_URL}/${id}/cupos-disponibles`
        );
        return data;
    }

    /** ¿El grupo tiene cupos disponibles? */
    async hasCuposDisponibles(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/${id}/has-cupos`
        );
        return data;
    }
}

// Exportación de instancia única (singleton)
export const grupoService = new GrupoService();
export default grupoService;