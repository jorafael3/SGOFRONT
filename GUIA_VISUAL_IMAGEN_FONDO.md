# 🎯 Ubicación de la Imagen de Fondo - Guía Visual

## Estructura del Proyecto

```
c:\xampp\htdocs\SGOFRONT\
│
└── public/
    └── assets/
        └── images/
            └── other-images/
                └── 📷 bg-profile.png  ← AQUÍ ESTÁ LA IMAGEN
                
                
Ruta Completa:
c:\xampp\htdocs\SGOFRONT\public\assets\images\other-images\bg-profile.png
```

## Dónde Aparece en el Diseño

### Vista del Perfil

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🖼️ bg-profile.png (Imagen de Fondo)           │
│  Aquí es donde aparece tu imagen azul/         │
│  decorativa de fondo                          │
│                                                 │
│                  👤                            │
│            [Avatar Usuario]                    │
│          NOMBRE DEL USUARIO                    │
│            Departamento                        │
│                                                 │
└─────────────────────────────────────────────────┘
│ Bio, Email, Departamento...                    │
└─────────────────────────────────────────────────┘
```

## 3 Formas de Cambiar la Imagen

### ✅ Forma 1: Reemplazar el Archivo (MÁS FÁCIL)

```
1️⃣  Abre el Explorador de Windows
    ↓
2️⃣  Navega a:
    c:\xampp\htdocs\SGOFRONT\public\assets\images\other-images\
    ↓
3️⃣  Encuentra bg-profile.png
    ↓
4️⃣  Reemplázalo con tu imagen
    (Asegúrate de ponerle el mismo nombre: bg-profile.png)
    ↓
5️⃣  Recarga el navegador (Ctrl + F5)
    ↓
✅ ¡Listo! Ya verás tu imagen
```

### ✅ Forma 2: Cambiar la Ruta en CSS

```
1️⃣  Abre:
    public/assets/scss/pages/_user-profile.scss
    ↓
2️⃣  Busca la línea 39:
    .hovercard .cardheader {
      background: url(../../images/other-images/bg-profile.png);
    ↓
3️⃣  Si tu imagen se llama diferente, cambia:
    background: url(../../images/other-images/TU-IMAGEN.png);
    ↓
4️⃣  Guarda (Ctrl + S)
    ↓
5️⃣  Espera a que Angular recompile
    ↓
✅ ¡Listo! Ya verás tu imagen
```

### ✅ Forma 3: Usar URL Externa

```scss
.hovercard .cardheader {
  background: url('https://tu-sitio.com/imagen.png');
  background-size: cover;
}
```

## 📏 Dimensiones Ideales

```
┌─────────────────────────────────┐
│  Ancho: 1920 px                 │
│  Alto: 470 px                   │
│                                 │
│  Aspect Ratio: 4:1 aproximado  │
│                                 │
│  Tamaño: < 500 KB               │
└─────────────────────────────────┘
```

## 🎨 Ejemplos de Imágenes

### ❌ NO RECOMENDADO
- Imágenes muy coloridas (distrae del contenido)
- Fotos de personas (el avatar está encima)
- Texto en la imagen (se va a tapar)
- Demasiado detalladas (se ve borrosa)

### ✅ RECOMENDADO
- Gradientes suaves (azul, púrpura, gris)
- Patrones geométricos sutiles
- Fondos abstractos
- Colores corporativos
- Efectos de luz/sombra

## 📝 Ejemplo de Cambio

### Antes
```
Archivo: bg-profile.png (azul)
Ubicación: other-images/bg-profile.png
```

### Después
```
Archivo: mi-fondo-corporativo.png (nuevo diseño)

Opción A: Renombra a bg-profile.png (más fácil)
Opción B: Cambia CSS a: url(../../images/other-images/mi-fondo-corporativo.png)
```

## 🔍 Verificación

Después de cambiar, verifica en el navegador:

```
1. ¿Se ve la nueva imagen? ✅
2. ¿El avatar está bien posicionado sobre ella? ✅
3. ¿Se ve bien en móvil? ✅ (Ctrl + Shift + I, responsivo)
4. ¿Sin errores en consola? ✅ (F12)
```

## 🧹 Limpieza de Caché

Si no ves los cambios:

```
1️⃣  Abre el navegador (F12 o Ctrl + Shift + I)
    ↓
2️⃣  Ve a Network
    ↓
3️⃣  Checkea "Disable cache"
    ↓
4️⃣  Recarga (Ctrl + F5 o Cmd + Shift + R)
    ↓
✅ Ahora verás los cambios
```

## 📂 Alternativa: Otra Carpeta

Si tienes la imagen en otra ubicación:

```
public/assets/images/
├── other-images/
│   └── bg-profile.png  ← Actual
├── dashboard/
│   └── mi-imagen.png  ← Tu imagen
└── custom/
    └── fondo.png  ← O aquí
```

Cambia la ruta en SCSS:

```scss
// Opción 1: other-images
background: url(../../images/other-images/bg-profile.png);

// Opción 2: dashboard
background: url(../../images/dashboard/mi-imagen.png);

// Opción 3: custom
background: url(../../images/custom/fondo.png);
```

---

## 🎯 RESUMEN RÁPIDO

**Ruta del archivo:** `public/assets/images/other-images/bg-profile.png`

**Opción más fácil:** Reemplaza el archivo PNG conservando el nombre

**Opción flexible:** Cambia la ruta en `public/assets/scss/pages/_user-profile.scss` línea 39

**Dimensiones:** 1920 x 470 px

¿Necesitas ayuda con algo específico? 😊
