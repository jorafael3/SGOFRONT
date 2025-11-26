#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para hacer push automático de dist/SGONUEVO a repositorio remoto
Uso: python git_push.py
     (Te pedirá un mensaje personalizado)
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime

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

# Configuración
PROJECT_ROOT = Path(__file__).parent.resolve()
OUTPUT_FOLDER = "SGONUEVO"
DIST_PATH = PROJECT_ROOT / "dist" / OUTPUT_FOLDER
GIT_REPO_URL = "https://github.com/jorafael3/SGONUEVO.git"  # Cambiar a tu repo
GIT_BRANCH = "master"  # Rama en el repositorio remoto

def verify_dist_exists():
    """Verifica que la carpeta dist/SGONUEVO existe"""
    print_header("Verificando Carpeta dist/SGONUEVO")
    
    if not DIST_PATH.exists():
        print_error(f"Carpeta no encontrada: {DIST_PATH}")
        return False
    
    print_success(f"Carpeta encontrada: {DIST_PATH}")
    return True

def init_git_dist():
    """Inicializa Git en la carpeta dist/SGONUEVO si no existe"""
    print_header("Inicializando Git en dist/SGONUEVO")
    
    git_dir = DIST_PATH / ".git"
    
    if git_dir.exists():
        print_success("Repositorio Git ya existe en dist/SGONUEVO")
        return True
    
    try:
        # Inicializar repositorio
        print_info(f"Inicializando repositorio en {DIST_PATH}")
        subprocess.run(["git", "init"], cwd=DIST_PATH, capture_output=True, check=True)
        
        # Configurar usuario de Git
        subprocess.run(["git", "config", "user.email", "build@sgofront.local"], cwd=DIST_PATH, capture_output=True)
        subprocess.run(["git", "config", "user.name", "Build Script"], cwd=DIST_PATH, capture_output=True)
        
        # Crear .gitignore
        gitignore_path = DIST_PATH / ".gitignore"
        gitignore_content = "node_modules/\n.DS_Store\n*.log\n"
        with open(gitignore_path, 'w') as f:
            f.write(gitignore_content)
        
        print_success("Archivo .gitignore creado")
        
        # Agregar remote
        print_info(f"Agregando remoto: {GIT_REPO_URL}")
        subprocess.run(["git", "remote", "add", "origin", GIT_REPO_URL], cwd=DIST_PATH, capture_output=True, check=True)
        
        print_success("Repositorio Git inicializado correctamente")
        return True
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode() if e.stderr else str(e)
        print_error(f"Error al inicializar Git: {error_msg}")
        return False
    except Exception as e:
        print_error(f"Error inesperado en init_git_dist: {e}")
        return False

