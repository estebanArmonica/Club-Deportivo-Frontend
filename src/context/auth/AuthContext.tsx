import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../../services/auth/auth.service';
import { UserData } from '../../schemas/dtos/user/UsuarioDto';
import { AuthResult } from '../../schemas/dtos/login/LoginDto';

// Definir el tipo del contexto
interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  getUserRoles: () => string[];
  getFullName: () => string;
  getUserInitials: () => string;
  refreshToken: () => Promise<string | null>;
  clearError: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar sesión al cargar la aplicación
  useEffect(() => {
    const initAuth = () => {
      try {
        const session = authService.initSession();
        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (err) {
        console.error('Error inicializando sesión:', err);
        authService.clearSession();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Función de login
  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.data) {
        const userData: UserData = {
          nombre: result.data.nombre,
          email: result.data.email,
          roles: result.data.roles,
        };
        setUser(userData);
        setToken(result.data.token);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al iniciar sesión');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      setLoading(false);
    }
  };

  // Función para refrescar token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        setToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error('Error refrescando token:', error);
      return null;
    }
  };

  // Funciones de verificación de roles
  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return authService.hasAllRoles(roles);
  };

  const getUserRoles = (): string[] => {
    return authService.getUserRoles();
  };

  const getFullName = (): string => {
    return authService.getFullName();
  };

  const getUserInitials = (): string => {
    return authService.getUserInitials();
  };

  const clearError = (): void => {
    setError(null);
  };

  // Valor del contexto
  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getUserRoles,
    getFullName,
    getUserInitials,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;