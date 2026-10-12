import api from "../api";
import {
    Categoria,
    CategoriaCreateDto,
    CategoriaUpdateDto,
    CategoriaSelectOption,
    EstadisticasCategoriaDTO
} from '../../schemas/dtos/cate/CategoriaDto';

class CategoriaService {
    private readonly BASE_URL = '/categorias';

    /**
     * =============================================
     * Lecturas del metodo GET 
     * =============================================
    */
    async getAll(): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /**
     * Este método obtiene solo las categorias activas  
    */
    async getActivas(): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/activas`);
        return data;
    }

    /**
     * Este método obtiene una categoria por su ID -> incluye el deporte
    */
    async getById(id: number): Promise<Categoria> {
        const { data } = await api.get<Categoria>(`${this.BASE_URL}/list/${id}`);
        return data;
    }

    /**
     * Buscamos una categoria por su nombre  
    */
    async search(nombre?: string): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre },
        });
        return data;
    }

    /**
     * Obtenemos el nombre exacto de la categoria 
    */
    async getByNombre(nombre: string): Promise<Categoria> {
        const { data } = await api.get<Categoria>(`${this.BASE_URL}/nombre/${nombre}`);
        return data;
    }

    /**
     * Obtenemos las categorias que son activas por el deporte asociado
    */
    async getByDeporte(deporteId: number): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/deporte/${deporteId}`);
        return data;
    }

    /**
     * Obtenemos las categorias por edades de estudiantes
    */
    async getByEdad(edad: number): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/por-edad`, {
            params: { edad },
        });
        return data;
    }

    /**
     * Obtenemos las categorias por edad y el deporte asociado 
    */
    async getBDeporteAndEdad(deporteId: number, edad: number): Promise<Categoria[]> {
        const { data } = await api.get<Categoria[]>(`${this.BASE_URL}/deporte/${deporteId}/edad`, {
            params: { edad },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras de metodo POST, PUT, DELETE
     * =====================================================
    */

    /**
     * POST -> Creamos una nueva categoria 
    */
    async create(categoria: CategoriaCreateDto): Promise<Categoria> {
        const { data } = await api.post<Categoria>(this.BASE_URL, categoria);
        return data;
    }

    /**
     * PUT -> Actualizamos una categoria existente por su ID 
    */
    async update(id: number, categoria: CategoriaUpdateDto): Promise<Categoria> {
        const { data } = await api.put<Categoria>(`${this.BASE_URL}/${id}`, categoria);
        return data;
    }

    /**
     * DELETE -> (Soft Delete) => eliminacion logico
     * Eliminamos una categorias por su ID 
    */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/${id}`);
    }

    /**
     * ==============================================================
     *  SELECT y Estadisticas 
     * ============================================================== 
    */
    
    /**
     * Opciones de selects 
    */
    async getSelectOptions(): Promise<CategoriaSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select`);

        // mapeamos el objeto -> a un objeto tipado (object[])
        return data.map((item) => ({
            id:     Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /**
     * Opciones de filtrados para busqueda de deportes
    */
    async getSelectOptionsByDeporte(deporteId: number): Promise<CategoriaSelectOption[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/select/deporte/${deporteId}`);
        
        return data.map((item) => ({
            id: Array.isArray(item) ? item[0] : item.id,
            nombre: Array.isArray(item) ? item[1] : item.nombre,
        }));
    }

    /**
     * Estadisticas para categorias
    */
    async getEstadisticas(): Promise<EstadisticasCategoriaDTO> {
        const { data } = await api.get<EstadisticasCategoriaDTO>(`${this.BASE_URL}/estadisticas`);
        return data;
    }

    /**
     * ====================================================
     * Validaciones
     * ==================================================== 
    */
    
    /**
     * Verificamos si las categorias tienen el estado active 
    */
    async isActive(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}/activa`);
        return data;
    }

    /**
     * Verificamos si la categoria ingresada/buscada, existe
    */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/existe/${id}`);
        return data;
    }
}

// exportación de instancia unica (singleton)
export const categoriaService = new CategoriaService();
export default categoriaService;