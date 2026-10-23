import api from "../api";
import {
    Asistencia,
    AsistenciaCreateDto,
    AsistenciaUpdateDto,
    AsistenciaRegistrarParams,
    AsistenciaClasePagoParams,
    AsistenciaFiltrosFecha,
    AsistenciaEstadisticaItem,
    EstadisticasAsistenciaDTO,
} from "../../schemas/dtos/asistencia/AsistenciaDto";
import { mapObjectArrayToLabelTotal } from "../../utils/mapStats";

class AsistenciaService {
    private readonly BASE_URL = '/asistencia';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
     */

    /** Lista completa (con clase y pago) */
    async getAll(): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(`${this.BASE_URL}/list-all`);
        return data;
    }

    /** Asistencia por ID (con todas las relaciones) */
    async getById(id: number): Promise<Asistencia> {
        const { data } = await api.get<Asistencia>(
            `${this.BASE_URL}/list-asistencia/${id}`
        );
        return data;
    }

    /** Asistencias por clase (todas) */
    async getByClase(claseId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/clase/${claseId}`
        );
        return data;
    }

    /** Asistencias presentes por clase */
    async getPresentesByClase(claseId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/clase/${claseId}/presentes`
        );
        return data;
    }

    /** Asistencias ausentes por clase */
    async getAusentesByClase(claseId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/clase/${claseId}/ausentes`
        );
        return data;
    }

    /** Asistencias por grupo */
    async getByGrupo(grupoId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/grupo/${grupoId}`
        );
        return data;
    }

    /** Asistencias por pago */
    async getByPago(pagoId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/pago/${pagoId}`
        );
        return data;
    }

    /** Asistencias por alumno (todas) */
    async getByAlumno(alumnoId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/alumno/${alumnoId}`
        );
        return data;
    }

    /** Asistencias presentes por alumno */
    async getPresentesByAlumno(alumnoId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/alumno/${alumnoId}/presentes`
        );
        return data;
    }

    /** Asistencias ausentes por alumno */
    async getAusentesByAlumno(alumnoId: number): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(
            `${this.BASE_URL}/alumno/${alumnoId}/ausentes`
        );
        return data;
    }

    /** Asistencias por fecha puntual */
    async getByFecha(fecha: string): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(`${this.BASE_URL}/fecha`, {
            params: { fecha },
        });
        return data;
    }

    /** Asistencias por rango de fechas */
    async getByFechas({ inicio, fin }: AsistenciaFiltrosFecha): Promise<Asistencia[]> {
        const { data } = await api.get<Asistencia[]>(`${this.BASE_URL}/fechas`, {
            params: { inicio, fin },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
     */

    /** Crear asistencia desde JSON */
    async create(asistencia: AsistenciaCreateDto): Promise<Asistencia> {
        const { data } = await api.post<Asistencia>(
            `${this.BASE_URL}/create-asistencia`,
            asistencia
        );
        return data;
    }

    /**
     * Registrar asistencia (POST con 3 query params, no body).
     * ⚠️ El back recibe claseId, pagoId, asistio como @RequestParam.
     */
    async registrarAsistencia({
        claseId,
        pagoId,
        asistio,
    }: AsistenciaRegistrarParams): Promise<Asistencia> {
        const { data } = await api.post<Asistencia>(
            `${this.BASE_URL}/registrar`,
            null,
            { params: { claseId, pagoId, asistio } }
        );
        return data;
    }

    /** Actualizar asistencia */
    async update(id: number, asistencia: AsistenciaUpdateDto): Promise<Asistencia> {
        const { data } = await api.put<Asistencia>(
            `${this.BASE_URL}/update-asistencia/${id}`,
            asistencia
        );
        return data;
    }

    /** Marcar como PRESENTE */
    async marcarPresente(id: number): Promise<Asistencia> {
        const { data } = await api.patch<Asistencia>(
            `${this.BASE_URL}/${id}/presente`
        );
        return data;
    }

    /** Marcar como AUSENTE */
    async marcarAusente(id: number): Promise<Asistencia> {
        const { data } = await api.patch<Asistencia>(
            `${this.BASE_URL}/${id}/ausente`
        );
        return data;
    }

    /**
     * Eliminar asistencia.
     * ⚠️ El back hace borrado FÍSICO (deletePhysical), no soft delete.
     */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-asistencia/${id}`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
     */

    /** ¿Ya existe una asistencia para esa clase + pago? */
    async existsByClaseAndPago({
        claseId,
        pagoId,
    }: AsistenciaClasePagoParams): Promise<boolean> {
        const { data } = await api.get<boolean>(
            `${this.BASE_URL}/validar/existe`,
            { params: { claseId, pagoId } }
        );
        return data;
    }

    /**
     * ====================================================
     * Estadísticas
     * ====================================================
     */

    async getEstadisticas(): Promise<EstadisticasAsistenciaDTO> {
        const { data } = await api.get<any>(`${this.BASE_URL}/estadisticas`);

        const mapItems = (arr: any[] | undefined): AsistenciaEstadisticaItem[] =>
            mapObjectArrayToLabelTotal(arr);

        return {
            total: Number(data.total ?? 0),
            presentes: Number(data.presentes ?? 0),
            ausentes: Number(data.ausentes ?? 0),
            asistenciasPorClase: mapItems(data.asistenciasPorClase),
            asistenciasPorGrupo: mapItems(data.asistenciasPorGrupo),
            asistenciasPorAlumno: mapItems(data.asistenciasPorAlumno),
            asistenciasPorMes: mapItems(data.asistenciasPorMes),
        };
    }
}

// Exportación de instancia única (singleton)
export const asistenciaService = new AsistenciaService();
export default asistenciaService;