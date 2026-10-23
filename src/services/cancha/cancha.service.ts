import api from "../api";
import {
    Cancha,
    CanchaCreateDto,
    CanchaUpdateDto,
    CanchaTipo,
    CanchaSelectOption,
    CanchaSelectOptionWithTipo,
    CanchaFiltrosCapacidad,
    CanchaEstadisticaItem,
    EstadisticasCanchaDTO,
} from "../../schemas/dtos/cancha/CanchaDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class CanchaService {
    private readonly BASE_URL = '/cancha';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa (con sucursal) */
    async getAll(): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Cancha por ID (con sucursal) */
    async getById(id: number): Promise<Cancha> {
        const { data } = await api.get<Cancha>(`${this.BASE_URL}/list-cancha/${id}`);
        return data;
    }

    /** Solo canchas disponibles */
    async getDisponibles(): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(`${this.BASE_URL}/disponibles`);
        return data;
    }

    /** Búsqueda por nombre (parcial) */
    async search(nombre?: string): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /** Cancha por nombre exacto */
    async getByNombre(nombre: string): Promise<Cancha> {
        const { data } = await api.get<Cancha>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /** Canchas disponibles por sucursal */
    async getBySucursal(sucursalId: number): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Canchas disponibles por tipo */
    async getByTipo(tipo: CanchaTipo): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(`${this.BASE_URL}/tipo/${tipo}`);
        return data;
    }

    /** Canchas disponibles por sucursal + tipo */
    async getBySucursalAndTipo(
        sucursalId: number,
        tipo: CanchaTipo
    ): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}/tipo/${tipo}`
        );
        return data;
    }

    /** Canchas por rango de capacidad */
    async getByCapacidad({ min, max }: CanchaFiltrosCapacidad): Promise<Cancha[]> {
        const { data } = await api.get<Cancha[]>(`${this.BASE_URL}/capacidad`, {
            params: { min, max },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
     */

    /** Crear cancha */
    async create(cancha: CanchaCreateDto): Promise<Cancha> {
        const { data } = await api.post<Cancha>(
            `${this.BASE_URL}/create-cancha`,
            cancha
        );
        return data;
    }

    /** Actualizar cancha */
    async update(id: number, cancha: CanchaUpdateDto): Promise<Cancha> {
        const { data } = await api.put<Cancha>(
            `${this.BASE_URL}/update-cancha/${id}`,
            cancha
        );
        return data;
    }

    /**
     * Cambiar disponibilidad de la cancha.
     * ⚠️ PATCH con @RequestParam boolean disponible (no body).
     */
    async cambiarDisponibilidad(id: number, disponible: boolean): Promise<Cancha> {
        const { data } = await api.patch<Cancha>(
            `${this.BASE_URL}/disponibilidad/${id}`,
            null,
            { params: { disponible } }
        );
        return data;
    }

    /** Eliminar cancha */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-cancha/${id}`);
    }

    /**
     * ==============================================================
     * Select, tipos y Estadísticas
     * ==============================================================
     */

    /** Opciones de select (id + nombre) */
    async getSelectOptions(): Promise<CanchaSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por sucursal */
    async getSelectOptionsBySucursal(
        sucursalId: number
    ): Promise<CanchaSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/sucursal/${sucursalId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /**
     * Opciones de select con tipo (id + nombre + tipo).
     * El back devuelve Object[3] → [id, nombre, tipo].
     */
    async getSelectOptionsWithTipoBySucursal(
        sucursalId: number
    ): Promise<CanchaSelectOptionWithTipo[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/sucursal/${sucursalId}/con-tipo`
        );

        return data.map((item) => {
            if (Array.isArray(item)) {
                return { id: item[0], nombre: item[1], tipo: item[2] };
            }
            return { id: item.id, nombre: item.nombre, tipo: item.tipo };
        });
    }

    /** Tipos de cancha disponibles (lista de strings) */
    async getTiposDisponibles(): Promise<CanchaTipo[]> {
        const { data } = await api.get<CanchaTipo[]>(`${this.BASE_URL}/tipos`);
        return data;
    }

    /** Estadísticas de canchas */
    async getEstadisticas(): Promise<EstadisticasCanchaDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): CanchaEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            disponibles: Number(data.disponibles ?? 0),
            noDisponibles: Number(data.noDisponibles ?? 0),
            canchasPorTipo: mapItems(data.canchasPorTipo),
            canchasPorSucursal: mapItems(data.canchasPorSucursal),
        };
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿La cancha está disponible? */
    async isDisponible(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/disponible`
        );
        return data;
    }

    /** ¿Existe la cancha por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe/${id}`
        );
        return data;
    }
}

// Exportación de instancia única (singleton)
export const canchaService = new CanchaService();
export default canchaService;