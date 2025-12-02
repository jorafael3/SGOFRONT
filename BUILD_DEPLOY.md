# 🚀 Build & Deploy Scripts

Documentación para los scripts de compilación y despliegue automático de SGOFRONT.

## 📦 Scripts Disponibles

### 1. `build.py` - Compilación Angular
Compila el proyecto Angular y genera los archivos listos para producción.

**Uso:**
```powershell
python build.py
```

**Qué hace:**
- ✅ Verifica que Angular CLI esté disponible
- ✅ Compila con `ng build --configuration production`
- ✅ Genera base href dinámico (`/SGONUEVO/`)
- ✅ Copia `.htaccess` para SPA routing en Apache
- ✅ Verifica la compilación
- ✅ Muestra resumen final

**Configuración (líneas 47-49 en `build.py`):**
```python
OUTPUT_FOLDER = "SGONUEVO"  # Cambiar si necesitas otra carpeta
BASE_HREF = "/SGONUEVO/"    # Debe coincidir con OUTPUT_FOLDER
DIST_PATH = PROJECT_ROOT / "dist" / OUTPUT_FOLDER
```

**Salida:**
- `dist/SGONUEVO/` - Archivos compilados
- `dist/SGONUEVO/.htaccess` - Configuración Apache

---

### 2. `git_push.py` - Push a GitHub
Pushea los archivos compilados al repositorio de GitHub.

**Uso:**
```powershell
python git_push.py
```

**Qué hace:**
- ✅ Verifica que existe `dist/SGONUEVO/`
- ✅ Inicializa Git (primera ejecución)
- ✅ Configura el remote de GitHub
- ✅ Agrega todos los archivos con `git add -A`
- ✅ Crea commit automático con timestamp
- ✅ Detecta la rama actual
- ✅ Pushea a GitHub
- ✅ Muestra estado final

**Configuración (líneas 27-29 en `git_push.py`):**
```python
GIT_REPO_URL = "https://github.com/jorafael3/SGONUEVO.git"  # ← CAMBIAR A TU REPO
GIT_BRANCH = "master"  # Cambiar si es otra rama
```

**Requisitos previos:**
1. Crear repositorio en GitHub: https://github.com/new
   - Nombre: `SGONUEVO`
   - Sin README
   - Tomar URL del repositorio (ej: `https://github.com/tu-usuario/SGONUEVO.git`)

2. Configurar Git localmente:
   ```powershell
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@email.com"
   ```

---

## 🔄 Flujo de Trabajo Completo

### En Desarrollo Local
```powershell
# 1. Compilar Angular
python build.py

# 2. Verificar que todo se compiló correctamente
# (Revisar los mensajes finales)

# 3. Pushear a GitHub
python git_push.py
```

### En el Servidor (Despliegue)
```bash
# Primera vez - clonar repositorio
git clone https://github.com/tu-usuario/SGONUEVO.git SGONUEVO
cd SGONUEVO

# Después de cada push del desarrollo
git pull
```

---

## 📋 Estructura de Carpetas

```
SGOFRONT/                          # Proyecto Angular principal
├── src/                           # Código fuente
├── build.py                       # Script de compilación
├── git_push.py                    # Script de push a Git
├── dist/
│   └── SGONUEVO/                  # Archivos compilados
│       ├── index.html
│       ├── .htaccess              # Generado automáticamente
│       ├── .git/                  # Repositorio Git independiente
│       └── main-*.js, styles-*.css, etc.
```

---

## 🔧 Troubleshooting

### Error: "Node.js no encontrado"
- Verificar que Node.js esté instalado: `node --version`
- Verificar que npm esté disponible: `npm --version`

### Error: "ng build failed"
- Verificar que Angular CLI esté instalado: `npm install -g @angular/cli`
- Revisar que no haya errores de compilación en el proyecto

### Error: "Permission denied" al pushear
- Verificar credenciales de Git
- Si usas SSH, verificar clave SSH esté configurada
- Si usas HTTPS, considerar usar Personal Access Token en lugar de contraseña

### Error: "src refspec main does not match any"
- El script detecta automáticamente la rama actual
- Si persiste, verificar manualmente: `cd dist/SGONUEVO && git branch`

---

## 📝 Notas Importantes

1. **Git independiente**: `dist/SGONUEVO/` tiene su propio repositorio Git separado del proyecto principal
2. **No afecta al .git principal**: Los cambios en `dist/` no afectan al repositorio de desarrollo en `SGOFRONT/`
3. **Base href dinámico**: Se puede cambiar `BASE_HREF` en `build.py` para diferentes entornos
4. **.htaccess automático**: Se genera dinámicamente en cada build con el `BASE_HREF` correcto
5. **Primer push**: La primera ejecución de `git_push.py` crea el repositorio local e inicializa Git

---

## 🚀 Ejemplo Completo

```powershell
# Terminal 1: Compilar
PS C:\xampp\htdocs\SGOFRONT> python build.py
# ... sale un resumen con rutas completas ...

# Terminal 2: Pushear (en la misma carpeta)
PS C:\xampp\htdocs\SGOFRONT> python git_push.py
# ... muestra último commit y estado ...

# Terminal 3: En el servidor (Linux/Mac)
$ git clone https://github.com/tu-usuario/SGONUEVO.git SGONUEVO
$ cd SGONUEVO
$ # Los archivos compilados ya están listos para servir

# Futuros updates
$ git pull  # Solo esto para obtener nuevas compilaciones
```

---

## 📞 Soporte

Si algo no funciona:
1. Verificar que Python 3 esté instalado: `python --version`
2. Verificar que Git esté instalado: `git --version`
3. Revisar los mensajes de error en la consola (están en español)
4. Asegurar que tienes acceso a GitHub (credenciales configuradas)

