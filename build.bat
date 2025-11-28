@echo off
REM Script para compilar Angular y copiar .htaccess automáticamente
REM Uso: build.bat

setlocal enabledelayedexpansion

cls
echo.
echo ============================================================
echo     Build Angular + Copiar .htaccess Script
echo     SGOFRONT - Sistema de Gestion Operacional
echo ============================================================
echo.

REM Verificar que estamos en la carpeta correcta
if not exist "angular.json" (
    echo [ERROR] angular.json no encontrado
    echo Por favor ejecuta este script desde la carpeta raiz del proyecto
    pause
    exit /b 1
)

echo [INFO] Verificando prerequisites...
REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no está instalado o no está en PATH
    pause
    exit /b 1
)
echo [OK] npm encontrado

REM Verificar ng
ng version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] ng CLI podría no estar disponible
    echo Intentaremos usar npx ng build
)

echo.
echo ============================================================
echo     Compilando Proyecto Angular...
echo ============================================================
echo.

call ng build --output-path "dist\SGONUEVO"

if errorlevel 1 (
    echo [ERROR] La compilacion fallo
    pause
    exit /b 1
)

echo.
echo [OK] Compilacion completada exitosamente
echo.

REM Copiar .htaccess
echo ============================================================
echo     Copiando .htaccess...
echo ============================================================
echo.

set DIST_PATH=dist\SGONUEVO
set HTACCESS_CONTENT=^<IfModule mod_rewrite.c^>^
  RewriteEngine On^
  RewriteBase /SGONUEVO/^
  ^
  # Si es un archivo o carpeta real, no hacer nada^
  RewriteCond %%{REQUEST_FILENAME} -f [OR]^
  RewriteCond %%{REQUEST_FILENAME} -d^
  RewriteRule ^ - [L]^
  ^
  # Si no es un archivo o carpeta, redirigir a index.html^
  RewriteRule ^ index.html [QSA,L]^
^</IfModule^>

if not exist "%DIST_PATH%" (
    echo [ERROR] Carpeta dist no encontrada: %DIST_PATH%
    pause
    exit /b 1
)

(
    echo ^<IfModule mod_rewrite.c^>
    echo   RewriteEngine On
    echo   RewriteBase /SGONUEVO/
    echo   
    echo   # Si es un archivo o carpeta real, no hacer nada
    echo   RewriteCond %%{REQUEST_FILENAME} -f [OR]
    echo   RewriteCond %%{REQUEST_FILENAME} -d
    echo   RewriteRule ^ - [L]
    echo   
    echo   # Si no es un archivo o carpeta, redirigir a index.html
    echo   RewriteRule ^ index.html [QSA,L]
    echo ^</IfModule^>
) > "%DIST_PATH%\.htaccess"

if errorlevel 1 (
    echo [ERROR] No se pudo copiar .htaccess
    pause
    exit /b 1
)

echo [OK] .htaccess copiado a: %DIST_PATH%\.htaccess

REM Verificar que se creo correctamente
if exist "%DIST_PATH%\.htaccess" (
    echo [OK] .htaccess verificado
) else (
    echo [ERROR] .htaccess no se creo correctamente
    pause
    exit /b 1
)

REM Verificar index.html
if exist "%DIST_PATH%\index.html" (
    echo [OK] index.html encontrado
) else (
    echo [ERROR] index.html no encontrado
    pause
    exit /b 1
)

echo.
echo ============================================================
echo     Resumen Final
echo ============================================================
echo.
echo Carpeta de salida:
echo   %DIST_PATH%
echo.
echo Pasos siguientes:
echo   1. Verifica que los archivos se compilaron correctamente
echo   2. Sube la carpeta 'dist\cuba-angular\browser\' al servidor remoto
echo   3. Asegurate que el .htaccess este incluido
echo   4. Prueba accediendo a: http://10.5.2.62/SGONUEVO/
echo.
echo [OK] ¡Build completado exitosamente!
echo.

pause
