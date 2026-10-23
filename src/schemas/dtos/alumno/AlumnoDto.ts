// ============================================
// Paginación
// ============================================
import type { Page } from '../../common/Page';

// ============================================
// Entidad principal
// ============================================
export interface Alumno {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    fechaNacimiento?: string;      // ISO date "YYYY-MM-DD"
    fechInscripcion: string;       // ISO date "YYYY-MM-DD"
    activo: boolean;
    apoderados?: { id: number; nombre?: string; contacto?: string }[];
    // agrega aquí los demás campos reales (direccion, telefono, etc.)
}

// ============================================
// DTOs de escritura
// ============================================
export interface AlumnoCreateDto {
    nombre: string;
    apellido: string;
    rut: string;
    fechaNacimiento?: string;
    fechInscripcion: string;
    activo?: boolean;
}

export type AlumnoUpdateDto = Partial<AlumnoCreateDto>;

export interface AlumnoPaginacionParams {
    page?: number;
    size?: number;
    sort?: string;          // default: "nombre"
}

// ============================================
// Filtros
// ============================================
export interface AlumnoFiltrosFecha {
    inicio: string;
    fin: string;
}

export interface AlumnoFiltrosEdad {
    edadMin: number;
    edadMax: number;
}

export interface AlumnoBusquedaParams {
    nombre?: string;
    apellido?: string;
}

export interface AlumnoInscripcionParams {
    alumnoId: number;
    grupoId: number;
}

// ============================================
// Estadísticas (devuelven Object[] del back)
// ============================================
export interface AlumnoTopAsistencias {
    alumno: string;
    totalAsistencias: number;
}