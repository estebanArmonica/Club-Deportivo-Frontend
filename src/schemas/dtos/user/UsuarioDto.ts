export interface UserData {
    nombre: string;
    email: string;
    roles: string[];
}

// ============================================
// Entidad principal
// ============================================
export interface Usuario {
    id: number;
    nombre: string;
    apellido?: string;
    email: string;
    isActive: boolean;
    createdAt: string;   // ISO datetime "YYYY-MM-DDTHH:mm:ss"
}

// ============================================
// DTOs de escritura
// ============================================
export interface UsuarioCreateDto {
    nombre: string;
    apellido?: string;
    email: string;
    password: string;      // solo en creación
    activo?: boolean;
    createdAt?: string;    // opcional, el back lo asigna si no viene
}

export interface UsuarioUpdateDto {
    nombre?: string;
    apellido?: string;
    email?: string;
    activo?: boolean;
    // NO password aquí: se cambia con changePassword
}

// ============================================
// Paginación (espejo de Page<T> de Spring)
// ============================================
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;        // página actual (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    numberOfElements: number;
    pageable?: {
        pageNumber: number;
        pageSize: number;
        sort: { property: string; direction: 'ASC' | 'DESC' }[];
    };
    sort?: { property: string; direction: 'ASC' | 'DESC' }[];
}

// ============================================
// Parámetros de paginación
// ============================================
export interface UsuarioPaginacionParams {
    page?: number;
    size?: number;
    sort?: string;         // ej: "id,asc" o "createdAt,desc"
}