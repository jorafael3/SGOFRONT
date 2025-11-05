# Sistema de Logout y Perfil de Usuario

## Implementación del Logout

### ✅ ProfileComponent Actualizado

El componente de perfil ahora:

- **Usa AuthService** para logout seguro
- **Muestra información real** del usuario logueado
- **Maneja errores** de logout gracefully
- **Limpia la sesión** tanto local como en servidor

### Métodos Disponibles

```typescript
// Logout completo
logOut() // Limpia sesión y redirige

// Información del usuario
getCurrentUserName() // Nombre completo del usuario
getUserInitials() // Iniciales para avatar
getUserRole() // Rol del usuario
```

### Flujo de Logout

1. **Se ejecuta `logOut()`** en ProfileComponent
2. **AuthService.logout()** se llama
3. **Se limpia la sesión local** inmediatamente
4. **Se intenta notificar al servidor** (opcional)
5. **Se redirige** a `/auth/login`
6. **AdminGuard bloquea** acceso a rutas protegidas

## UserProfileService

### Propósito
Servicio centralizado para manejar información del usuario logueado.

### Métodos Principales

```typescript
getCurrentProfile(): User | null
getDisplayName(): string
getRoleDisplayName(): string
hasRole(roleId: number): boolean
isAdmin(): boolean
getCompanyId(): number | null
getAvatarOrInitials(): string
```

### Uso en Componentes

```typescript
constructor(public userProfileService: UserProfileService) {}

// En el template
{{ userProfileService.getDisplayName() }}
{{ userProfileService.getRoleDisplayName() }}
```

## Directivas de Permisos

### HasRoleDirective
Mostrar contenido solo a usuarios con rol específico:

```html
<div *appHasRole="1">
  Solo administradores ven esto
</div>
```

### HasPermissionDirective
Mostrar contenido basado en permisos:

```html
<button *appHasPermission="'users.create'">
  Crear Usuario
</button>
```

## Configuración de Roles

### Archivo: `src/app/config/roles.config.ts`

```typescript
export const ROLES: RoleConfig[] = [
  {
    id: 1,
    name: 'admin',
    displayName: 'Administrador',
    permissions: ['users.view', 'users.create', ...]
  }
  // ...más roles
];
```

### RoleService

Métodos estáticos para trabajar con roles:

```typescript
RoleService.getRoleById(1)
RoleService.getRoleDisplayName(2)
RoleService.hasPermission(1, 'users.create')
```

## UI del Profile Component

### Template Actualizado
- ✅ Muestra nombre real del usuario
- ✅ Muestra rol real del usuario  
- ✅ Avatar con iniciales como fallback
- ✅ Logout funcional

### Estilos CSS
- ✅ Avatar responsivo
- ✅ Iniciales con gradiente
- ✅ Hover effects en menú
- ✅ Tipografía mejorada

## Endpoints de API

### Login
```
POST /login/authenticate
```

### Logout  
```
POST /login/logout
Body: { user_id: number }
```

## Datos del Usuario en localStorage

```javascript
// Usuario actual
localStorage.getItem('user')
// Token de acceso
localStorage.getItem('authToken')
```

## Estructura del Usuario

```typescript
interface User {
  id: number;           // id_usuario de la API
  username: string;     // usuario de la API  
  email: string;        // email de la API
  name: string;         // nombre + apellido
  role?: string;        // nombre del rol convertido
  id_empresa?: number;  // id_empresa de la API
  id_rol?: number;      // id_rol de la API
  telefono?: string;    // telefono de la API
  apellido?: string;    // apellido de la API
  estado?: string;      // estado de la API
}
```

## Ejemplo de Uso Completo

```typescript
// En cualquier componente
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    public userProfile: UserProfileService
  ) {}

  get currentUser() {
    return this.userProfile.getCurrentProfile();
  }

  get isAdmin() {
    return this.userProfile.isAdmin();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
```

```html
<!-- En el template -->
<div class="welcome-message">
  Bienvenido, {{ userProfile.getDisplayName() }}
</div>

<div class="user-info">
  <span class="role">{{ userProfile.getRoleDisplayName() }}</span>
</div>

<!-- Contenido condicional -->
<div *appHasRole="1">
  Panel de administración
</div>

<button *appHasPermission="'users.create'" (click)="createUser()">
  Crear Usuario
</button>
```

## Testing

Para probar el logout:

1. **Hacer login** en la aplicación
2. **Hacer clic** en el perfil del header
3. **Hacer clic** en "Log out"
4. **Verificar** que redirige a login
5. **Intentar acceder** a una ruta protegida
6. **Verificar** que el guard bloquea el acceso
