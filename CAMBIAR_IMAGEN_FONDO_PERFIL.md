# 🖼️ Cambiar Imagen de Fondo del Perfil de Usuario

## 📍 Ubicación de la Imagen

La imagen de fondo del perfil se encuentra aquí:

```
public/assets/images/other-images/bg-profile.png
```

## 🎨 ¿Dónde Está en el Diseño?

La imagen de fondo aparece en esta parte del perfil:

```
┌─────────────────────────────────────────┐
│ [IMAGEN DE FONDO - bg-profile.png] ←←←  │
│ (Este es el fondo azul/decorativo)      │
│                                         │
│        [Avatar del Usuario]             │
│        Nombre del Usuario               │
│        Departamento                     │
├─────────────────────────────────────────┤
│ Bio, Email, Departamento, etc...        │
└─────────────────────────────────────────┘
```

## ✏️ Cómo Cambiar la Imagen

### Opción 1: Reemplazar el Archivo Actual (Recomendado)

1. **Ve a la carpeta:**
   ```
   c:\xampp\htdocs\SGOFRONT\public\assets\images\other-images\
   ```

2. **Encuentra el archivo:**
   ```
   bg-profile.png
   ```

3. **Reemplázalo con tu imagen:**
   - Asegúrate de que sea PNG (o cambia la extensión en el SCSS)
   - Resolución recomendada: 1920x470 px (ancho x alto)
   - Tamaño recomendado: Menos de 500 KB

4. **El cambio se verá automáticamente**

### Opción 2: Cambiar la Ruta en el CSS

Si quieres usar otra imagen con otro nombre:

1. **Abre el archivo CSS:**
   ```
   public/assets/scss/pages/_user-profile.scss
   ```

2. **Busca la línea 39:**
   ```scss
   .hovercard {
     .cardheader {
       background: url(../../images/other-images/bg-profile.png);
       ↑ Esta es la línea a cambiar
   ```

3. **Cambia la ruta:**
   ```scss
   // Antes
   background: url(../../images/other-images/bg-profile.png);
   
   // Después (ejemplo)
   background: url(../../images/other-images/mi-imagen-nueva.png);
   ```

4. **Guarda y recarga el navegador**

## 🖼️ Especificaciones Recomendadas

| Propiedad | Recomendación |
|-----------|---------------|
| **Formato** | PNG, JPG, WebP |
| **Ancho** | 1920 px |
| **Alto** | 470 px |
| **Tamaño Archivo** | Menor a 500 KB |
| **Colores** | Colores suaves/degradados |
| **Contenido** | Sin texto (se coloca el avatar encima) |

## 🎨 Propiedades CSS Actuales

```scss
.hovercard .cardheader {
  background: url(...);      // Imagen de fondo
  background-size: cover;    // Cubre todo el espacio
  background-position: 10%;  // Posicionado al 10%
  height: 470px;             // Alto del contenedor
  display: flex;             // Flexbox para alinear
  align-items: flex-end;     // Avatar al final
}
```

Si quieres modificar cómo se ve:

```scss
// Cambiar posición (10% a otra posición)
background-position: center;  // Centro
background-position: 50%;     // Centro (igual)

// Cambiar cómo se ajusta
background-size: cover;       // Cubre todo (actual)
background-size: contain;     // Contiene la imagen
background-size: 100% 100%;   // Estira a llenar
```

## 📂 Archivos Relacionados

| Archivo | Descripción |
|---------|------------|
| `public/assets/images/other-images/bg-profile.png` | **Imagen de fondo actual** ← CAMBIAR ESTO |
| `public/assets/scss/pages/_user-profile.scss` | CSS donde se define la ruta |
| `src/app/components/users/widgets/user-personal-details/user-personal-details.component.html` | HTML del perfil |

## 🔄 Después de Cambiar

1. **Si reemplazaste el archivo:**
   - Limpia caché del navegador (Ctrl + Shift + Delete)
   - Recarga la página (Ctrl + F5 o F5)

2. **Si cambiaste la ruta en SCSS:**
   - Guarda el archivo
   - El compilador Angular recompilará automáticamente
   - Recarga la página

## 💡 Tips

✅ **Para un look profesional:**
- Usa gradientes suaves
- Evita imágenes muy coloridas
- Usa colores que combinen con tu tema

✅ **Optimización:**
- Comprime la imagen antes de usar
- Usa formatos modernos (WebP) si es posible

✅ **Responsive:**
- El CSS ya está configurado para ser responsive
- Tu imagen se adaptará automáticamente a distintos tamaños

## 🧪 Validación

Después de cambiar, verifica que:
- ✅ La imagen se carga correctamente
- ✅ El avatar se ve bien sobre la imagen
- ✅ En dispositivos móviles también se ve bien
- ✅ La página sigue siendo responsive

---

**Ruta actual:** `public/assets/images/other-images/bg-profile.png`  
**CSS:** `public/assets/scss/pages/_user-profile.scss` (línea 39)  
**Dimensiones recomendadas:** 1920x470 px

¡Listo! Ahora sabes dónde cambiar la imagen de fondo del perfil. 🎉
