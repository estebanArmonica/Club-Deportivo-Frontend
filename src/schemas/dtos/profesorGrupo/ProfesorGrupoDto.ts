// ============================================
// Entidad principal (tabla de asociación)
// ============================================
export interface ProfesorGrupo {
    id: number;
    activo: boolean;
    id_usuario: number;   // profesor
    id_grupo: number;
}

// ============================================
// DTOs de escritura
// ============================================
export interface ProfesorGrupoCreateDto {
    id_usuario: number;
    id_grupo: number;
    activo?: boolean;
}

export type ProfesorGrupoUpdateDto = Partial<ProfesorGrupoCreateDto>;

// ============================================
// Validación de asignación duplicada
// ============================================
export interface ProfesorGrupoAsignacionParams {
    usuarioId: number;
    grupoId: number;
}

// ============================================
// Estadísticas
// ============================================
export interface ProfesorGrupoEstadisticaItem {
    label: string;
    total: number;
}

export interface EstadisticasProfesorGrupoDTO {
    total: number;
    activos: number;
    inactivos: number;
    asignacionesPorGrupo: ProfesorGrupoEstadisticaItem[];
    asignacionesPorProfesor: ProfesorGrupoEstadisticaItem[];
    asignacionesPorCategoria: ProfesorGrupoEstadisticaItem[];
    asignacionesPorSucursal: ProfesorGrupoEstadisticaItem[];
    asignacionesPorClub: ProfesorGrupoEstadisticaItem[];
    // ajusta a los campos reales del EstadisticasProfesorGrupoDTO del back
}