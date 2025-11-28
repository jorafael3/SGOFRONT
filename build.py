#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para compilar Angular y copiar .htaccess automáticamente
Uso: python build.py
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

# Colores para la consola
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.OKBLUE}{'='*60}")
    print(f"{text.center(60)}")
    print(f"{'='*60}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKCYAN}ℹ {text}{Colors.ENDC}")

# Rutas
PROJECT_ROOT = Path(__file__).parent.resolve()
OUTPUT_FOLDER = "SGONUEVO"  # Cambiar aquí si necesitas otra carpeta
BASE_HREF = "/SGONUEVO/browser/"    # Cambiar aquí si cambias OUTPUT_FOLDER
DIST_PATH = PROJECT_ROOT / "dist" / OUTPUT_FOLDER

def find_node():
    """Encuentra la ruta de Node.js en Windows"""
    print_header("Buscando Node.js")
    
    # Ubicaciones comunes de Node.js en Windows
    possible_paths = [
        Path("C:/Program Files/nodejs"),
        Path("C:/Program Files (x86)/nodejs"),
        Path(os.path.expandvars("%APPDATA%/npm")),
        Path(os.path.expandvars("%PROGRAMFILES%/nodejs")),
    ]
    
    # Buscar en PATH
    try:
        result = subprocess.run(["where", "node"], capture_output=True, text=True, shell=True)
        if result.returncode == 0 and result.stdout.strip():
            node_path = Path(result.stdout.strip()).parent
            print_success(f"Node.js encontrado en: {node_path}")
            return node_path
    except:
        pass
    
    # Buscar en ubicaciones comunes
    for path in possible_paths:
        if path.exists():
            print_success(f"Node.js encontrado en: {path}")
            return path
    
    print_error("No se pudo encontrar Node.js")
    print_warning("Por favor instala Node.js desde: https://nodejs.org/")
    return None

def check_prerequisites():
    """Verifica que existan los prerequisitos"""
    print_header("Verificando Prerequisitos")
    
    # Verificar que estamos en la carpeta correcta
    if not (PROJECT_ROOT / "angular.json").exists():
        print_error(f"angular.json no encontrado en {PROJECT_ROOT}")
        return False
    print_success("angular.json encontrado")
    
    return True

def run_build():
    """Ejecuta ng build"""
    print_header("Compilando Proyecto Angular")
    
    # Buscar Node.js
    node_path = find_node()
    if not node_path:
        return False
    
    # Rutas a npx
    npx_path = node_path / "npx.cmd"
    if not npx_path.exists():
        npx_path = node_path / "npx"
    
    try:
        print_info(f"Ejecutando: {npx_path} ng build --configuration production --base-href {BASE_HREF} --output-path dist/{OUTPUT_FOLDER}")
        result = subprocess.run(
            [str(npx_path), "ng", "build", "--configuration", "production", "--base-href", BASE_HREF, "--output-path", f"dist/{OUTPUT_FOLDER}"],
            cwd=PROJECT_ROOT
        )
        
        if result.returncode == 0:
            print_success("Compilación completada exitosamente")
            return True
        else:
            print_error("La compilación falló")
            return False
    except Exception as e:
        print_error(f"Error durante la compilación: {e}")
        return False

def copy_htaccess():
    """Copia el .htaccess a las carpetas necesarias"""
    print_header("Copiando .htaccess")
    
    # Crear el contenido del .htaccess con el base href dinámico
    base_href_without_browser = BASE_HREF.replace("browser/", "")
    htaccess_content = f"""<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase {base_href_without_browser}

  # Si piden directamente la raíz, cargar /browser/index.html
  RewriteRule ^$ browser/index.html [L]

  # Si NO es un archivo ni carpeta real, enviar todo a /browser/index.html
  RewriteCond %{{REQUEST_FILENAME}} !-f
  RewriteCond %{{REQUEST_FILENAME}} !-d
  RewriteRule ^ browser/index.html [L]
</IfModule>"""
    
    # Carpetas donde copiar
    target_dirs = [
        DIST_PATH,
    ]
    
    for target_dir in target_dirs:
        try:
            if not target_dir.exists():
                print_warning(f"Carpeta no existe: {target_dir}")
                continue
            
            htaccess_path = target_dir / ".htaccess"
            
            with open(htaccess_path, 'w') as f:
                f.write(htaccess_content)
            
            print_success(f".htaccess copiado a: {htaccess_path}")
        except Exception as e:
            print_error(f"Error al copiar .htaccess a {target_dir}: {e}")
            return False
    
    return True

def verify_build():
    """Verifica que la compilación fue exitosa"""
    print_header("Verificando Build")
    
    dist_output = DIST_PATH
    
    if not dist_output.exists():
        print_error(f"Carpeta dist no encontrada: {dist_output}")
        return False
    
    print_success(f"Carpeta dist encontrada: {dist_output}")
    
    # Verificar index.html
    index_html = dist_output / "index.html"
    if index_html.exists():
        print_success("index.html encontrado")
        # Verificar base href
        with open(index_html, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'base href="/SGONUEVO/"' in content:
                print_success("base href corregido: /SGONUEVO/")
            else:
                print_warning("base href podría no estar correctamente configurado")
    else:
        print_error("index.html no encontrado")
        return False
    
    # Verificar .htaccess
    htaccess = dist_output / ".htaccess"
    if htaccess.exists():
        print_success(".htaccess encontrado")
    else:
        print_warning(".htaccess no encontrado")
    
    return True

def show_summary():
    """Muestra un resumen final"""
    print_header("Resumen Final")
    
    dist_output = DIST_PATH
    
    print(f"\n{Colors.BOLD}Configuración:{Colors.ENDC}")
    print(f"  Carpeta de salida: dist/{OUTPUT_FOLDER}/")
    print(f"  Base href: {BASE_HREF}")
    print(f"  Ruta completa: {dist_output}\n")
    
    print(f"{Colors.BOLD}Pasos siguientes:{Colors.ENDC}")
    print("  1. Verifica que los archivos se compilaron correctamente")
    print(f"  2. Ejecuta: python git_push.py (para hacer push a Git)")
    print(f"  3. Sube la carpeta 'dist/{OUTPUT_FOLDER}/' al servidor remoto")
    print("  4. Asegúrate que el .htaccess esté incluido")
    print(f"  5. Prueba accediendo a: http://10.5.2.62{BASE_HREF}\n")

def main():
    print(f"{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║     Build Angular + Copiar .htaccess Script               ║")
    print("║     SGOFRONT - Sistema de Gestión Operacional             ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}\n")
    
    print_success(f"Configuración:")
    print_success(f"  Build en: dist/{OUTPUT_FOLDER}/")
    print_success(f"  Base href: {BASE_HREF}\n")
    
    # Verificar prerequisitos
    if not check_prerequisites():
        sys.exit(1)
    
    # Compilar
    if not run_build():
        sys.exit(1)
    
    # Copiar .htaccess
    if not copy_htaccess():
        sys.exit(1)
    
    # Verificar
    verify_build()
    
    # Resumen
    show_summary()
    
    print_success("¡Build completado exitosamente!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Operación cancelada por el usuario{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        sys.exit(1)
