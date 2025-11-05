export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}
