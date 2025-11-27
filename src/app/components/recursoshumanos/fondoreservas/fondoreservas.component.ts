import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { FondoreservasService } from '../../../services/fondoreservas/fondoreservas.service';


@Component({
  selector: 'app-fondoreservas',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './fondoreservas.component.html',
  styleUrl: './fondoreservas.component.scss'
})

export class FondoreservasComponent {

  selectedEmpresa: string = 'Cartimex';
  selectedFile: File | null = null;
  tableData: any[] = [];
  filteredTableData: any[] = [];
  tableHeaders: string[] = [];
  isLoadingFile: boolean = false;
  searchText: string = '';
  vistoFilter: string = 'todos'; // 'todos', 'si', 'no'

  constructor(
    private cdr: ChangeDetectorRef,
    private fondoreservasService: FondoreservasService
  ) { }

  ngOnInit() {
    console.log('Componente Fondo de Reservas inicializado');
  }

  selectEmpresa(empresa: string) {
    this.selectedEmpresa = empresa;
    Swal.fire({
      title: 'Empresa Seleccionada',
      text: `Has seleccionado: ${empresa}`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.processFile(file);
    }
  }

  processFile(file: File) {
    this.isLoadingFile = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', raw: true });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

        let headerRowIndex = -1;
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length > 0) {
            for (let j = 0; j < row.length; j++) {
              const cellValue = row[j];
              if (cellValue && typeof cellValue === 'string') {
                const normalizedValue = cellValue.toString().toLowerCase().trim();
                if (normalizedValue === 'cedula' || normalizedValue.startsWith('cedula')) {
                  headerRowIndex = i;
                  break;
                }
              }
            }
            if (headerRowIndex !== -1) break;
          }
        }

        if (headerRowIndex === -1) {
          Swal.fire({ title: 'Error', html: 'No se encontró la fila de encabezados (debe contener "Cedula").', icon: 'error' });
          this.isLoadingFile = false;
          return;
        }

        const rawHeaders = jsonData[headerRowIndex];
        this.tableHeaders = rawHeaders.map((h: any) => {
          if (h === undefined || h === null || h === '') return '';
          return h.toString().trim();
        }).filter((h: string) => h !== '');

        console.log('📋 Encabezados encontrados:', this.tableHeaders);

        const dataRows = jsonData.slice(headerRowIndex + 1);
        this.tableData = [];

        for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
          const row = dataRows[rowIndex];
          const hasData = row && row.some((cell: any) => cell !== undefined && cell !== null && cell !== '' && cell.toString().trim() !== '');

