# Módulo de Gestión de Menús

## Descripción General
Se ha implementado un módulo completo para la gestión de menús del sistema. Este módulo permite **crear, editar, eliminar y visualizar** menús dinámicamente, con soporte para:
- **Menús Principales** (main_title)
- **Submenús** (sub)
- **Enlaces** (link)

## Componentes Creados

### 1. **Servicio: MenusService**
**Ubicación:** `src/app/services/mantenimiento/menus.service.ts`

**Métodos disponibles:**
- `getMenuList(data)` - Obtener lista de menús por empresa
- `createMenu(data)` - Crear nuevo menú
- `updateMenu(data)` - Actualizar menú existente
- `getMenuById(menuId)` - Obtener menú por ID
- `deleteMenu(menuId)` - Eliminar menú
- `getAvailableParentMenus(empresa, excludeMenuId?)` - Obtener menús disponibles como padres

### 2. **Componente: MenusComponent**
**Ubicación:** `src/app/components/mantenimiento/menus/`

**Archivos:**
- `menus.component.ts` - Lógica del componente
- `menus.component.html` - Template
- `menus.component.scss` - Estilos

**Ruta de acceso:** `/mantenimiento/menus`

## Funcionalidades

### Visualización de Menús
- Tabla con paginación que muestra todos los menús
- Selector de empresa (CARTIMEX, COMPUTRONSA)
- Botón para refrescar datos
- Botón para crear nuevo menú

### Crear Menú
1. Hacer clic en el botón **"Crear nuevo menú"** (ícono +)
2. Se abre un modal con el formulario
3. Completar los campos:
   - **Tipo de Menú** * (obligatorio): Seleccionar entre:
     - Menú Principal
     - Submenú
     - Enlace
   - **Menú Padre** * (si es submenú o enlace): Seleccionar el menú contenedor
   - **Título** * (obligatorio): Nombre del menú
   - **Ruta (Path)** (solo para enlaces): URL de destino (ej: `/logistica/tracking`)
   - **Ícono**: Clase de Font Awesome (ej: `fa-user`, `fa-cog`)
   - **Orden** * (obligatorio): Número para ordenar
   - **Mostrar Badge**: Activar si desea mostrar notificaciones
   - **Valor del Badge**: Número a mostrar (ej: 5)
   - **Color Badge**: Color del badge
   - **Estado** * (obligatorio): Activo o Inactivo
4. Hacer clic en **"Guardar"**

### Editar Menú
1. En la tabla, hacer clic en el ícono **"Editar"** (lápiz) de la fila
2. El modal se abre con los datos del menú
3. Modificar los campos necesarios
4. Hacer clic en **"Actualizar"**

### Eliminar Menú
1. En la tabla, hacer clic en el ícono **"Eliminar"** (papelera) de la fila
2. Se muestra una confirmación
3. Confirmar la eliminación
4. El menú será eliminado del sistema

### Cambiar Empresa
1. En la parte superior, seleccionar la empresa con los radio buttons
2. La tabla se recarga automáticamente mostrando menús de esa empresa

## Estructura de Datos

### Formato del Menú en Base de Datos
```sql
CREATE TABLE Menus (
    MenuId INT PRIMARY KEY AUTO_INCREMENT,
    Empresa VARCHAR(50),
    Titulo VARCHAR(255),          -- Título del menú
    Type VARCHAR(20),             -- main_title, sub, link
    Path VARCHAR(500),            -- Ruta del menú (para links)
    Icono VARCHAR(100),           -- Ícono de Font Awesome
    Orden INT,                    -- Orden de visualización
    PadreId INT,                  -- ID del menú padre (NULL para principales)
    Activo INT,                   -- 1 = Activo, 0 = Inactivo
    Badge INT,                    -- 0/1 para mostrar badge
    BadgeValue VARCHAR(50),       -- Valor del badge
    BadgeColor VARCHAR(50),       -- Color del badge
    FechaCreado DATETIME,
    CreadoPor VARCHAR(100),
    FechaModificado DATETIME,
    ModificadoPor VARCHAR(100),
    FOREIGN KEY (PadreId) REFERENCES Menus(MenuId)
);
```

### Ejemplo de Menú
```json
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
```

## Endpoints Backend Requeridos

El servicio espera los siguientes endpoints en la API:

