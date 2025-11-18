# 🎯 Módulo de Gestión de Menús - Quick Start

## ¿Qué se ha implementado?

Se ha creado un módulo completo para **gestionar menús dinámicamente** en el sistema:

✅ **Crear menús** (Principales, Submenús, Enlaces)  
✅ **Editar menús** existentes  
✅ **Eliminar menús**  
✅ **Visualizar menús** en tabla con paginación  
✅ **Filtrar por empresa**  
✅ **Configurar ícono, orden, badges**

## 📂 Archivos Creados/Modificados

```
✅ src/app/services/mantenimiento/menus.service.ts (NUEVO)
✅ src/app/components/mantenimiento/menus/menus.component.ts (REESCRITO)
✅ src/app/components/mantenimiento/menus/menus.component.html (REESCRITO)
✅ src/app/components/mantenimiento/menus/menus.component.scss (ACTUALIZADO)
✅ MENUS_MANAGEMENT_GUIDE.md (Documentación completa)
✅ MENUS_IMPLEMENTATION_SUMMARY.md (Resumen técnico)
```

## 🚀 Acceso Rápido

**URL del módulo:** `/mantenimiento/menus`

**Ruta ya registrada en:** `src/app/components/mantenimiento/mantenimiento.routes.ts`

## 💻 Uso Básico

### 1️⃣ Crear un Menú
```
1. Click en botón [+] "Crear nuevo menú"
2. Seleccionar tipo: Menú Principal, Submenú o Enlace
3. Si es Submenú o Enlace: seleccionar Padre
4. Completar: Título, Ícono, Orden, Estado
5. Click "Guardar"
```

### 2️⃣ Editar un Menú
```
1. Click en ícono [✏️] de la fila
2. Modificar campos necesarios
3. Click "Actualizar"
```

### 3️⃣ Eliminar un Menú
```
1. Click en ícono [🗑️] de la fila
2. Confirmar eliminación
```

### 4️⃣ Cambiar Empresa
```
1. Seleccionar CARTIMEX o COMPUTRONSA (radio buttons)
2. Tabla se recarga automáticamente
```

## 🏗️ Estructura de Datos

Campos de un Menú:
- **MenuId**: ID único
- **Empresa**: CARTIMEX o COMPUTRONSA
- **Titulo**: Nombre del menú (ej: "Logística")
- **Type**: main_title, sub, link
- **Path**: URL del menú (solo para links, ej: "/logistica/tracking")
- **Icono**: Clase Font Awesome (ej: "fa-user", "fa-cog")
- **Orden**: Número para ordenar (1, 2, 3...)
- **PadreId**: ID del menú padre (NULL para principales)
- **Activo**: 1 (activo) o 0 (inactivo)
- **Badge**: 0/1 (mostrar notificación)
- **BadgeValue**: Número a mostrar (ej: "5")
- **BadgeColor**: Color (primary, danger, success, warning, info)

## 📝 Ejemplo de Menú Completo

```json
{
  "MenuId": 3,
  "Empresa": "CARTIMEX",
  "Titulo": "Opciones",
  "Type": "link",
  "Path": "/logistica/opciones",
  "Icono": "fa-cog",
  "Orden": 1,
  "PadreId": 2,
  "Activo": 1,
  "Badge": 0,
  "BadgeValue": null,
  "BadgeColor": null,
  "FechaCreado": "2025-11-07 10:55:37",
  "CreadoPor": "admin"
}
```

## 🔌 Backend - Endpoints Requeridos

| Método | Endpoint | Función |
|--------|----------|---------|
| POST | `/mantenimiento/menus/GetMenus` | Obtener lista de menús |
| POST | `/mantenimiento/menus/CrearMenu` | Crear nuevo menú |
| POST | `/mantenimiento/menus/ActualizarMenu` | Actualizar menú |
| DELETE | `/mantenimiento/menus/DeleteMenu/{id}` | Eliminar menú |
| GET | `/mantenimiento/menus/GetAvailableParentMenus` | Menús disponibles como padres |

### Ejemplo: GetMenus Request/Response

**Request:**
```json
POST /mantenimiento/menus/GetMenus
{
  "empresa": "CARTIMEX"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "MenuId": 1,
      "Empresa": "CARTIMEX",
      "Titulo": "General",
      "Type": "main_title",
      "Path": null,
      "Icono": null,
      "Orden": 1,
      "PadreId": null,
      "Activo": 1,
      "Badge": 0,
      "BadgeValue": null,
      "BadgeColor": null
    }
  ]
}
```

## 🎨 Formulario Modal

El modal tiene los siguientes campos:

