import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbModal, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { PaginationComponent } from '../pagination/pagination.component';
import { SvgIconComponent } from "../svg-icon/svg-icon.component";
import { PageSizeOptions, Pagination, TableClickedAction, TableConfigs, TableRows, CustomButton } from '../../../interface/common';
import { TableService } from '../../../services/table.service';

@Component({
  selector: 'app-table',
  imports: [CommonModule, NgbPaginationModule, FormsModule, 
            RouterModule, NgbDatepickerModule, NgbTooltipModule,
            PaginationComponent, SvgIconComponent],
  providers: [DecimalPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  // Para almacenar el valor seleccionado por fila y columna select
  public selectValues: { [rowIndex: number]: { [colKey: string]: any } } = {};

  @Input() tableConfig: TableConfigs;
  @Input() hasCheckbox: boolean;
  @Input() pageSize: number = 4;
  @Input() paginateDetails: boolean = false;
  @Input() showPaginate: boolean = false;
  @Input() tableClass: string;
  @Input() search: boolean = true;
  @Input() pagination: boolean = true;
  @Input() selectedRows: boolean = false;
  @Input() rowDetails: boolean = false;
  @Input() dateFilter: boolean = false;
  @Input() initialDateFilter: string = ''; // Filtro inicial de fecha
  @Input() downloadReports: boolean = false;
  @Input() searchPlaceholder: string = '';
  
  // Propiedades específicas para cada botón de exportación
  @Input() showCopyButton: boolean = true;
  @Input() showCsvButton: boolean = true;
  @Input() showExcelButton: boolean = true;
  @Input() showPdfButton: boolean = true;
  @Input() showPrintButton: boolean = true;
  
  // Alternativa: Array de botones a mostrar ['copy', 'csv', 'excel', 'pdf', 'print']
  @Input() exportButtons: string[] = [];
  
  // Botones personalizados adicionales
  @Input() customButtons: CustomButton[] = [];
  
  @Output() action = new EventEmitter<TableClickedAction>();
  @Output() customAction = new EventEmitter<{action: string, data?: any}>();
  @Output() dateFilterChange = new EventEmitter<string>();
  @Output() selectedRowsChange = new EventEmitter<any[]>()

  public tableData$: Observable<any>;
  public total$: Observable<number>;
  public selected: number[] = [];
  // Use strings for ids internally to avoid type mismatches
  public selectedIds: string[] = [];
  public paginate: Pagination; // Pagination use only
  public tableData: any;
  public pageNo: number = 1
  public sortValue: string = 'asc';
  public sortable_key: string;
  public searchText: string = '';
  public rowDetailOpen: boolean = false;
  public selectedOpenRows: number[] = [];
  public dateDropdownOpen: boolean = false;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  public filter = {
    search: '',
    sort: 'asc',
    page: this.pageNo,
    pageSize: this.pageSize,
    date: {
      start_date: '',
      to_date: ''
    }
  }

  public pageSizeOptions: PageSizeOptions[] = [
    { title: 10, value: 10 },
    { title: 15, value: 15 },
    { title: 25, value: 25 },
    { title: 50, value: 50 },
    { title: 100, value: 100 }
  ]

  public selectedDate: string = '';
  public selectedValue: string = '';

  constructor(public tableService: TableService, private modal: NgbModal, private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter, private cdr: ChangeDetectorRef) {    
  }

  // Métodos helper para determinar qué botones mostrar
  shouldShowButton(buttonType: string): boolean {
    // Si se especifica exportButtons, usar esa lista
    if (this.exportButtons && this.exportButtons.length > 0) {
      return this.exportButtons.includes(buttonType);
    }
    
    // Si no, usar las propiedades individuales
    switch (buttonType) {
      case 'copy': return this.showCopyButton;
      case 'csv': return this.showCsvButton;
      case 'excel': return this.showExcelButton;
      case 'pdf': return this.showPdfButton;
      case 'print': return this.showPrintButton;
      default: return true;
    }
  }

  // Método para manejar botones personalizados
  handleCustomAction(action: string) {
    this.customAction.emit({ action: action, data: this.tableConfig.data });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) {
      this.filter['pageSize'] = changes['pageSize'].currentValue;

      if (!this.pageSizeOptions.some(option => option.value === this.filter['pageSize'])) {
        const index = this.pageSizeOptions.findIndex(option => option.value > this.filter['pageSize']);
    
        const newOption = { title: this.filter['pageSize'], value: this.filter['pageSize'] , selected: true };
    
        if (index === -1) {
          this.pageSizeOptions.push(newOption);
        } else {
          this.pageSizeOptions.splice(index, 0, newOption);
        }
      }
    }

    // Inicializar con el filtro de fecha proporcionado
    if (changes['initialDateFilter'] && changes['initialDateFilter'].currentValue) {
      this.selectedValue = changes['initialDateFilter'].currentValue;
      this.handleDateFilter(this.selectedValue);
    }

    if (changes['tableConfig'] && this.tableConfig && this.tableConfig.data) {
      // Use `selectedRows` input to determine whether selection should be initialized
      if (this.selectedRows) {
        const preselected = this.tableConfig.data
          .filter((r: any) => r && (r.is_checked === true || r.is_checked === 1))
          .map((r: any) => String(this.getRowId(r)))
          .filter((id: any) => id && id !== 'null');
        if (preselected && preselected.length) {
          this.selectedIds = Array.from(new Set(preselected));
          this.tableConfig.data.forEach((row: any) => {
            const rid = this.getRowId(row);
            row.is_checked = rid != null && this.selectedIds.includes(String(rid));
          });
          const selectedRowsData = this.tableConfig.data.filter((row: any) => {
            const rid = this.getRowId(row);
            return rid != null && this.selectedIds.includes(String(rid));
          });
          this.selectedRowsChange.emit(selectedRowsData);
        }
      } else {
        // If selection disabled, ensure no selectedIds remain
        this.selectedIds = [];
        // Also ensure rows do not have is_checked forced
        this.tableConfig.data.forEach((row: any) => {
          if (row) row.is_checked = false;
        });
      }
      this.paginateData();
      this.cdr.detectChanges();
    }

    if (changes['pageNo']) {
      this.paginateData();
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getNestedPropertyValue(dataField: string | undefined, columnData: any): string {
    if (!dataField) {
      return '';
    }

    let keys = dataField.split('.');
    let value = columnData;

    for (let key of keys) {
      if (value && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return '';
      }
    }

    return value;
  }

  getColumnClass(template: string, details: any) {
    for(let key in details) {
      if(template.includes(key)) {
        const value = details[key];
          template = template.replace(key, value);
      }
    }
    return template
  }

  checkUncheckAll(event: Event) {
    const checked = (<HTMLInputElement>event?.target)?.checked;
    this.tableConfig.data.forEach((item: any) => {
      item.is_checked = checked;
      this.setSelectedItem(checked, this.getRowId(item));
    });
  }

  onItemChecked(event: Event) {
    const input = (<HTMLInputElement>event.target);
    // Stop propagation is handled in template; here we just forward id
    this.setSelectedItem(input.checked, input.value);
  }
  // Helper to get a stable id from a row
  getRowId(row: any): any {
    if (!row) return null;
    return row.CONSOLIDADO_ID ?? row.ACTIVIDAD_ID ?? row.id ?? row.ID ?? row.Id ?? row.key ?? null;
  }

  // Toggle selection for a full row (used when clicking the row)
  toggleRowSelection(row: any) {
    const id = this.getRowId(row);
    if (id == null) return;
    const isSelected = this.selectedIds.includes(String(id));
    this.setSelectedItem(!isSelected, id);
  }

  setSelectedItem(checked: Boolean, value: any) {
    const idStr = value == null ? '' : String(value);
    const index = this.selectedIds.indexOf(idStr);
    if (checked) {
      if (index === -1) this.selectedIds.push(idStr);
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== idStr);
    }

    // Update selected flag on rows for UI (checkboxes)
    this.tableConfig.data.forEach((row: any) => {
      const rid = this.getRowId(row);
      row.is_checked = rid != null && this.selectedIds.includes(String(rid));
    });

    // Emit actual selected row objects
    const selectedRowsData = this.tableConfig.data.filter(row => {
      const rid = this.getRowId(row);
      return rid != null && this.selectedIds.includes(String(rid));
    });
    this.selectedRowsChange.emit(selectedRowsData);
  }

  onSort(field: string) {
    this.sortable_key = field;
    this.filter['page'] = 1;
    this.filter['sort'] == 'asc' ? this.filter['sort'] = 'desc' : this.filter['sort'] = 'asc';
    this.applyFilters();
  }

  paginateData() {
    if (this.tableConfig && this.tableConfig.data) {
      this.applyFilters();
    }
  }

  setPage(data: number) {
    this.filter['page'] = data;
    this.paginateData();
  }

  searchTerm(value: string) {
    this.filter['page'] = 1;
    this.filter['search'] = value;
    this.applyFilters();
  }

  handleSelect(event: any) {
    this.filter['pageSize'] = +event.target.value;
    this.applyFilters();
  }

  handleAction(value: TableRows, details: any) {
    if(value.action_to_perform == 'delete') {
      if(!value.modal) {
        this.action.emit({action_to_perform: value.action_to_perform, data: details})
      } else {
        Swal.fire({
          title: 'Are you sure?',
          text: value.model_text ? value.model_text : 'Do you really want to delete the product?',
          imageUrl: 'assets/images/gif/trash.gif',
          confirmButtonText: 'Yes, delete it!',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#FC4438'
        }).then((result) => {
          if(result.isConfirmed) {
            this.action.emit({action_to_perform: value.action_to_perform, data: details})
          }
        })
      }
    } else {
      // Manejar cualquier otra acción personalizada
      this.action.emit({action_to_perform: value.action_to_perform, data: details})
    }
  }

  openRowDetails(id: number) {
    const index = this.selectedOpenRows.indexOf(id);

    if (index === -1) {
      this.selectedOpenRows.push(id);
    } else {
      this.selectedOpenRows = this.selectedOpenRows.filter(rowId => rowId !== id);
    }
  }

  getColSpan() {
    const columnLength = this.tableConfig.columns.length;
    const actionLength = this.tableConfig.row_action ? 1 : 0;
    const isCheckbox = this.hasCheckbox ? 1 : 0;
    const isRowDetails = this.rowDetails ? 1 : 0;

    return columnLength + actionLength + isCheckbox + isRowDetails;
  }

  handleDropdown() {
    this.dateDropdownOpen =! this.dateDropdownOpen;
  }

  handleDateFilter(value: string) {
    this.selectedValue = value;
    let today = new Date();
    let formattedDate = today.getFullYear() + '-' 
               + String(today.getMonth() + 1).padStart(2, '0') + '-' 
               + String(today.getDate()).padStart(2, '0');

    if(this.selectedValue) {
      if (this.selectedValue === 'today') {
        this.filter['date']['start_date'] = formattedDate;
        this.filter['date']['to_date'] = formattedDate;
      } else if (this.selectedValue === 'yesterday') {
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        formattedDate = yesterday.getFullYear() + '-' 
                      + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' 
                      + String(yesterday.getDate()).padStart(2, '0');
        this.filter['date']['start_date'] = formattedDate;
        this.filter['date']['to_date'] = formattedDate;
      } else if (this.selectedValue === '7_days') {
        let sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        formattedDate = sevenDaysAgo.getFullYear() + '-' 
                      + String(sevenDaysAgo.getMonth() + 1).padStart(2, '0') + '-' 
                      + String(sevenDaysAgo.getDate()).padStart(2, '0');
        this.filter['date']['start_date'] = formattedDate;
        this.filter['date']['to_date'] = today.getFullYear() + '-' 
                                          + String(today.getMonth() + 1).padStart(2, '0') + '-' 
                                          + String(today.getDate()).padStart(2, '0');
      } else if (this.selectedValue === '30_days') {
        let thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        formattedDate = thirtyDaysAgo.getFullYear() + '-' 
                      + String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0') + '-' 
                      + String(thirtyDaysAgo.getDate()).padStart(2, '0');
        this.filter['date']['start_date'] = formattedDate;
        this.filter['date']['to_date'] = today.getFullYear() + '-' 
                                          + String(today.getMonth() + 1).padStart(2, '0') + '-' 
                                          + String(today.getDate()).padStart(2, '0');
      } else if (this.selectedValue === 'this_month') {
        let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let formattedStartDate = startOfMonth.getFullYear() + '-' 
                                + String(startOfMonth.getMonth() + 1).padStart(2, '0') + '-' 
                                + String(startOfMonth.getDate()).padStart(2, '0');
        
        let formattedEndDate = today.getFullYear() + '-' 
                              + String(today.getMonth() + 1).padStart(2, '0') + '-' 
                              + String(today.getDate()).padStart(2, '0');
        
        this.filter['date']['start_date'] = formattedStartDate;
        this.filter['date']['to_date'] = formattedEndDate;
      } else if (this.selectedValue === 'last_month') {
        let firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        let lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        formattedDate = firstDayLastMonth.getFullYear() + '-' 
                      + String(firstDayLastMonth.getMonth() + 1).padStart(2, '0') + '-' 
                      + String(firstDayLastMonth.getDate()).padStart(2, '0');
        this.filter['date']['start_date'] = formattedDate;
        formattedDate = lastDayLastMonth.getFullYear() + '-' 
                      + String(lastDayLastMonth.getMonth() + 1).padStart(2, '0') + '-' 
                      + String(lastDayLastMonth.getDate()).padStart(2, '0');
        this.filter['date']['to_date'] = formattedDate;
      }
    }

    this.selectedDate = `${this.filter['date']['start_date']} - ${this.filter['date']['to_date']}` 
    this.dateDropdownOpen = false;
    this.applyFilters();

    // Imprimir el rango seleccionado en consola
    console.log('Rango de fechas seleccionado:', this.selectedDate);

    // Emitir el evento de cambio de filtro de fecha
    this.dateFilterChange.emit(this.selectedValue);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate || (this.fromDate && this.toDate)) {
      this.fromDate = date;
      this.toDate = null;
    } else if (this.fromDate && !this.toDate) {
      if (date.after(this.fromDate)) {
        this.toDate = date;
        this.filter['date']['start_date'] = `${this.fromDate.year}-${String(this.fromDate.month).padStart(2, '0')}-${String(this.fromDate.day).padStart(2, '0')}`;
        this.filter['date']['to_date'] = `${this.toDate.year}-${String(this.toDate.month).padStart(2, '0')}-${String(this.toDate.day).padStart(2, '0')}`;
        this.selectedDate = `${this.filter['date']['start_date']} - ${this.filter['date']['to_date']}`;
      } else {
        this.fromDate = date;
      }
    }

    if(this.fromDate && this.toDate) {
      this.selectedValue = '';
    }

    this.applyFilters();
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  applyFilters() {
    let filteredData = [...this.tableConfig.data];
  
    // Search filter
    if (this.filter['search'].trim() !== '') {
      filteredData = filteredData.filter((item: any) => {
        return Object.keys(item).some(key => {
          const value = item[key];
          
          // Validar que el valor no sea null o undefined
          if (value === null || value === undefined) {
            return false;
          }
          
          if (typeof value === 'string') {
            if (value.toLowerCase().includes(this.filter['search'].toLowerCase())) {
              return true;
            }
          } else if (typeof value === 'number') {
            if (value.toString().includes(this.filter['search'])) {
              return true;
            }
          } else if (typeof value === 'object') {
            try {
              const valueString = value.toString();
              if (valueString.toLowerCase().includes(this.filter['search'].toLowerCase())) {
                return true;
              }
            } catch (error) {
              // Si hay error al convertir a string, simplemente ignorar
              return false;
            }
          }
    
          return false;
        });
      });
    }
    
    // Sorting filter
    if (this.filter['sort']) {
      filteredData.sort((a: any, b: any): number => {
        const valueA = a[this.sortable_key];
        const valueB = b[this.sortable_key];
        const getTextContent = (value: any): string => {
          if (typeof value === 'string') {
            return value;
          }
          if (typeof value === 'object') {
            const div = document.createElement('div');
            div.innerHTML = value.toString(); 
            return div.textContent || div.innerText || ''; 
          }
          return '';
        };
        const textA = getTextContent(valueA);
        const textB = getTextContent(valueB);
        if ((typeof valueA === 'string' || typeof valueA === 'object') &&
            (typeof valueB === 'string' || typeof valueB === 'object')) {
          return this.filter['sort'] === 'asc'
            ? textA.localeCompare(textB)
            : textB.localeCompare(textA);
        }
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.filter['sort'] === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }
    
        return 0;
      });
    }
    
    // Date range filter
    if (this.filter['date']['start_date']) {
      filteredData = filteredData.filter((data: any) => {
        if (data && data.date) {
          const recordDate = new Date(data.date);
          const fromDate = new Date(this.filter['date']['start_date']);
          const toDate = this.filter['date']['to_date'] ? new Date(this.filter['date']['to_date']) : null;
  
          if (fromDate && toDate) {
            return recordDate >= fromDate && recordDate <= toDate;
          } else if (fromDate) {
            return recordDate >= fromDate;
          } else if (toDate) {
            return recordDate <= toDate;
          }
        }
        return true;
      });
    }
  
    // Pagination
    this.paginate = this.tableService.getPager(filteredData.length, this.filter['page'], this.filter['pageSize']);
    this.tableData = filteredData.slice(this.paginate.start_index, this.paginate.end_index + 1);
  }

  // Método para exportar datos
  exportData(type: string) {
    const data = this.getExportData();
    
    switch (type) {
      case 'copy':
        this.copyToClipboard(data);
        break;
      case 'csv':
        this.exportToCSV(data);
        break;
      case 'excel':
        this.exportToExcel(data);
        break;
      case 'pdf':
        this.exportToPDF(data);
        break;
      case 'print':
        this.printData(data);
        break;
    }
  }

  // Obtener datos para exportar (sin HTML)
  private getExportData() {
    const headers = this.tableConfig.columns
      .filter(col => !col.hide_column)
      .map(col => col.title);
    
    const rows = this.tableConfig.data.map(item => {
      return this.tableConfig.columns
        .filter(col => !col.hide_column)
        .map(col => {
          let value = item[col.field_value];
          // Remover HTML tags si existen
          if (typeof value === 'string') {
            value = value.replace(/<[^>]*>/g, '').trim();
          }
          return value || '';
        });
    });

    return { headers, rows };
  }

  // Copiar al portapapeles
  private copyToClipboard(data: any) {
    const text = [data.headers, ...data.rows]
      .map(row => row.join('\t'))
      .join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Datos copiados al portapapeles');
    });
  }

  // Exportar a CSV
  private exportToCSV(data: any) {
    const csvContent = [data.headers, ...data.rows]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exportar a Excel (implementación básica)
  private exportToExcel(data: any) {
    try {
      // Intentar usar xlsx si está disponible
      const XLSX = (window as any).XLSX;
      if (XLSX) {
        const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'export.xlsx');
      } else {
        // Fallback a CSV si xlsx no está disponible
        this.exportToCSV(data);
        alert('Excel no disponible, exportando como CSV');
      }
    } catch (error) {
      this.exportToCSV(data);
      alert('Error al exportar Excel, exportando como CSV');
    }
  }

  // Exportar a PDF (implementación básica)
  private exportToPDF(data: any) {
    try {
      const jsPDF = (window as any).jspdf?.jsPDF;
      if (jsPDF) {
        const doc = new jsPDF();
        doc.text('Reporte de Datos', 20, 20);
        
        // Usar autoTable si está disponible
        if (doc.autoTable) {
          doc.autoTable({
            head: [data.headers],
            body: data.rows,
            startY: 30,
          });
        } else {
          // Implementación básica de texto
          let y = 40;
          data.rows.forEach((row: any) => {
            doc.text(row.join(' | '), 20, y);
            y += 10;
          });
        }
        
        doc.save('export.pdf');
      } else {
        alert('PDF no disponible, use otra opción de exportación');
      }
    } catch (error) {
      alert('Error al exportar PDF');
    }
  }

  // Imprimir datos
  private printData(data: any) {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      const tableHTML = `
        <html>
          <head>
            <title>Reporte</title>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Reporte de Datos</h2>
            <table>
              <thead>
                <tr>${data.headers.map((h: string) => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.rows.map((row: any[]) => `<tr>${row.map((cell: any) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      printWindow.document.write(tableHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Manejar cambios en los selects
  onSelectChange(event: Event, column: any, rowData: any) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    
    // Emitir el evento con la información del cambio
    this.action.emit({
      action_to_perform: column.field_value + '_change',
      data: rowData,
      value: selectedValue
    });
  }
}