### 1. **GetMenus** - Obtener lista de menús
```
POST /mantenimiento/menus/GetMenus
Body: { empresa: "CARTIMEX" }
Response: { success: true, data: [...] }
```

### 2. **CrearMenu** - Crear nuevo menú
```
POST /mantenimiento/menus/CrearMenu
Body: { Titulo, Type, Path, Icono, Orden, PadreId, Badge, BadgeValue, BadgeColor, Activo, Empresa, sessionData }
Response: { success: true/false, message: "..." }
```

### 3. **ActualizarMenu** - Actualizar menú
```
POST /mantenimiento/menus/ActualizarMenu
Body: { MenuId, Titulo, Type, Path, Icono, Orden, PadreId, Badge, BadgeValue, BadgeColor, Activo, Empresa, sessionData }
Response: { success: true/false, message: "..." }
```

### 4. **GetMenuById** - Obtener menú por ID
```
GET /mantenimiento/menus/GetMenuById/{menuId}
Response: { success: true, data: {...} }
```

### 5. **DeleteMenu** - Eliminar menú
```
DELETE /mantenimiento/menus/DeleteMenu/{menuId}
Response: { success: true/false, message: "..." }
```

### 6. **GetAvailableParentMenus** - Obtener menús disponibles como padres
```
GET /mantenimiento/menus/GetAvailableParentMenus?empresa=CARTIMEX&excludeMenuId=1
Response: { success: true, data: [...] }
```

## Integración con Backend

Para que el módulo funcione correctamente, el backend debe implementar:

1. **Validaciones:**
   - Verificar que el título no esté vacío
   - Validar que el PadreId exista si se proporciona
   - Permitir solo un PadreId si el tipo no es "main_title"

2. **Registros de auditoría:**
   - Capturar sessionData para saber quién creó/modificó
   - Guardar FechaCreado, CreadoPor, FechaModificado, ModificadoPor

3. **Cascada de eliminación:**
   - Decidir qué hacer con los hijos al eliminar un padre:
     - Opción 1: Eliminar en cascada
     - Opción 2: Desasociar hijos (establecer PadreId = NULL)
     - Opción 3: No permitir eliminación si tiene hijos

## Validaciones Frontend

El formulario valida:
- **Título**: Requerido (no puede estar vacío)
- **Tipo**: Requerido
- **Orden**: Requerido (número positivo)
- **Estado**: Requerido
- **Menú Padre**: Requerido si el tipo no es "main_title"
- **Path**: Validación de formato (recomendado usar `/ruta/completa`)

## Estilos y Tema

- Se utiliza Bootstrap 5 para la interfaz
- Los colores siguen el esquema de la aplicación
- Modal responsive con soporte mobile
- Iconografía con Font Awesome

## Notas Importantes

1. **Orden**: La columna "Orden" determina el orden en que aparecerán los menús en la interfaz
2. **Ícono**: Debe ser una clase válida de Font Awesome (ej: `fa-user`, `fa-cog`, `fa-building`)
3. **Path**: Solo se utiliza para menús de tipo "link"
4. **Badge**: Útil para mostrar notificaciones o contador de items (ej: 5 nuevas tareas)
5. **Empresa**: Los menús se filtran por empresa, permitiendo diferentes configuraciones por empresa

## Mejoras Futuras (Opcionales)

- [ ] Arrastrar y soltar para reordenar menús
- [ ] Vista previa del menú en tiempo real
- [ ] Importar/Exportar menús en CSV/JSON
- [ ] Validador de Path (verificar que la ruta exista)
- [ ] Historial de cambios
- [ ] Permisos de lectura/escritura por rol

## Troubleshooting

### El módulo no carga
- Verificar que MenusComponent esté registrado en las rutas
- Verificar que MenusService esté inyectado correctamente

### Los menús no se cargan en la tabla
- Verificar que el backend retorne el formato correcto: `{ success: true, data: [...] }`
- Revisar la consola del navegador para errores

### El selector de menú padre está vacío
- Verificar que la empresa tenga menús creados
- Verificar que el endpoint `GetAvailableParentMenus` esté implementado

### Los cambios no se guardan
- Verificar que los endpoints de creación/actualización retornen `{ success: true }`
- Revisar que sessionData se incluya en las peticiones
