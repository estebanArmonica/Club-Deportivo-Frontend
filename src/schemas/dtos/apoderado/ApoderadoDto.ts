// ============================================
// Paginación (reutiliza Page<T> genérico)
// ============================================
import type { Page } from '../../common/Page';

// ============================================
// Entidad principal
// ============================================
export interface Apoderado {
    id: number;
    nombre: string;
    contacto: string;        // email o teléfono, único
    parentesco: string;      // "PADRE", "MADRE", "TUTOR", etc.
    activo?: boolean;
    alumnos?: { id: number; nombre?: string; rut?: string }[];
    // agrega aquí los demás campos reales de tu entidad Apoderado
}

// ============================================
// DTOs de escritura
// ============================================
export interface ApoderadoCreateDto {
    nombre: string;
    contacto: string;
    parentesco: string;
    activo?: boolean;
}

export type ApoderadoUpdateDto = Partial<ApoderadoCreateDto>;


export interface ApoderadoPaginacionParams {
    page?: number;
    size?: number;
    sort?: string;          // ej: "parentesco,asc" o "nombre,desc"
}

// ============================================
// Estadísticas (devuelven Object[] del back)
// ============================================
export interface ApoderadoParentescoCount {
    parentesco: string;
    total: number;
}

export interface ApoderadoTopAlumnos {
    apoderado: string;
    totalAlumnos: number;
}

// ============================================
// Filtros
// ============================================
export interface ApoderadoContactoParams {
    contacto: string;
}