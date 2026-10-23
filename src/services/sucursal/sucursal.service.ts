import api from "../api";

import {
    Sucursal,
    SucursalCreateDto,
    SucursalUpdateDto,
    SucursalSelectOption,
    EstadisticasSucursalDTO,
} from "../../schemas/dtos/sucursal/SucursalDto";

class SucursalService {
    private readonly BASE_URL = '/sucursales';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con club) */
    async getAll(): Promise<Sucursal[]> {
        const { data } = await api.get<Sucursal[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Sucursal por ID (con club) */
    async getById(id: number): Promise<Sucursal> {
        const { data } = await api.get<Sucursal>(`${this.BASE_URL}/list-sucursal/${id}`);
        return data;
    }

    /** Solo sucursales activas */
    async getActivas(): Promise<Sucursal[]> {
        const { data } = await api.get<Sucursal[]>(`${this.BASE_URL}/activas`);
        return data;
    }

    /** Búsqueda por nombre (parcial) */
    async search(nombre?: string): Promise<Sucursal[]> {
        const { data } = await api.get<Sucursal[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /** Búsqueda por dirección */
    async searchByDireccion(direccion: string): Promise<Sucursal[]> {
        const { data } = await api.get<Sucursal[]>(
            `${this.BASE_URL}/buscar-por-direccion`,
            { params: { direccion } }
        );
        return data;
    }

    /** Sucursal por nombre exacto */
    async getByNombre(nombre: string): Promise<Sucursal> {
        const { data } = await api.get<Sucursal>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /** Sucursal por teléfono */
    async getByTelefono(telefono: string): Promise<Sucursal> {
        const { data } = await api.get<Sucursal>(`${this.BASE_URL}/telefono/${telefono}`);
        return data;
    }

    /** Sucursales activas por club */
    async getByClub(clubId: number): Promise<Sucursal[]> {
        const { data } = await api.get<Sucursal[]>(`${this.BASE_URL}/club/${clubId}`);
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
    */

    /** Crear sucursal */
    async create(sucursal: SucursalCreateDto): Promise<Sucursal> {
        const { data } = await api.post<Sucursal>(
            `${this.BASE_URL}/create-sucursal`,
            sucursal
        );
        return data;
    }

    /** Actualizar sucursal */
    async update(id: number, sucursal: SucursalUpdateDto): Promise<Sucursal> {
        const { data } = await api.put<Sucursal>(
            `${this.BASE_URL}/update-sucursal/${id}`,
            sucursal
        );
        return data;
    }

    /** Eliminar sucursal */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-sucursal/${id}`);
    }

    /**
     * ==============================================================
     * Select y Estadísticas
     * ==============================================================
    */

    /** Opciones de select (todas las sucursales) */
    async getSelectOptions(): Promise<SucursalSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select filtradas por club */
    async getSelectOptionsByClub(clubId: number): Promise<SucursalSelectOption[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/select/club/${clubId}`
        );

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Estadísticas de sucursales */
    async getEstadisticas(): Promise<EstadisticasSucursalDTO> {
        const { data } = await api.get<EstadisticasSucursalDTO>(
            `${this.BASE_URL}/estadisticas`
        );
        return data;
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
    */

    /** ¿La sucursal está activa? */
    async isActiva(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}/activa`);
        return data;
    }

    /** ¿Existe la sucursal por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/existe/${id}`);
        return data;
    }
}

// exportacion de instancia
export const sucursalService = new SucursalService();
export default sucursalService;