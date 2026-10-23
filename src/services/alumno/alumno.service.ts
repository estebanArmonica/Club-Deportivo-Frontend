import api from "../api";
import {
    Alumno,
    AlumnoCreateDto,
    AlumnoUpdateDto,
    AlumnoPaginacionParams,
    AlumnoFiltrosFecha,
    AlumnoFiltrosEdad,
    AlumnoBusquedaParams,
    AlumnoInscripcionParams,
    AlumnoTopAsistencias,
} from "../../schemas/dtos/alumno/AlumnoDto";
import { Page } from "../../schemas/common/Page";

class AlumnoService {
    private readonly BASE_URL = '/alumnos';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa (con apoderados) */
    async getAll(): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Alumno por ID (con apoderados) */
    async getById(id: number): Promise<Alumno> {
        const { data } = await api.get<Alumno>(
            `${this.BASE_URL}/list-alumno/${id}`
        );
        return data;
    }

    /** Alumno por RUT */
    async getByRut(rut: string): Promise<Alumno> {
        const { data } = await api.get<Alumno>(`${this.BASE_URL}/rut/${rut}`);
        return data;
    }

    /** Lista paginada (orden por defecto: nombre) */
    async getAllPage(params?: AlumnoPaginacionParams): Promise<Page<Alumno>> {
        const { data } = await api.get<Page<Alumno>>(`${this.BASE_URL}/page`, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sort: params?.sort ?? 'nombre',
            },
        });
        return data;
    }

    /** Solo alumnos activos */
    async getActivos(): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(`${this.BASE_URL}/activos`);
        return data;
    }

    /** Solo alumnos inactivos */
    async getInactivos(): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(`${this.BASE_URL}/inactivos`);
        return data;
    }

    /** Búsqueda por nombre y/o apellido (parcial) */
    async search({ nombre, apellido }: AlumnoBusquedaParams = {}): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(`${this.BASE_URL}/buscar`, {
            params: { nombre, apellido },
        });
        return data;
    }

    /** Alumnos por rango de fecha de inscripción */
    async getByFechasInscripcion({
        inicio,
        fin,
    }: AlumnoFiltrosFecha): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(
            `${this.BASE_URL}/fechas-inscripcion`,
            { params: { inicio, fin } }
        );
        return data;
    }

    /** Alumnos por apoderado */
    async getByApoderado(apoderadoId: number): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(
            `${this.BASE_URL}/apoderado/${apoderadoId}`
        );
        return data;
    }

    /** Alumnos activos por grupo */
    async getActivosByGrupo(grupoId: number): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(
            `${this.BASE_URL}/grupo/${grupoId}/activos`
        );
        return data;
    }

    /** Alumnos que asistieron a una clase */
    async getQueAsistieronAClase(claseId: number): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(
            `${this.BASE_URL}/clase/${claseId}/asistieron`
        );
        return data;
    }

    /** Alumnos que NO asistieron a una clase */
    async getQueNoAsistieronAClase(claseId: number): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(
            `${this.BASE_URL}/clase/${claseId}/no-asistieron`
        );
        return data;
    }

    /** Alumnos por rango de edad */
    async getByEdad({ edadMin, edadMax }: AlumnoFiltrosEdad): Promise<Alumno[]> {
        const { data } = await api.get<Alumno[]>(`${this.BASE_URL}/edad`, {
            params: { edadMin, edadMax },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, DELETE)
     * =====================================================
     */

    /** Crear alumno */
    async create(alumno: AlumnoCreateDto): Promise<Alumno> {
        const { data } = await api.post<Alumno>(
            `${this.BASE_URL}/create-alumno`,
            alumno
        );
        return data;
    }

    /** Actualizar alumno */
    async update(id: number, alumno: AlumnoUpdateDto): Promise<Alumno> {
        const { data } = await api.put<Alumno>(
            `${this.BASE_URL}/update-alumno/${id}`,
            alumno
        );
        return data;
    }

    /** Desactivar alumno (soft delete) */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-alumno/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿Existe el alumno por ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}`);
        return data;
    }

    /** ¿Existe un alumno con ese RUT? */
    async existsByRut(rut: string): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/rut`, {
            params: { rut },
        });
        return data;
    }

    /** ¿El alumno está activo? */
    async isActivo(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activo`
        );
        return data;
    }

    /** ¿El alumno ya está inscrito en ese grupo? */
    async isAlumnoInscritoEnGrupo({
        alumnoId,
        grupoId,
    }: AlumnoInscripcionParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/inscripcion`,
            { params: { alumnoId, grupoId } }
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
     */

    /** Cantidad de alumnos activos */
    async countAlumnosActivos(): Promise<number> {
        const { data } = await api.get<number>(
            `${this.BASE_URL}/contar-activos`
        );
        return data;
    }

    /**
     * Top alumnos con más asistencias.
     * El back devuelve List<Object[]> → [{ alumno, totalAsistencias }].
     */
    async getAlumnosConMasAsistencias(): Promise<AlumnoTopAsistencias[]> {
        const { data } = await api.get<any[]>(
            `${this.BASE_URL}/top-asistencias`
        );

        return data.map((item) =>
            Array.isArray(item)
                ? { alumno: String(item[0]), totalAsistencias: Number(item[1]) }
                : {
                      alumno: String(item.alumno ?? item[0]),
                      totalAsistencias: Number(item.totalAsistencias ?? item[1]),
                  }
        );
    }
}

// Exportación de instancia única (singleton)
export const alumnoService = new AlumnoService();
export default alumnoService;