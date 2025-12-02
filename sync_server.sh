#!/bin/bash
# Script para limpiar y sincronizar SGONUEVO en el servidor

echo "=========================================="
echo "Limpiando repositorio Git en el servidor"
echo "=========================================="

cd /var/www/html

# Opción 1: Eliminar y clonar de nuevo (más limpio)
echo "Eliminando carpeta SGONUEVO..."
rm -rf SGONUEVO

echo "Clonando repositorio..."
git clone https://github.com/jorafael3/SGONUEVO.git SGONUEVO

echo "Entrando a la carpeta..."
cd SGONUEVO

echo ""
echo "=========================================="
echo "✓ Repositorio limpio y sincronizado"
echo "=========================================="
echo ""
git log --oneline -3
echo ""
git branch -a
