export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    nombre: string;
    email: string;
    roles: string[];
    expiresIn: number;
}

export interface AuthResult {
    success: boolean;
    data?: LoginResponse;
    error?: string
}