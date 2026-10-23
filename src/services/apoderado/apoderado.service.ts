import api from "../api";
import {
    Apoderado,
    ApoderadoCreateDto,
    ApoderadoUpdateDto,
    ApoderadoPaginacionParams,
    ApoderadoParentescoCount,
    ApoderadoTopAlumnos,
} from "../../schemas/dtos/apoderado/ApoderadoDto";
import { Page } from "../../schemas/common/Page";

class ApoderadoService {
    private readonly BASE_URL = '/apoderados';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa (con alumnos) */
    async getAll(): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Lista paginada (orden por defecto: parentesco) */
    async getAllPage(params?: ApoderadoPaginacionParams): Promise<Page<Apoderado>> {
        const { data } = await api.get<Page<Apoderado>>(`${this.BASE_URL}/page`, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sort: params?.sort ?? 'parentesco',
            },
        });
        return data;
    }

    /** Apoderado por ID (con alumnos) */
    async getById(id: number): Promise<Apoderado> {
        const { data } = await api.get<Apoderado>(
            `${this.BASE_URL}/list-apoderado/${id}`
        );
        return data;
    }

    /** Apoderado por contacto exacto */
    async getByContacto(contacto: string): Promise<Apoderado> {
        const { data } = await api.get<Apoderado>(
            `${this.BASE_URL}/contacto/${contacto}`
        );
        return data;
    }

    /** Apoderados por parentesco */
    async getByParentesco(parentesco: string): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(
            `${this.BASE_URL}/parentesco/${parentesco}`
        );
        return data;
    }

    /** Búsqueda por contacto (parcial) */
    async searchByContacto(contacto: string): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(`${this.BASE_URL}/buscar`, {
            params: { contacto },
        });
        return data;
    }

    /** Apoderados por alumno */
    async getByAlumno(alumnoId: number): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(
            `${this.BASE_URL}/alumno/${alumnoId}`
        );
        return data;
    }

    /** Apoderados por RUT del alumno */
    async getByAlumnoRut(rut: string): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(
            `${this.BASE_URL}/alumno-rut/${rut}`
        );
        return data;
    }

    /** Apoderados por grupo */
    async getByGrupo(grupoId: number): Promise<Apoderado[]> {
        const { data } = await api.get<Apoderado[]>(
            `${this.BASE_URL}/grupo/${grupoId}`
        );
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
     */

    /** Crear apoderado */
    async create(apoderado: ApoderadoCreateDto): Promise<Apoderado> {
        const { data } = await api.post<Apoderado>(
            `${this.BASE_URL}/create-apoderado`,
            apoderado
        );
        return data;
    }

    /** Actualizar apoderado */
    async update(id: number, apoderado: ApoderadoUpdateDto): Promise<Apoderado> {
        const { data } = await api.put<Apoderado>(
            `${this.BASE_URL}/update-apoderado/${id}`,
            apoderado
        );
        return data;
    }

    /**
     * Eliminar apoderado.
     * ⚠️ El back hace borrado FÍSICO (deletePhysical), no soft delete.
     * ⚠️ La ruta SÍ es REST pura: DELETE /apoderados/{id}.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/${id}`);
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
     */

    /**
     * Conteo de apoderados por parentesco.
     * El back devuelve List<Object[]> → [{ parentesco, total }].
     */
    async getCountByParentesco(): Promise<ApoderadoParentescoCount[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/estadisticas/parentesco`
        );

        return data.map((item) =>
            Array.isArray(item)
                ? { parentesco: String(item[0]), total: Number(item[1]) }
                : {
                      parentesco: String(item.parentesco ?? item[0]),
                      total: Number(item.total ?? item[1]),
                  }
        );
    }

    /**
     * Top apoderados con más alumnos.
     * El back devuelve List<Object[]> → [{ apoderado, totalAlumnos }].
     */
    async getApoderadosConMasAlumnos(): Promise<ApoderadoTopAlumnos[]> {
        const { data } = await api.get<any[]>(`${this.BASE_URL}/top-alumnos`);

        return data.map((item) =>
            Array.isArray(item)
                ? { apoderado: String(item[0]), totalAlumnos: Number(item[1]) }
                : {
                      apoderado: String(item.apoderado ?? item[0]),
                      totalAlumnos: Number(item.totalAlumnos ?? item[1]),
                  }
        );
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿Existe el apoderado por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}`);
        return data;
    }

    /** ¿Existe un apoderado con ese contacto? */
    async existsByContacto(contacto: string): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/contacto`,
            { params: { contacto } }
        );
        return data;
    }

    /** ¿El apoderado tiene alumnos asociados? */
    async hasAlumnos(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/has-alumnos`
        );
        return data;
    }
}

// Exportación de instancia única (singleton)
export const apoderadoService = new ApoderadoService();
export default apoderadoService;