          if (hasData) {
            const obj: any = {};
            let hasValidData = false;

            for (let colIndex = 0; colIndex < this.tableHeaders.length; colIndex++) {
              const header = this.tableHeaders[colIndex];
              const value = row[colIndex];

              if (value !== undefined && value !== null && value !== '') {
                obj[header] = value.toString().trim();
                hasValidData = true;
              } else {
                obj[header] = '';
              }
            }

            if (hasValidData) {
              const tieneSolicitud = (obj['Tiene Solicitud'] || obj['Tiene Solicitud de'] || obj['tieneSolicitud'] || '').toUpperCase().trim();
              const tiene = (obj['Tiene'] || obj['tiene'] || '').toUpperCase().trim();

              let visto = 0;
              if (tieneSolicitud === 'SI' && tiene === 'SI') {
                visto = 1;
              } else if (tieneSolicitud === 'NO' && tiene === 'SI') {
                visto = 0;
              }

              obj['VISTO_NUMERIC'] = visto;
              obj['Se marca en Dobra'] = visto === 1 ? 'SI' : 'NO';

              this.tableData.push(obj);
            }
          }
        }

        if (!this.tableHeaders.includes('Se marca en Dobra')) {
          this.tableHeaders.push('Se marca en Dobra');
        }

        this.filteredTableData = [...this.tableData];
        this.isLoadingFile = false;
        this.cdr.detectChanges();

        Swal.fire({
          title: '¡Éxito!',
          text: `Se cargaron ${this.tableData.length} registros correctamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error al procesar archivo:', error);
        Swal.fire('Error', 'Hubo un error al procesar el archivo', 'error');
        this.isLoadingFile = false;
      }
    };

    reader.onerror = (error) => {
      console.error('Error al leer archivo:', error);
      Swal.fire('Error', 'No se pudo leer el archivo', 'error');
      this.isLoadingFile = false;
    };

    reader.readAsArrayBuffer(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  filterTable() {
    const searchLower = this.searchText.toLowerCase().trim();

    let filtered = this.tableData;

    if (searchLower !== '') {
      filtered = filtered.filter(row => {
        return this.tableHeaders.some(header => {
          const value = row[header];
          if (value) {
            return value.toString().toLowerCase().includes(searchLower);
          }
          return false;
        });
      });
    }

    if (this.vistoFilter === 'si') {
      filtered = filtered.filter(row => row['Se marca en Dobra'] === 'SI');
    } else if (this.vistoFilter === 'no') {
      filtered = filtered.filter(row => row['Se marca en Dobra'] === 'NO');
    }

    this.filteredTableData = filtered;
  }

  setVistoFilter(filter: string) {
    this.vistoFilter = filter;
    this.filterTable();
  }

  procesarDatosParaGuardar(): any[] {
    const arregloFondos: any[] = [];

    this.tableData.forEach((data) => {
      const tieneSolicitud = (data['Tiene Solicitud'] || data['Tiene Solicitud de'] || data['tieneSolicitud'] || '').toUpperCase().trim();
      const tiene = (data['Tiene'] || data['tiene'] || '').toUpperCase().trim();

      const visto = data['VISTO_NUMERIC'] || 0;

      arregloFondos.push({
        EMPRESA: this.selectedEmpresa,
        cedula: data['Cedula'] || data['cedula'] || '',
        nombre: data['Nombre Afiliado'] || data['nombre'] || '',
        sucursal: data['Sucursal'] || data['sucursal'] || '',
        tieneSolicitud: tieneSolicitud,
        tiene: tiene,
        fechaSolicitud: data['Fecha Solicitud'] || data['fechaSolicitud'] || '',
        acumulaFondos: data['Acumula Fondos'] || data['acumulafondos'] || '',
        VISTO: visto
      });
    });

    return arregloFondos;
  }



  guardarDatos() {

    const datosProcesados = this.procesarDatosParaGuardar();

    console.log('📦 Empresa:', this.selectedEmpresa);
    console.log('📋 ARREGLO COMPLETO:', datosProcesados);

    Swal.fire({
      title: '¿Guardar datos?',
      html: `Se guardarán <strong>${datosProcesados.length} registros</strong> para <strong>${this.selectedEmpresa}</strong><br><br>
             <small>Se agregará el campo VISTO según las reglas de negocio</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fa fa-save me-2"></i>Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Guardando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Preparar el objeto de datos para enviar
        const payload = {
          empresa: this.selectedEmpresa,
          datos: datosProcesados
        };

        this.fondoreservasService.guardarDatos(payload)
          .subscribe({
            next: (response) => {
              console.log('✅ ÉXITO:', response);
              Swal.fire({
                title: '¡Guardado!',
                text: response.message || 'Datos guardados correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (error) => {
              console.error('❌ ERROR:', error);
              Swal.fire({
                title: 'Error',
                html: `<strong>Error al conectar con el backend</strong><br><br>
                       Status: ${error.status || 'N/A'}<br>
                       ${error.error?.message || error.message || 'El endpoint aún no está implementado'}<br><br>
                       <small>Revisa la consola (F12) para más detalles</small>`,
                icon: 'error'
              });
            }
          });
      }
    });
  }

  guardarRegistroIndividual(row: any) {
    const tieneSolicitud = (row['Tiene Solicitud'] || row['Tiene Solicitud de'] || row['tieneSolicitud'] || '').toUpperCase().trim();
    const tiene = (row['Tiene'] || row['tiene'] || '').toUpperCase().trim();
    const visto = row['VISTO_NUMERIC'] || 0;

    const registroProcesado = {
      EMPRESA: this.selectedEmpresa,
      cedula: row['Cedula'] || row['cedula'] || '',
      nombre: row['Nombre Afiliado'] || row['nombre'] || '',
      sucursal: row['Sucursal'] || row['sucursal'] || '',
      tieneSolicitud: tieneSolicitud,
      tiene: tiene,
      fechaSolicitud: row['Fecha Solicitud'] || row['fechaSolicitud'] || '',
      acumulaFondos: row['Acumula Fondos'] || row['acumulafondos'] || '',
      VISTO: visto
    };

    console.log('📦 Guardando registro individual:', registroProcesado);

    Swal.fire({
      title: '¿Guardar registro?',
      html: `Se guardará el registro de <strong>${registroProcesado.nombre}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fa fa-save me-2"></i>Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Guardando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const payload = {
          empresa: this.selectedEmpresa,
          datos: [registroProcesado]
        };

        this.fondoreservasService.guardarDatos(payload)
          .subscribe({
            next: (response) => {
              console.log('✅ ÉXITO:', response);
              Swal.fire({
                title: '¡Guardado!',
                text: 'Registro guardado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (error) => {
              console.error('❌ ERROR:', error);
              Swal.fire({
                title: 'Error',
                html: `<strong>Error al conectar con el backend</strong><br><br>
                       Status: ${error.status || 'N/A'}<br>
                       ${error.error?.message || error.message || 'El endpoint aún no está implementado'}<br><br>
                       <small>Revisa la consola (F12) para más detalles</small>`,
                icon: 'error'
              });
            }
          });
      }
    });
  }

}
