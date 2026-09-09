import api from "../api";
import { AuthResult, LoginResponse } from "../../schemas/dtos/login/LoginDto";
import { UserData } from "../../schemas/dtos/user/UsuarioDto";

// constantes para el localStorage
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

class AuthService {

    /**
     * Inicia sesión
     */
    async login(email: string, password: string): Promise<AuthResult> {
        try {
            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email y contraseña son requeridos'
                };
            }

            if (!this.isValidEmail(email)) {
                return {
                    success: false,
                    error: 'Formato de email inválido'
                };
            }

            const response = await api.post<LoginResponse>('/auth/login', {
                email,
                password
            });

            if (response.data?.token) {
                const { token, ...userData } = response.data;
                this.setSession(token, userData);
                return {
                    success: true,
                    data: response.data
                };
            }

            return {
                success: false,
                error: 'No se recibió token de autenticación'
            };
        } catch (error: any) {
            console.error('Error en login:', error);
            let errorMessage = 'Error al iniciar sesión';
        
            if (error.response) {
                errorMessage = error.response.data?.message || 
                    error.response.data?.error ||
                    `Error ${error.response.status}: ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
            } else {
                errorMessage = error.message || 'Error desconocido';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Cerramos la sesión
     */
    async logout(): Promise<void> {
        try {
            const token = this.getToken();
            if (token) {
                await api.post('/auth/logout', null, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Error en logout del servidor: ', error);
        } finally {
            this.clearSession();
        }
    }

    /**
     * Refrescamos el token si tiene uno
     */
    async refreshToken(): Promise<string | null> {
        try {
            const response = await api.post<{ token: string }>('/auth/refresh');
            if (response.data?.token) {
                const user = this.getUserData();
                if (user) {
                    // Convertir UserData al formato que espera setSession
                    const sessionData = {
                        nombre: user.nombre,
                        email: user.email,
                        roles: user.roles,
                        type: 'Bearer', // Valor por defecto
                        expiresIn: 3600 // Valor por defecto (1 hora)
                    };
                    this.setSession(response.data.token, sessionData);
                    return response.data.token;
                }
            }
            return null;
        } catch (error) {
            console.error('Error refrescando token:', error);
            this.clearSession();
            return null;
        }
    }

    /**
     * Guardamos la sesión - VERSIÓN CORREGIDA
     * Ahora acepta un tipo más flexible
     */
    setSession(token: string, userData: { 
        nombre: string; 
        email: string; 
        roles: string[];
        type?: string;
        expiresIn?: number;
    }): void {
        // Guardamos el token
        localStorage.setItem(TOKEN_KEY, token);

        // Guardamos solo los datos necesarios del usuario
        const userToStore: UserData = {
            nombre: userData.nombre,
            email: userData.email,
            roles: userData.roles
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userToStore));

        // Calculamos y guardamos la expiración
        if (userData.expiresIn) {
            const expiryTime = Date.now() + (userData.expiresIn * 1000);
            localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        }

        // Configuramos el token con axios
        this.setAuthHeader(token);
    }

    /** Métodos privados */

    private setAuthHeader(token: string): void {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    private removeAuthHeader(): void {
        delete api.defaults.headers.common['Authorization'];
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Métodos públicos
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getUserData(): UserData | null {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;

        try {
            const userData = JSON.parse(userStr);
            if (userData.nombre && userData.email && Array.isArray(userData.roles)) {
                return userData;
            }
            return null;
        } catch {
            return null;
        }
    }

    isTokenExpired(): boolean {
        const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiryTime) {
            const token = this.getToken();
            if (!token) return true;

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const payload = JSON.parse(jsonPayload);
                return payload.exp * 1000 < Date.now();
            } catch {
                return true;
            }
        }

        return Date.now() > parseInt(expiryTime, 10);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        return !this.isTokenExpired();
    }

    getUserRoles(): string[] {
        const user = this.getUserData();
        return user?.roles || [];
    }

    hasRole(role: string): boolean {
        const roles = this.getUserRoles();
        return roles.includes(role);
    }

    hasAnyRole(roles: string[]): boolean {
        const userRoles = this.getUserRoles();
        return roles.some(role => userRoles.includes(role));
    }

    hasAllRoles(roles: string[]): boolean {
        const userRoles = this.getUserRoles();
        return roles.every(role => userRoles.includes(role));
    }

    initSession(): { user: UserData; token: string } | null {
        const token = this.getToken();
        
        if (token && this.isAuthenticated()) {
            const user = this.getUserData();
            if (user) {
                this.setAuthHeader(token);
                return { user, token };
            }
        }
        
        this.clearSession();
        return null;
    }

    getFullName(): string {
        const user = this.getUserData();
        return user?.nombre || 'Usuario';
    }

    getUserInitials(): string {
        const user = this.getUserData();
        if (!user?.nombre) return 'U';
        
        const names = user.nombre.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
    }

    clearSession(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        this.removeAuthHeader();
    }
}

// Exportar instancia única (Singleton)
export const authService = new AuthService();

export default authService;