```
┌─────────────────────────────────────────────┐
│ ✏️ Editar Menú                         [×]   │
├─────────────────────────────────────────────┤
│ Tipo de Menú *                              │
│ ├─ Menú Principal                           │
│ ├─ Submenú                                  │
│ └─ Enlace                                   │
│                                             │
│ Menú Padre * (si no es principal)           │
│ ├─ -- Seleccionar --                        │
│ └─ [Lista dinámica de padres]               │
│                                             │
│ Título *                                    │
│ └─ [Nombre del menú]                        │
│                                             │
│ Ruta (Path) (solo para enlaces)             │
│ └─ [/ruta/del/menu]                         │
│                                             │
│ Ícono                                       │
│ └─ [fa-user] [👤]                           │
│                                             │
│ Orden *                                     │
│ └─ [1]                                      │
│                                             │
│ Mostrar Badge │ Valor │ Color Badge         │
│ [Sí ▼]        │ [3]   │ [danger ▼]          │
│                                             │
│ Estado * [Activo ▼]                         │
│                                             │
├─────────────────────────────────────────────┤
│ [Cancelar]                     [💾 Guardar] │
└─────────────────────────────────────────────┘
```

## 📊 Tabla de Menús

```
┌────┬──────────────┬────────────┬─────────────────┬────────┬───────┬────────┬────────┐
│ ID │ Título       │ Tipo       │ Path            │ Ícono  │ Orden │ Padre  │ Activo │
├────┼──────────────┼────────────┼─────────────────┼────────┼───────┼────────┼────────┤
│ 1  │ General      │ main_title │ -               │ -      │ 1     │ -      │ ✓      │
│ 2  │ Logística    │ sub        │ -               │ user   │ 1     │ -      │ ✓      │
│ 3  │ Opciones     │ link       │ /logistica/opt  │ -      │ 1     │ 2      │ ✓      │
│ 4  │ Trackings    │ link       │ /logistica/trk  │ -      │ 2     │ 2      │ ✓      │
│ 5  │ Preparar Fact│ sub        │ -               │ -      │ 3     │ 2      │ ✓      │
└────┴──────────────┴────────────┴─────────────────┴────────┴───────┴────────┴────────┘
                                    [✏️] [🗑️]
```

## 🔍 Validaciones

El formulario valida automáticamente:
- ✅ **Título**: No puede estar vacío
- ✅ **Tipo**: Debe seleccionar uno
- ✅ **Menú Padre**: Obligatorio si no es principal
- ✅ **Orden**: Debe ser un número
- ✅ **Estado**: Debe seleccionar uno

## 🆚 Diferencia entre Tipos

| Tipo | Uso | Tiene Padre? | Tiene Path? | Ícono |
|------|-----|-------|---------|-------|
| **main_title** | Menú principal en sidebar | ❌ | ❌ | ❌ (puede tener) |
| **sub** | Submenú agrupador | ✅ | ❌ | ✅ |
| **link** | Enlace a ruta | ✅ | ✅ | ❌ |

## 📋 Ejemplos

### Ejemplo 1: Menú Principal
```
Tipo: Menú Principal
Título: Logística
Ícono: fa-truck
Orden: 1
Padre: (vacío)
```

### Ejemplo 2: Submenú
```
Tipo: Submenú
Título: Picking
Icono: fa-cubes
Orden: 3
Padre: Logística (ID: 2)
```

### Ejemplo 3: Enlace
```
Tipo: Enlace
Título: Verificar Facturas
Path: /logistica/picking/verificarfacturas
Ícono: (vacío)
Orden: 1
Padre: Verificación y Series (ID: 7)
```

## 🎯 Casos de Uso Comunes

### Agregar nuevo módulo al sistema
1. Crear menú principal (Type: main_title)
2. Crear submenú para agrupar opciones (Type: sub)
3. Crear enlaces a las páginas (Type: link)

### Reorganizar menús
1. Editar el menú
2. Cambiar el número de Orden
3. Guardar

### Desactivar menú temporalmente
1. Editar el menú
2. Cambiar Estado a "Inactivo"
3. Guardar (El menú no aparecerá en el sidebar)

### Mostrar notificaciones
1. Editar el menú
2. Activar "Mostrar Badge"
3. Ingresar número en "Valor"
4. Seleccionar color
5. Guardar (Muestra pequeño badge rojo/azul/etc)

## 🆘 Troubleshooting

**P: El módulo no carga**  
R: Verificar que el endpoint `/GetMenus` esté implementado en el backend

**P: No veo menús en la tabla**  
R: Revisar que existan menús en la base de datos para la empresa seleccionada

**P: El selector de padre está vacío**  
R: Crear menús principales primero, luego crear submenús

**P: No puedo guardar cambios**  
R: Verificar que todos los campos requeridos (*) estén completos

**P: El ícono no aparece**  
R: Usar clases válidas de Font Awesome (ej: fa-user, fa-cog, fa-building)

## 📚 Documentación Completa

Para detalles técnicos y casos más avanzados, ver:
- **`MENUS_MANAGEMENT_GUIDE.md`** - Guía completa
- **`MENUS_IMPLEMENTATION_SUMMARY.md`** - Resumen técnico

## ✨ Características Adicionales

- 🔄 Auto-actualización al cambiar empresa
- 💾 Guardado automático de sesión
- ⚡ Validación en tiempo real
- 🎨 Interfaz responsive
- 📱 Compatible con mobile
- 🔔 Notificaciones SweetAlert2
- 📊 Paginación y búsqueda en tabla

---

**Estado:** ✅ Listo para usar  
**Versión:** 1.0  
**Última actualización:** 10 Noviembre 2025
