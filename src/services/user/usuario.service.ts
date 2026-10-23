import api from "../api";
import {
    Usuario,
    UsuarioCreateDto,
    UsuarioUpdateDto,
    Page,
    UsuarioPaginacionParams,
} from "../../schemas/dtos/user/UsuarioDto";

class UsuarioService {
    private readonly BASE_URL = '/usuarios';

    /**
     * =============================================
     * Lecturas (GET)
     * =============================================
    */

    /** Usuario por ID */
    async getById(id: number): Promise<Usuario> {
        const { data } = await api.get<Usuario>(`${this.BASE_URL}/list-user/${id}`);
        return data;
    }

    /** Usuario por email */
    async getByEmail(email: string): Promise<Usuario> {
        const { data } = await api.get<Usuario>(`${this.BASE_URL}/email/${email}`);
        return data;
    }

    /** Lista paginada de usuarios */
    async getAll(params?: UsuarioPaginacionParams): Promise<Page<Usuario>> {
        const { data } = await api.get<Page<Usuario>>(`${this.BASE_URL}/list-all`, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sort: params?.sort ?? 'id',
            },
        });
        return data;
    }

    /**
     * =====================================================
     * Escrituras (POST, PUT, PATCH, DELETE)
     * =====================================================
    */

    /** Crear usuario */
    async create(usuario: UsuarioCreateDto): Promise<Usuario> {
        const { data } = await api.post<Usuario>(
            `${this.BASE_URL}/create-user`,
            usuario
        );
        return data;
    }

    /** Actualizar usuario */
    async update(id: number, usuario: UsuarioUpdateDto): Promise<Usuario> {
        const { data } = await api.put<Usuario>(
            `${this.BASE_URL}/update-user/${id}`,
            usuario
        );
        return data;
    }

    /** Eliminar usuario */
    async delete(id: number): Promise<void> {
        await api.delete(`${this.BASE_URL}/delete-user/${id}`);
    }

    /**
     * ====================================================
     * Acciones (PATCH)
     * ====================================================
    */

    /**
     * Cambiar contraseña.
     * ⚠️ El back lo recibe como @RequestParam, no como body.
     * Por eso va en `params` y el body es null.
     */
    async changePassword(id: number, newPassword: string): Promise<void> {
        await api.patch(`${this.BASE_URL}/${id}/cambiar-password`, null, {
            params: { newPassword },
        });
    }

    /** Activar usuario */
    async activate(id: number): Promise<void> {
        await api.patch(`${this.BASE_URL}/${id}/activar`);
    }

    /** Desactivar usuario */
    async deactivate(id: number): Promise<void> {
        await api.patch(`${this.BASE_URL}/${id}/desactivar`);
    }

    /**
     * ====================================================
     * Validaciones
     * ====================================================
    */

    /** ¿Existe un usuario con ese email? */
    async existsByEmail(email: string): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/email`, {
            params: { email },
        });
        return data;
    }

    /** ¿Existe un usuario con ese ID? */
    async existsById(id: number): Promise<boolean> {
        const { data } = await api.get<boolean>(`${this.BASE_URL}/validar/${id}`);
        return data;
    }
}

export const usuarioService = new UsuarioService();
export default usuarioService;