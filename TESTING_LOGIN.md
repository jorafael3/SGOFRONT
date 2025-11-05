# Testing del Sistema de Login

## Configuración Actual

### Modo Testing Activado
El AuthService está en modo testing (`TESTING_MODE = true`) para que puedas probar el login sin necesidad de una API real.

### Credenciales de Testing
Puedes usar cualquier usuario y contraseña, el sistema simulará un login exitoso.

## Pasos para Probar

1. **Abrir la aplicación** en el navegador
2. **Ir a la página de login** (`/auth/login`)
3. **Introducir cualquier credencial**:
   - Usuario: `admin`
   - Contraseña: `123456`
4. **Hacer clic en Login**

## Qué Debería Ocurrir

1. ✅ El formulario se valida
2. ✅ Se muestra el mensaje "Login exitoso (modo testing)"
3. ✅ Se guarda el usuario en localStorage
4. ✅ Se actualiza el estado de autenticación
5. ✅ Se redirige a `/dashboard/default`

## Debugging

### En la Consola del Navegador
Deberías ver estos logs:
```
🚀 ~ LoginComponent ~ login ~ credentials: {username: "admin", password: "123456"}
Login attempt with credentials: {username: "admin", password: "123456"}
Mock response: {success: true, message: "Login exitoso (modo testing)", data: {...}}
Setting user session: {user: {...}, token: "fake-jwt-token-for-testing-..."}
User session set successfully. IsLoggedIn: true
🚀 ~ LoginComponent ~ login ~ response: {success: true, ...}
Navigating to dashboard...
IsLoggedIn before navigation: true
AdminGuard: Checking authentication...
AdminGuard: IsLoggedIn = true
AdminGuard: Current user = {id: 1, username: "admin", ...}
Navigation success: true
```

### Si Hay Problemas
1. **Abre las Developer Tools** (F12)
2. **Ve a la pestaña Console**
3. **Busca errores** en rojo
4. **Verifica localStorage** en Application > Local Storage

## Cambiar a Modo Producción

Cuando tengas tu API lista:

1. **Abrir** `src/app/services/auth/auth.service.ts`
2. **Cambiar** `TESTING_MODE = false`
3. **Verificar** que la URL de la API en `environment.ts` sea correcta
4. **Adaptar** las interfaces si es necesario según tu API

## Estructura de Respuesta Esperada de la API

```json
{
  "success": true,
  "message": "Login exitoso",
  "user_data": {
    "id_usuario": 1,
    "id_empresa": 1,
    "id_rol": 2,
    "usuario": "JORGE",
    "nombre": "María López",
    "apellido": "López",
    "telefono": "0999999999",
    "email": "jalvaradoe3@empresa.com",
    "estado": "A",
    "creado_por": "admin",
    "fecha_creacion": "2025-08-19 13:43:25",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

## URLs de API Configuradas

- **Desarrollo**: `http://127.0.0.1/plantillaMVC`
- **Endpoint de Login**: `/login/authenticate`
- **Endpoint Completo**: `http://127.0.0.1/plantillaMVC/login/authenticate`

## Modo Producción Activado

El AuthService está configurado para usar tu API real (`TESTING_MODE = false`).

## Mapeo de Datos

El sistema mapea automáticamente los datos de tu API a la estructura interna:

- `user_data.id_usuario` → `user.id`
- `user_data.usuario` → `user.username`
- `user_data.email` → `user.email`
- `user_data.nombre + apellido` → `user.name`
- `user_data.id_rol` → `user.role` (convertido a nombre legible)
- `user_data.token` → almacenado en localStorage como 'authToken'

## Roles Configurados

- **ID 1**: Administrador
- **ID 2**: Usuario  
- **ID 3**: Supervisor
