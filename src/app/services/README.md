# Estructura de Servicios API

Esta documentación explica cómo está organizada la arquitectura de servicios para las llamadas a la API en el proyecto CRM Admin Front.

## Estructura de Carpetas

```
src/app/
├── services/
│   ├── base-api.service.ts          # Servicio base con métodos HTTP comunes
│   ├── auth/
│   │   └── auth.service.ts          # Servicio de autenticación
│   ├── users/
│   │   └── user.service.ts          # Servicio de gestión de usuarios
│   ├── products/
│   │   └── product.service.ts       # Servicio de gestión de productos
│   ├── customers/
│   │   └── customer.service.ts      # Servicio de gestión de clientes
│   └── orders/
│       └── order.service.ts         # Servicio de gestión de pedidos
├── models/
│   ├── auth.model.ts                # Interfaces de autenticación
│   ├── user.model.ts                # Interfaces de usuario
│   ├── product.model.ts             # Interfaces de producto
│   └── ...
├── guards/
│   └── auth.guard.ts                # Guard de autenticación
├── interceptors/
│   └── auth.interceptor.ts          # Interceptor para tokens
└── environments/
    ├── environment.ts               # Configuración de desarrollo
    └── environment.prod.ts          # Configuración de producción
```

## Servicios Implementados

### 1. BaseApiService
- **Propósito**: Clase base que contiene métodos HTTP comunes (GET, POST, PUT, DELETE)
- **Características**:
  - Manejo automático de headers de autorización
  - Manejo centralizado de errores
  - Configuración base de la URL de la API

### 2. AuthService
- **Propósito**: Manejo de autenticación de usuarios
- **Métodos principales**:
  - `login(credentials)`: Iniciar sesión
  - `logout()`: Cerrar sesión
  - `refreshToken()`: Renovar token de acceso
  - `forgotPassword(email)`: Recuperar contraseña
  - `getCurrentUser()`: Obtener usuario actual

### 3. UserService
- **Propósito**: Gestión de usuarios del sistema
- **Métodos principales**:
  - `getUsers()`: Listar usuarios con paginación
  - `getUserById(id)`: Obtener usuario por ID
  - `createUser(userData)`: Crear nuevo usuario
  - `updateUser(id, userData)`: Actualizar usuario
  - `deleteUser(id)`: Eliminar usuario

### 4. ProductService
- **Propósito**: Gestión de productos
- **Métodos principales**:
  - `getProducts()`: Listar productos con filtros
  - `getProductById(id)`: Obtener producto por ID
  - `createProduct(productData)`: Crear nuevo producto
  - `updateProduct(id, productData)`: Actualizar producto
  - `uploadProductImages(id, files)`: Subir imágenes de producto

## Configuración

### Environment
Configura la URL base de tu API en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Cambia por tu URL de API
};
```

### App Config
El interceptor de autenticación está configurado en `app.config.ts` para manejar automáticamente los tokens de todas las peticiones HTTP.

## Uso en Componentes

### Ejemplo de Login
```typescript
import { AuthService } from '../../services/auth/auth.service';

export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // Mostrar error
        console.error('Error en login:', error);
      }
    });
  }
}
```

### Ejemplo de Gestión de Productos
```typescript
import { ProductService } from '../../services/products/product.service';

export class ProductListComponent {
  constructor(private productService: ProductService) {}

  loadProducts() {
    this.productService.getProducts(1, 10, 'search_term').subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data.products;
        }
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }
}
```

## Extensión para Nuevos Módulos

Para agregar un nuevo módulo (ej: Ventas), sigue estos pasos:

1. **Crear carpeta del servicio**:
   ```
   src/app/services/sales/
   ```

2. **Crear modelo de datos**:
   ```typescript
   // src/app/models/sale.model.ts
   export interface Sale {
     id: number;
     customerId: number;
     total: number;
     // ... más propiedades
   }
   ```

3. **Crear servicio**:
   ```typescript
   // src/app/services/sales/sale.service.ts
   @Injectable({
     providedIn: 'root'
   })
   export class SaleService extends BaseApiService {
     private readonly endpoint = '/sales';
     
     getSales(): Observable<ApiResponse<Sale[]>> {
       return this.get<ApiResponse<Sale[]>>(this.endpoint);
     }
     // ... más métodos
   }
   ```

## Mejores Prácticas

1. **Usar TypeScript**: Siempre define interfaces para las peticiones y respuestas
2. **Manejo de errores**: Usa el manejo centralizado de errores del BaseApiService
3. **Paginación**: Implementa paginación en listados largos
4. **Loading states**: Maneja estados de carga en los componentes
5. **Cacheo**: Considera implementar cacheo para datos que no cambian frecuentemente

## Seguridad

- Los tokens de autenticación se manejan automáticamente por el interceptor
- Los tokens se almacenan en localStorage (considera usar httpOnly cookies para mayor seguridad)
- El guard de autenticación protege rutas que requieren login
- El interceptor maneja automáticamente la renovación de tokens expirados
