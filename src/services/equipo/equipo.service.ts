import api from "../api";
import {
    Equipo,
    EquipoCreateDto,
    EquipoUpdateDto,
    EquipoSelectOption,
    EquipoUsuarioGrupoParams,
    EquipoEstadisticaItem,
    EstadisticasEquipoDTO,
} from "../../schemas/dtos/equipo/EquipoDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class EquipoService {
    private readonly BASE_URL = '/equipos';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con usuario y grupo) */
    async getAll(): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Equipo por ID (con todas las relaciones) */
    async getById(id: number): Promise<Equipo> {
        const { data } = await api.get<Equipo>(
            `${this.BASE_URL}/list-equipo/${id}`
        );
        return data;
    }

    /** Solo equipos activos */
    async getActivos(): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(`${this.BASE_URL}/activos`);
        return data;
    }

    /** Búsqueda por nombre (parcial) */
    async search(nombre?: string): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /** Equipo por nombre exacto */
    async getByNombre(nombre: string): Promise<Equipo> {
        const { data } = await api.get<Equipo>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /** Equipos activos por grupo */
    async getByGrupo(grupoId: number): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(
            `${this.BASE_URL}/grupo/${grupoId}`
        );
        return data;
    }

    /** Equipos activos por usuario (profesor/entrenador) */
    async getByUsuario(usuarioId: number): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(
            `${this.BASE_URL}/usuario/${usuarioId}`
        );
        return data;
    }

    /** Equipos activos por categoría (vía grupo) */
    async getByCategoria(categoriaId: number): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(
            `${this.BASE_URL}/categoria/${categoriaId}`
        );
        return data;
    }

    /** Equipos activos por sucursal (vía grupo) */
    async getBySucursal(sucursalId: number): Promise<Equipo[]> {
        const { data } = await api.get<Equipo[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
    */

    /** Crear equipo */
    async create(equipo: EquipoCreateDto): Promise<Equipo> {
        const { data } = await api.post<Equipo>(
            `${this.BASE_URL}/create-equipo`,
            equipo
        );
        return data;
    }

    /** Actualizar equipo */
    async update(id: number, equipo: EquipoUpdateDto): Promise<Equipo> {
        const { data } = await api.put<Equipo>(
            `${this.BASE_URL}/update-equipo/${id}`,
            equipo
        );
        return data;
    }

    /**
     * Asignar capitán al equipo.
     * PATCH con 2 path variables: /{equipoId}/capitan/{usuarioId}
    */
    async asignarCapitan(equipoId: number, usuarioId: number): Promise<Equipo> {
        const { data } = await api.patch<Equipo>(
            `${this.BASE_URL}/${equipoId}/capitan/${usuarioId}`
        );
        return data;
    }

    /** Desactivar equipo (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-equipo/${id}`);
    }

    /**
     * ==============================================================
     * Select y Estadísticas
     * ==============================================================
    */

    /** Opciones de select (todos los equipos) */
    async getSelectOptions(): Promise<EquipoSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por grupo */
    async getSelectOptionsByGrupo(grupoId: number): Promise<EquipoSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/grupo/${grupoId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por usuario */
    async getSelectOptionsByUsuario(
        usuarioId: number
    ): Promise<EquipoSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/usuario/${usuarioId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Estadísticas de equipos */
    async getEstadisticas(): Promise<EstadisticasEquipoDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): EquipoEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            activos: Number(data.activos ?? 0),
            inactivos: Number(data.inactivos ?? 0),
            equiposPorGrupo: mapItems(data.equiposPorGrupo),
            equiposPorCategoria: mapItems(data.equiposPorCategoria),
            equiposPorSucursal: mapItems(data.equiposPorSucursal),
            equiposPorMes: mapItems(data.equiposPorMes),
        };
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
    */

    /** ¿El equipo está activo? */
    async isActivo(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activo`
        );
        return data;
    }

    /** ¿Existe el equipo por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe/${id}`
        );
        return data;
    }

    /** ¿El equipo ya tiene capitán asignado? */
    async hasCapitanAsignado(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/capitan`
        );
        return data;
    }

    /** ¿El usuario ya es capitán en algún equipo del grupo? */
    async isUsuarioCapitanEnGrupo({
        usuarioId,
        grupoId,
    }: EquipoUsuarioGrupoParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/usuario-capitan`,
            { params: { usuarioId, grupoId } }
        );
        return data;
    }
}

// Exportación de instancia única (singleton)
export const equipoService = new EquipoService();
export default equipoService;