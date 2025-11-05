export interface LoginRequest {
  username: string;
  password: string;
  empresa_code: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user_data?: {
    id_usuario: number;
    id_empresa: number;
    id_rol: number;
    usuario: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    estado: string;
    creado_por: string;
    fecha_creacion: string;
    token: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role?: string;
  permissions?: string[];
  // Campos adicionales de tu API
  id_empresa?: number;
  id_empleado?: number;
  id_rol?: number;
  telefono?: string;
  apellido?: string;
  estado?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}