def check_git_remote():
    """Verifica que el remote de Git esté configurado"""
    print_header("Verificando Configuración de Git")
    
    try:
        result = subprocess.run(
            ["git", "remote", "-v"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if "origin" in result.stdout:
            print_success("Remote 'origin' configurado correctamente")
            print_info(result.stdout.strip())
            return True
        else:
            print_warning("Remote 'origin' no encontrado, agregando...")
            subprocess.run(
                ["git", "remote", "add", "origin", GIT_REPO_URL],
                cwd=DIST_PATH,
                capture_output=True,
                check=True
            )
            print_success("Remote agregado")
            return True
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode() if e.stderr else str(e)
        print_error(f"Error verificando remote: {error_msg}")
        return False

def push_to_git(custom_message=None):
    """Pushea los cambios compilados al repositorio remoto"""
    print_header("Pusheando Cambios a Git")
    
    try:
        # Obtener la rama actual
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        current_branch = result.stdout.strip()
        
        if not current_branch:
            current_branch = GIT_BRANCH
        
        # Hacer pull primero para sincronizar con remoto
        print_info(f"Sincronizando con rama remota '{current_branch}'...")
        result = subprocess.run(
            ["git", "pull", "origin", current_branch, "--allow-unrelated-histories"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            if "Already up to date" not in result.stdout:
                print_warning(f"Pull completado con cambios o conflictos")
        else:
            print_success("Sincronización completada")
        
        # Agregar todos los archivos
        print_info("Agregando archivos...")
        subprocess.run(["git", "add", "-A"], cwd=DIST_PATH, capture_output=True, check=True)
        
        # Verificar si hay cambios
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if not result.stdout.strip():
            print_info("No hay cambios para commitear")
            return True
        
        # Crear mensaje de commit
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if custom_message:
            # Si hay mensaje personalizado, agregarlo con la fecha
            commit_msg = f"{custom_message} - {timestamp}"
        else:
            # Mensaje por defecto con fecha
            commit_msg = f"Build automático - {timestamp}"
        
        print_info(f"Creando commit: {commit_msg}")
        subprocess.run(
            ["git", "commit", "-m", commit_msg],
            cwd=DIST_PATH,
            capture_output=True,
            check=True
        )
        
        print_info(f"Rama actual: {current_branch}")
        
        # Hacer push
        print_info(f"Pusheando a rama '{current_branch}'...")
        result = subprocess.run(
            ["git", "push", "-u", "origin", current_branch, "--force-with-lease"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print_success("Cambios pusheados correctamente")
            return True
        else:
            error_msg = result.stderr if isinstance(result.stderr, str) else result.stderr.decode()
            print_error(f"Error al pushear: {error_msg}")
            # Intentar con --force si falla
            print_info("Intentando con --force...")
            result = subprocess.run(
                ["git", "push", "-u", "origin", current_branch, "--force"],
                cwd=DIST_PATH,
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print_success("Cambios pusheados con --force")
                return True
            else:
                print_error(f"Error incluso con --force: {error_msg}")
                return False
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode() if e.stderr else str(e)
        print_error(f"Error en Git: {error_msg}")
        return False
    except Exception as e:
        print_error(f"Error inesperado en push_to_git: {e}")
        return False

def show_status():
    """Muestra el estado actual de Git"""
    print_header("Estado del Repositorio Git")
    
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--oneline"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print_success(f"Último commit: {result.stdout.strip()}")
        
        result = subprocess.run(
            ["git", "branch", "-a"],
            cwd=DIST_PATH,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print_info(f"Ramas disponibles:\n{result.stdout.strip()}")
    except Exception as e:
        print_warning(f"No se pudo obtener estado: {e}")

def main():
    print(f"{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║           Git Push Script para dist/SGONUEVO              ║")
    print("║     Pushea cambios compilados al repositorio remoto       ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}\n")
    
    print_success(f"Configuración:")
    print_success(f"  Carpeta: dist/{OUTPUT_FOLDER}/")
    print_success(f"  Repositorio: {GIT_REPO_URL}")
    print_success(f"  Rama: {GIT_BRANCH}\n")
    
    # Pedir mensaje personalizado de forma interactiva
    print_info("Ingresa un mensaje para el commit (o presiona Enter para usar mensaje por defecto):")
    custom_message = input(f"{Colors.BOLD}> {Colors.ENDC}").strip()
    
    if custom_message:
        print_success(f"Mensaje: {custom_message}\n")
    else:
        print_info("Usando mensaje por defecto: 'Build automático' + fecha\n")
    
    # Verificar que existe dist/SGONUEVO
    if not verify_dist_exists():
        sys.exit(1)
    
    # Inicializar Git si es necesario
    if not init_git_dist():
        sys.exit(1)
    
    # Verificar configuración de remote
    if not check_git_remote():
        sys.exit(1)
    
    # Hacer push con mensaje personalizado
    if not push_to_git(custom_message if custom_message else None):
        print_warning("Push completado con advertencias")
    
    # Mostrar estado
    show_status()
    
    print_success("\n¡Operación completada exitosamente!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Operación cancelada por el usuario{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Error inesperado: {e}")
        sys.exit(1)
