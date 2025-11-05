# Debugging de Iconos en TableComponent

## Posibles causas por las que no aparecen los iconos:

### 1. **Formato de iconos incorrecto**
El TableComponent puede esperar diferentes formatos:

```typescript
// Feather Icons (más común en Angular moderno)
icon: 'edit'
icon: 'mail' 
icon: 'trash'

// Font Awesome
icon: 'fa fa-edit'
icon: 'fas fa-edit'

// Bootstrap Icons
icon: 'bi bi-pencil'

// Iconos personalizados
icon: 'custom-edit'
```

### 2. **Verificar el TableComponent**
Busca en el archivo `table.component.ts` o `table.component.html` cómo maneja los iconos:

```html
<!-- Puede ser algo como: -->
<i [class]="'fa ' + action.icon"></i>
<!-- o -->
<app-feather-icon [icon]="action.icon"></app-feather-icon>
<!-- o -->
<i [class]="action.icon"></i>
```

### 3. **Configuración actual recomendada**
```typescript
row_action: [
  {
    label: 'Editar',
    action_to_perform: 'edit_user',
    icon: 'edit',           // Feather icon name
    type: 'button',
    class: 'btn btn-primary btn-sm me-2'
  },
  {
    label: 'Email',
    action_to_perform: 'contact_customer', 
    icon: 'mail',           // Feather icon name
    type: 'button',
    class: 'btn btn-success btn-sm'
  },
  {
    label: 'Eliminar',
    action_to_perform: 'delete_user',
    icon: 'trash',          // Feather icon name
    type: 'button', 
    class: 'btn btn-danger btn-sm'
  }
]
```

### 4. **Alternativas si no funciona**
```typescript
// Opción A: Con Font Awesome completo
icon: 'fas fa-edit'
icon: 'fas fa-envelope'
icon: 'fas fa-trash'

// Opción B: Solo las clases
icon: 'fa-edit'
icon: 'fa-envelope' 
icon: 'fa-trash'

// Opción C: Bootstrap Icons
icon: 'bi-pencil'
icon: 'bi-envelope'
icon: 'bi-trash'
```

### 5. **Para debugging**
1. Inspecciona el HTML generado en el navegador
2. Busca el elemento del botón de acción
3. Ve qué clases CSS se están aplicando al icono
4. Verifica si las librerías de iconos están cargadas

### 6. **Verificar dependencias**
Asegúrate de que tienes cargadas las librerías de iconos en:
- `angular.json` (en styles)
- `index.html` (CDN links)
- `styles.scss` (imports)
