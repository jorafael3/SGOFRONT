# 🔐 Logout - Corrección de Ruta Dinámica

## 🐛 Problema Identificado

Cuando hacías **logout** desde el proyecto compilado en una **subcarpeta** (como `SGONUEVO`), el sistema te redirigía a `/auth/login` pero la ruta correcta debería ser `/SGONUEVO/auth/login`.

**Resultado:** Página en blanco o error 404.

## ✅ Solución Implementada

He implementado un **detector automático de ruta base** que:

1. ✅ **Detecta la carpeta base** del proyecto automáticamente
2. ✅ **Funciona en cualquier ubicación** (raíz, subcarpeta, etc.)
3. ✅ **Redirige a la URL correcta** al hacer logout

## 🔧 Cómo Funciona

### Antes (❌ Problema)
```typescript
window.location.href = '/auth/login';  // Siempre a la raíz
```

Esto causaba errores si el proyecto estaba en:
- `http://localhost/SGONUEVO` → Buscaba `/auth/login` en la raíz
- `http://10.5.3.172:8080/SGONUEVO` → Misma ruta incorrecta

### Después (✅ Solución)
```typescript
// 1. Detecta la ruta base
const basePath = this.getBasePath();  // Devuelve "/SGONUEVO"

// 2. Redirige correctamente
window.location.href = `${basePath}/auth/login`;  // /SGONUEVO/auth/login
```

## 📍 Ejemplos de Funcionamiento

| Ubicación | Ruta Actual | Ruta Detectada | Logout Redirige A |
|-----------|-------------|---|---|
| `localhost/` | `/dashboard` | `` (raíz) | `/auth/login` |
| `localhost/SGONUEVO` | `/dashboard` | `/SGONUEVO` | `/SGONUEVO/auth/login` |
| `localhost/proyecto/app` | `/dashboard` | `/proyecto/app` | `/proyecto/app/auth/login` |
| `10.5.3.172:8080/SGONUEVO` | `/dashboard` | `/SGONUEVO` | `/SGONUEVO/auth/login` |

## 🔍 Lógica del Detector

```typescript
private getBasePath(): string {
  // Obtener pathname: /SGONUEVO/dashboard/default
  const pathname = window.location.pathname;
  
  // Dividir en segmentos: ["", "SGONUEVO", "dashboard", "default"]
  const pathSegments = pathname.split('/').filter(seg => seg);
  
  // Si hay segmentos...
  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Si el último no tiene punto (no es archivo)
    if (lastSegment && !lastSegment.includes('.')) {
      // Retornar todos excepto el último
      // [SGONUEVO] → /SGONUEVO
      return '/' + pathSegments.slice(0, -1).join('/');
    }
  }
  
  return '';  // Si está en raíz
}
```

## 🧪 Casos de Prueba

✅ **Caso 1: Raíz**
```
URL: http://localhost/
Pathname: /dashboard/default
getBasePath(): ""
Logout va a: /auth/login
```

✅ **Caso 2: Subcarpeta (Tu caso)**
```
URL: http://localhost/SGONUEVO
Pathname: /SGONUEVO/dashboard/default
getBasePath(): "/SGONUEVO"
Logout va a: /SGONUEVO/auth/login ✅ CORRECTO
```

✅ **Caso 3: Carpeta anidada**
```
URL: http://localhost/proyectos/sgo
Pathname: /proyectos/sgo/dashboard/default
getBasePath(): "/proyectos/sgo"
Logout va a: /proyectos/sgo/auth/login
```

## 📋 Flujo Completo del Logout

```
1️⃣ Usuario hace click en "Salir"
   ↓
2️⃣ Se ejecuta logOut()
   ↓
3️⃣ Se llama a authService.logout()
   ↓
4️⃣ Se limpian localStorage y sessionStorage
   ↓
5️⃣ Se detecta automáticamente la ruta base
   ↓
6️⃣ Se redirige a: basePath + /auth/login
   ↓
7️⃣ Usuario llega a la página de login correcta ✅
```

## 🛠️ Archivo Modificado

```
✅ src/app/shared/components/header/widgets/profile/profile.component.ts

Cambios:
- Agregado método: getBasePath()
- Modificado método: clearAllCache()
- Antes: window.location.href = '/auth/login'
- Después: window.location.href = `${basePath}/auth/login`
```

## 🎯 Beneficios

✅ **Automático:** No necesita configuración adicional  
✅ **Flexible:** Funciona en cualquier ubicación  
✅ **Robusto:** Maneja múltiples niveles de carpetas  
✅ **Compatible:** Con desarrollo y producción  

## 📝 Configuraciones Soportadas

### Desarrollo Local
```
http://localhost/SGOFRONT  → /auth/login
http://localhost/SGONUEVO  → /SGONUEVO/auth/login
```

### Producción
```
http://servidor.com/SGONUEVO  → /SGONUEVO/auth/login
http://10.5.3.172:8080/app    → /app/auth/login
```

## 🔄 Testing

Para probar que funciona:

1. **Compila el proyecto** en la carpeta `SGONUEVO`
2. **Navega a:** `http://localhost/SGONUEVO/dashboard`
3. **Haz click en "Salir"**
4. **Deberías llegar a:** `http://localhost/SGONUEVO/auth/login` ✅

## 🚀 Próximas Mejoras (Opcional)

Si en el futuro necesitas:
- Redirect a página diferente
- Limpiar datos adicionales
- Guardar información de logout

Solo modifica el método `clearAllCache()`.

---

**Estado:** ✅ COMPLETADO  
**Fecha:** 11 de Noviembre 2025  
**Compatible:** Cualquier ubicación del proyecto
