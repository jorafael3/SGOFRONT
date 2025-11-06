import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { FacturacionService } from '../../../services/logistica/facturacion.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tracking-facturas',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './tracking-facturas.component.html',
  styleUrl: './tracking-facturas.component.scss'
})
export class TrackingFacturasComponent {
  public sessionData: any = null; // Datos de sesión del usuario actual

  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  // Datos de la factura
  facturaActual: any = null;
  detalleFactura: any[] = [];
  seriesData: any[] = [];
  isLoadingSeries: boolean = false;
  showModalSeries: boolean = false;

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel'];

  secuenciafactura: string = '';
  MostrarDetalleFactura: boolean = false;

  public customButtons: CustomButton[] = [
    {
      label: '',
      action: 'refresh',
      icon: 'fa fa-refresh',
      class: 'btn btn-success',
      tooltip: 'Actualizar datos de la tabla'
    }
  ];

  public tableConfig: TableConfigs = {
    columns: [
      { title: 'Sucursal', field_value: 'FACTURA_SUCURSAL', sort: true },
      { title: 'Bodega', field_value: 'CODIGOS_BODEGA_TEXTO', sort: true },
      { title: 'Cliente', field_value: 'CLIENTE_NOMBRE_TEXTO', sort: true },
      { title: 'Factura', field_value: 'FACTURA_SECUENCIA_TEXTO', sort: true },
      { title: 'Fecha', field_value: 'FACTURA_FECHA', sort: true },
      { title: 'Tipo Pedido', field_value: 'ORDEN_TIPO_PEDIDO', sort: true },
      { title: 'Multibodega', field_value: 'MULTIBODEGA', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'preparar_factura',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Preparar Factura'
      }
    ],
    data: []
  };

  constructor(private FacturacionService: FacturacionService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    // Inicializar fechas personalizada con el inicio de mes y la fecha actual
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaPersonalizadaInicio = inicioMes.toISOString().slice(0, 10);
    this.fechaPersonalizadaFin = hoy.toISOString().slice(0, 10);
    this.loadSessionData();
  }

  loadSessionData(): void {
    this.sessionData = this.FacturacionService.getUserSessionData();
    console.log('this.sessionData: ', this.sessionData);
  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };

    console.log('param: ', param);

    this.FacturacionService.GetFacturasPorPreparar(param).subscribe({
      next: (response) => {
        console.log('response: ', response);

        if (response.success && response.data) {
          // Forzar cambio de referencia para disparar ngOnChanges en TableComponent
          this.Usuarios_Datos = response.data;
          this.OnFillTableAction();
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.log('error: ', error);
        this.isLoading = false;
      }
    });
  }

