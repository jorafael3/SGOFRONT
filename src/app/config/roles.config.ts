// Configuración de roles y permisos del sistema

export interface RoleConfig {
  id: number;
  name: string;
  displayName: string;
  permissions: string[];
  color?: string;
}

export const ROLES: RoleConfig[] = [
  {
    id: 1,
    name: 'admin',
    displayName: 'Administrador',
    color: 'danger',
    permissions: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'companies.view',
      'companies.create',
      'companies.edit',
      'companies.delete',
      'reports.view',
      'reports.export',
      'settings.view',
      'settings.edit'
    ]
  },
  {
    id: 2,
    name: 'user',
    displayName: 'Usuario',
    color: 'primary',
    permissions: [
      'dashboard.view',
      'profile.view',
      'profile.edit'
    ]
  },
  {
    id: 3,
    name: 'supervisor',
    displayName: 'Supervisor',
    color: 'warning',
    permissions: [
      'users.view',
      'users.edit',
      'reports.view',
      'dashboard.view',
      'profile.view',
      'profile.edit'
    ]
  }
];

export class RoleService {
  
  static getRoleById(id: number): RoleConfig | undefined {
    return ROLES.find(role => role.id === id);
  }

  static getRoleByName(name: string): RoleConfig | undefined {
    return ROLES.find(role => role.name === name);
  }

  static getRoleDisplayName(id: number): string {
    const role = this.getRoleById(id);
    return role?.displayName || 'Usuario';
  }

  static hasPermission(roleId: number, permission: string): boolean {
    const role = this.getRoleById(roleId);
    return role?.permissions.includes(permission) || false;
  }

  static getRoleColor(id: number): string {
    const role = this.getRoleById(id);
    return role?.color || 'secondary';
  }

  static getAllRoles(): RoleConfig[] {
    return ROLES;
  }
}
