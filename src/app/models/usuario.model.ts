export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
  estado: string;
  fecha_creacion: string;
  ultimo_acceso: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  role: string;
  estado?: string;
}

export interface UpdateUsuarioRequest {
  id: number;
  nombre?: string;
  email?: string;
  role?: string;
  estado?: string;
}

export interface UsuarioListResponse {
  usuarios: Usuario[];
  total: number;
  page: number;
  limit: number;
}

export interface UsuarioResponse {
  usuario: Usuario;
}
