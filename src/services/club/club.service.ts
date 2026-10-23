import api from "../api";
import {
    Club,
    ClubCreateDto,
    ClubUpdateDto,
    ClubSelectOption,
    ClubSelectOptionWithCuit,
    ClubFiltrosFecha,
    ClubEstadisticaItem,
    EstadisticasClubDTO,
} from "../../schemas/dtos/club/ClubDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class ClubService {
    private readonly BASE_URL = '/clubes';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa de clubes */
    async getAll(): Promise<Club[]> {
        const { data } = await api.get<Club[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Club por ID */
    async getById(id: number): Promise<Club> {
        const { data } = await api.get<Club>(`${this.BASE_URL}/list-club/${id}`);
        return data;
    }

    /** Solo clubes activos */
    async getActivos(): Promise<Club[]> {
        const { data } = await api.get<Club[]>(`${this.BASE_URL}/activos`);
        return data;
    }

    /** Búsqueda por nombre (parcial) */
    async search(nombre?: string): Promise<Club[]> {
        const { data } = await api.get<Club[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /** Búsqueda por dirección (parcial) */
    async searchByDireccion(direccion?: string): Promise<Club[]> {
        const { data } = await api.get<Club[]>(
            `${this.BASE_URL}/buscar-por-direccion`,
            { params: { direccion } }
        );
        return data;
    }

    /** Club por nombre exacto */
    async getByNombre(nombre: string): Promise<Club> {
        const { data } = await api.get<Club>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /** Club por CUIT */
    async getByCuit(cuit: string): Promise<Club> {
        const { data } = await api.get<Club>(`${this.BASE_URL}/cuit/${cuit}`);
        return data;
    }

    /** Club por email */
    async getByEmail(email: string): Promise<Club> {
        const { data } = await api.get<Club>(`${this.BASE_URL}/email/${email}`);
        return data;
    }

    /** Clubes creados en un rango de fechas */
    async getByFechas({ inicio, fin }: ClubFiltrosFecha): Promise<Club[]> {
        const { data } = await api.get<Club[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /** Clubes activos creados después de una fecha */
    async getCreadosDespuesDe(fecha: string): Promise<Club[]> {
        const { data } = await api.get<Club[]>(
            `${this.BASE_URL}/creados-despues`,
            { params: { fecha } }
        );
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
     */

    /** Crear club */
    async create(club: ClubCreateDto): Promise<Club> {
        const { data } = await api.post<Club>(
            `${this.BASE_URL}/create-club`,
            club
        );
        return data;
    }

    /** Actualizar club */
    async update(id: number, club: ClubUpdateDto): Promise<Club> {
        const { data } = await api.put<Club>(
            `${this.BASE_URL}/update-club/${id}`,
            club
        );
        return data;
    }

    /** Desactivar club (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-club/${id}`);
    }

    /**
     * ==============================================================
     * Select y Estadísticas
     * ==============================================================
     */

    /** Opciones de select (id + nombre) */
    async getSelectOptions(): Promise<ClubSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /**
     * Opciones de select con CUIT (id + nombre + cuit).
     * El back devuelve Object[3] → [id, nombre, cuit].
     */
    async getSelectOptionsWithCuit(): Promise<ClubSelectOptionWithCuit[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select-con-cuit`
        );

        return data.map((item) => {
            if (Array.isArray(item)) {
                return { id: item[0], nombre: item[1], cuit: item[2] };
            }
            return { id: item.id, nombre: item.nombre, cuit: item.cuit };
        });
    }

    /** Estadísticas de clubes */
    async getEstadisticas(): Promise<EstadisticasClubDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): ClubEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            activos: Number(data.activos ?? 0),
            inactivos: Number(data.inactivos ?? 0),
            clubesPorMes: mapItems(data.clubesPorMes),
        };
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿El club está activo? */
    async isActivo(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activo`
        );
        return data;
    }

    /** ¿Existe el club por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe/${id}`
        );
        return data;
    }

    /** ¿Existe un club con ese email? */
    async existsByEmail(email: string): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/email`, {
            params: { email },
        });
        return data;
    }

    /** ¿Existe un club con ese CUIT? */
    async existsByCuit(cuit: string): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/cuit`, {
            params: { cuit },
        });
        return data;
    }
}

// Exportación de instancia única (singleton)
export const clubService = new ClubService();
export default clubService;