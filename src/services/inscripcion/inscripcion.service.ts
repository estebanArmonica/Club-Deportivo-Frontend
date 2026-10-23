import api from "../api";
import {
    Inscripcion,
    InscripcionCreateDto,
    InscripcionUpdateDto,
    InscripcionEstado,
    InscripcionFiltrosFecha,
    InscripcionAlumnoGrupoParams,
    InscripcionEstadisticaItem,
    EstadisticasInscripcionDTO,
} from "../../schemas/dtos/inscripcion/InscripcionDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class InscripcionService {
    private readonly BASE_URL = '/inscripciones';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Lista completa (con alumno y grupo) */
    async getAll(): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Inscripción por ID (con todas las relaciones) */
    async getById(id: number): Promise<Inscripcion> {
        const { data } = await api.get<Inscripcion>(
            `${this.BASE_URL}/list-inscripcion/${id}`
        );
        return data;
    }

    /** Solo inscripciones activas */
    async getActivas(): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(`${this.BASE_URL}/activas`);
        return data;
    }

    /** Inscripciones por estado */
    async getByEstado(estado: InscripcionEstado): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/estado/${estado}`
        );
        return data;
    }

    /** Inscripciones activas por alumno */
    async getByAlumno(alumnoId: number): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/alumno/${alumnoId}`
        );
        return data;
    }

    /** Inscripciones activas por grupo */
    async getByGrupo(grupoId: number): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/grupo/${grupoId}`
        );
        return data;
    }

    /** Inscripciones activas por apoderado */
    async getByApoderado(apoderadoId: number): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/apoderado/${apoderadoId}`
        );
        return data;
    }

    /** Inscripciones activas por categoría (vía grupo) */
    async getByCategoria(categoriaId: number): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/categoria/${categoriaId}`
        );
        return data;
    }

    /** Inscripciones activas por sucursal (vía grupo) */
    async getBySucursal(sucursalId: number): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(
            `${this.BASE_URL}/sucursal/${sucursalId}`
        );
        return data;
    }

    /** Inscripciones por rango de fechas de inscripción */
    async getByFechas({ inicio, fin }: InscripcionFiltrosFecha): Promise<Inscripcion[]> {
        const { data } = await api.get<Inscripcion[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
    */

    /** Crear inscripción */
    async create(inscripcion: InscripcionCreateDto): Promise<Inscripcion> {
        const { data } = await api.post<Inscripcion>(
            `${this.BASE_URL}/create-inscripcion`,
            inscripcion
        );
        return data;
    }

    /** Actualizar inscripción */
    async update(
        id: number,
        inscripcion: InscripcionUpdateDto
    ): Promise<Inscripcion> {
        const { data } = await api.put<Inscripcion>(
            `${this.BASE_URL}/update-inscripcion/${id}`,
            inscripcion
        );
        return data;
    }

    /** Cambiar estado arbitrario */
    async cambiarEstado(
        id: number,
        estado: InscripcionEstado
    ): Promise<Inscripcion> {
        const { data } = await api.patch<Inscripcion>(
            `${this.BASE_URL}/cambiar/${id}/estado`,
            null,
            { params: { estado } }
        );
        return data;
    }

    /** Activar inscripción */
    async activar(id: number): Promise<Inscripcion> {
        const { data } = await api.patch<Inscripcion>(
            `${this.BASE_URL}/${id}/activar`
        );
        return data;
    }

    /** Suspender inscripción */
    async suspender(id: number): Promise<Inscripcion> {
        const { data } = await api.patch<Inscripcion>(
            `${this.BASE_URL}/sus/${id}/suspender`
        );
        return data;
    }

    /** Finalizar inscripción */
    async finalizar(id: number): Promise<Inscripcion> {
        const { data } = await api.patch<Inscripcion>(
            `${this.BASE_URL}/final/${id}/finalizar`
        );
        return data;
    }

    /**
     * Eliminar inscripción.
     * ⚠️ El back hace borrado FÍSICO (deletePhysical), no soft delete.
    */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-inscripcion/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
    */

    /** ¿El alumno ya está inscrito en ese grupo? */
    async isAlumnoInscritoEnGrupo({
        alumnoId,
        grupoId,
    }: InscripcionAlumnoGrupoParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/alumno-grupo`,
            { params: { alumnoId, grupoId } }
        );
        return data;
    }

    /** ¿El grupo tiene inscripciones activas? */
    async hasInscripcionesActivas(grupoId: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/grupo/${grupoId}/inscripciones-activas`
        );
        return data;
    }

    /** ¿El alumno tiene inscripciones activas? */
    async hasInscripcionesActivasByAlumno(alumnoId: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/alumno/${alumnoId}/inscripciones-activas`
        );
        return data;
    }

    /** ¿La inscripción está activa? */
    async isInscripcionActiva(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/${id}/activa`
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
    */

    async getEstadisticas(): Promise<EstadisticasInscripcionDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): InscripcionEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            activas: Number(data.activas ?? 0),
            suspendidas: Number(data.suspendidas ?? 0),
            finalizadas: Number(data.finalizadas ?? 0),
            canceladas: Number(data.canceladas ?? 0),
            inscripcionesPorEstado: mapItems(data.inscripcionesPorEstado),
            inscripcionesPorGrupo: mapItems(data.inscripcionesPorGrupo),
            inscripcionesPorCategoria: mapItems(data.inscripcionesPorCategoria),
            inscripcionesPorSucursal: mapItems(data.inscripcionesPorSucursal),
            inscripcionesPorMes: mapItems(data.inscripcionesPorMes),
        };
    }
}

// Exportación de instancia única (singleton)
export const inscripcionService = new InscripcionService();
export default inscripcionService;