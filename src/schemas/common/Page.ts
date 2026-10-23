// src/schemas/common/Page.ts

/**
 * Espejo del Page<T> de Spring Data.
 * Refleja exactamente el JSON que devuelve el backend.
*/
export interface PageableSort {
    property: string;
    direction: 'ASC' | 'DESC';
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: PageableSort | PageableSort[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    number: number;          // página actual (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    numberOfElements: number;
    sort: PageableSort | PageableSort[];
}