  OnFillTableAction() {
    this.Usuarios_Datos.map(function (x) {
      x.FACTURA_SUCURSAL = `<span class="fw-bold badge badge-secondary fs-6">${x.FACTURA_SUCURSAL}</span>`;
      x.MULTIBODEGA = `<span class="fs-6 badge bg-${x.MULTIBODEGA === 'SI' ? 'primary' : 'secondary'} fw-bold">${x.MULTIBODEGA}</span>`;
      x.FACTURA_SECUENCIA_TEXTO = `<span class="badge bg-dark fs-6 fw-bold">${x.FACTURA_SECUENCIA}</span>`;
      x.CODIGOS_BODEGA_TEXTO = `<span class="fw-bold">${x.CODIGOS_BODEGA}</span>`;
      x.CLIENTE_NOMBRE_TEXTO = `<span class="fw-bold">${x.CLIENTE_NOMBRE}</span>`;
      x.FACTURA_FECHA = `<span class="fw-bold">${x.FACTURA_FECHA}</span>`;
      x.ORDEN_TIPO_PEDIDO = `<span class="badge badge-info fs-6 fw-bold">${x.ORDEN_TIPO_PEDIDO}</span>`;
    });

    this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };
  }

  //** ACCIONES DE LOS BOTONES DE LA TABLA */
  onTableAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'preparar_factura':
        this.onPrepararFactura(action.data);
        break;
      default:
    }
  }

  onPrepararFactura(data: any) {
    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.ID_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };
    console.log('param: ', param);
  }

  onbuscarFactura() {
    if (!this.secuenciafactura || this.secuenciafactura.trim() === '') {
      Swal.fire("Error!", "Por favor ingrese una secuencia de factura", "warning");
      return;
    }

    this.isLoading = true;
    let param = {
      secuencia: this.secuenciafactura.trim(),
      usrid: this.sessionData ? this.sessionData.usrid : null
    };
    console.log('param: ', param);

    this.FacturacionService.GetFacturasTracking(param).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        if (response.success && response.data && response.data.length > 0) {
          this.facturaActual = response.data[0];
          this.detalleFactura = response.detalle || [];
          this.MostrarDetalleFactura = true;
        } else {
          Swal.fire("Error!", "No se encontró información de la factura", "error");
          this.MostrarDetalleFactura = false;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log('error: ', error);
        Swal.fire("Error!", "Ocurrió un error al buscar la factura", "error");
        this.isLoading = false;
        this.MostrarDetalleFactura = false;
      }
    });
  }

  onCustomAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'refresh':
        this.onRefreshTableData();
        break;
      default:
    }
  }

  onRefreshTableData() {
    this.loadTableData();
  }

  // Obtener códigos únicos de bodega del detalle
  getBodegasUnicas(): string[] {
    if (!this.detalleFactura || this.detalleFactura.length === 0) {
      return [];
    }
    
    const bodegas = this.detalleFactura.map(item => item.bodega_codigo);
    return [...new Set(bodegas)]; // Eliminar duplicados
  }

  // Verificar si la factura es multibodega
  isMultibodega(): boolean {
    return this.getBodegasUnicas().length > 1;
  }

  // Obtener string de bodegas para mostrar
  getBodegasString(): string {
    return this.getBodegasUnicas().join(', ');
  }

  // Agrupar detalle por bodega para la tabla de tracking
  getDetalleAgrupadoPorBodega(): any[] {
    if (!this.detalleFactura || this.detalleFactura.length === 0) {
      return [];
    }

    const agrupado: { [key: string]: any } = {};
    
    this.detalleFactura.forEach(item => {
      const codigoBodega = item.bodega_codigo;
      
      if (!agrupado[codigoBodega]) {
        // Primera vez que vemos esta bodega, crear el grupo
        agrupado[codigoBodega] = {
          bodega_codigo: item.bodega_codigo,
          bodega_nombre: item.bodega_nombre,
          fl_estado: item.fl_estado,
          fl_preparadapor: item.fl_preparadapor,
          fl_preparadafecha: item.fl_preparadafecha,
          fl_verificadapor: item.fl_verificadapor,
          fl_verificadafecha: item.fl_verificadafecha,
          fl_guiaconsolidado: item.fl_guiaconsolidado,
          fl_guiaconsolidadofecha: item.fl_guiaconsolidadofecha,
          fl_guiaconsolidadopor: item.fl_guiaconsolidadopor,
          fl_guiadespachofinal: item.fl_guiadespachofinal,
          fl_guiadespachofinalfecha: item.fl_guiadespachofinalfecha,
          fl_guiadespachofinalpor: item.fl_guiadespachofinalpor,
          productos_count: 1,
          total_factura: parseFloat(item.factura_total)
        };
      } else {
        // Ya existe esta bodega, solo aumentamos el contador y total
        agrupado[codigoBodega].productos_count++;
        agrupado[codigoBodega].total_factura += parseFloat(item.factura_total);
      }
    });

    // Convertir el objeto a array
    return Object.values(agrupado);
  }

  verSeries() {
    if (!this.facturaActual || !this.facturaActual.Id) {
      Swal.fire("Error!", "No hay factura seleccionada", "warning");
      return;
    }

    this.isLoadingSeries = true;
    this.seriesData = [];
    this.showModalSeries = true;

    const param = {
      factura_id: this.facturaActual.Id
    };
    console.log('param: ', param);

    this.FacturacionService.GetFacturasSeries(param).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        this.isLoadingSeries = false;
        
        if (response.success && response.data && response.data.length > 0) {
          // Procesar los datos para separar las series
          this.seriesData = response.data.map((item: any) => ({
            ...item,
            series_array: item.series ? item.series.split('/') : []
          }));
        } else {
          this.seriesData = [];
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.isLoadingSeries = false;
        this.seriesData = [];
        Swal.fire("Error!", "Ocurrió un error al buscar las series", "error");
      }
    });
  }

  cerrarModalSeries() {
    this.showModalSeries = false;
    this.seriesData = [];
    this.isLoadingSeries = false;
  }
}
