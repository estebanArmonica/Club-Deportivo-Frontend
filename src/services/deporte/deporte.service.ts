import api from "../api";
import {
    Deporte,
    DeporteCreateDto,
    DeporteUpdateDto,
    DeporteSelectOption,
    EstadisticasDeporteDTO
} from '../../schemas/dtos/deporte/DeporteDto';

class DeporteService {
    private readonly BASE_URL = '/deportes';

    /**
     * Lectura de los métodos HTTP del backend 
     * 
    */

    // Métodos GET

    /**
     * Listamos todos los deportes existentes 
    */
    async getAll(): Promise<Deporte[]> {
        const { data } = await api.get<Deporte[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /**
     * Buscamos solo deportes que estén activos
    */
    async getActivos(): Promise<Deporte[]> {
        const { data } = await api.get<Deporte[]>(`${this.BASE_URL}/list-activos`);
        return data;
    }

    /**
     * Buscamos deportes con ID 
    */
    async getById(id: number): Promise<Deporte> {
        const { data } = await api.get<Deporte>(`${this.BASE_URL}/list/${id}`);
        return data;
    }

    /**
     * Buscamos por el nombre del deporte -> busquedas parciales
     * @param nombre -> nombre del deporte a buscar
    */
    async search(nombre?: string): Promise<Deporte[]> {
        const { data } = await api.get<Deporte[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /**
     * Obtenemos el nombre del deporte exacto
     * @param nombre -> nombre del deporte que tiene que encontrar
    */
    async getByNombre(nombre: string): Promise<Deporte> {
        const { data } = await api.get<Deporte>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /**
     * Métodos POST, PUT y DELETE de escritura 
    */
    
    /**
     * Creamos un nuevo objeto de deporte
     * @param deporte -> objeto a escribir y guardar
     * @returns -> un objeto DTOde json del nuevo deporte agregado
    */
    async create(deporte: DeporteCreateDto): Promise<Deporte> {
        const { data } = await api.post<Deporte>(`${this.BASE_URL}/create-deporte`, deporte);
        return data;
    }

    /**
     * Actualizamos un deporte que es existente en el sistema
     * @param id -> ID del deporte que se va actualizar
     * @param deporte -> datos del deporte que queremos modificar
     * @returns -> un objeto nuevo del ID buscado
    */
    async update(id: number, deporte: DeporteUpdateDto): Promise<Deporte> {
        const { data } = await api.put<Deporte>(`${this.BASE_URL}/update-deporte/${id}`, deporte);
        return data;
    }

    /**
     * Eiminamos un deporte existente
     * @param id -> ID del deporte a eliminar
    */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-deporte/${id}`);
    }

    /**
     * Seleccionadores y estadisticas
    */
    
    /** Opciones de select (solo activos) */
    async getSelectOptions(): Promise<DeporteSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Opciones de select (todos, activos e inactivos) */
    async getTodosSelectOptions(): Promise<DeporteSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select/todos`);

        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /** Estadísticas de deportes */
    async getEstadisticas(): Promise<EstadisticasDeporteDTO> {
        const { data } = await api.get<EstadisticasDeporteDTO>(`${this.BASE_URL}/estadistica`);
        return data;
    }

    /**
     * Validaciones 
    */
    
    /** Verifica si un deporte está activo */
    async isActive(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}/activo`);
        return data;
    }

    /** Verifica si un deporte existe por ID */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/existe/${id}`);
        return data;
    }
}

// exportaciones de instancias
export const deporteService = new DeporteService();
export default deporteService;