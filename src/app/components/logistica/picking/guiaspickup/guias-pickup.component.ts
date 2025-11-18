import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import { FacturacionService } from '../../../../services/logistica/facturacion.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { count } from 'rxjs';

// import { navigation } from '../../../shared/data/faq';

@Component({
  selector: 'app-guias-pickup',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './guias-pickup.component.html',
  styleUrl: './guias-pickup.component.scss'
})
export class GuiasPickupComponent {
  showPrepararModal: boolean = false;
  showDetalleguiaComputronModal: boolean = false;
  public sessionData: any = null; // Datos de sesión del usuario actual

  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  // Datos del modal
  facturaSeleccionada: any = null;
  facturaActual: any = null;
  facturaRowData: any = null; // Datos de la fila seleccionada de la tabla
  detalleFactura: any[] = [];

  // Datos de envío
  transporteSeleccionado: string = '';
  numeroGuia: string = '';
  numeroBultos: number | null = null;
  pesoEnvio: string = '';
  comentariosEnvio: string = '';

  // Consolidación
  consolidar: boolean = false;
  tipoConsolidacion: string = '';
  guiaConsolidacion: string = '';

  // Guías por bodega
  bodegas: any[] = [];
  guiasPorBodega: { bodega: string, guia: string }[] = [];

  // Lista de transportes disponibles
  listaTransportes: any[] = [];
  cargandoTransportes: boolean = false;
  empresa: string = '';

  // Mapa para almacenar los valores seleccionados en el select de transporte
  transportesSeleccionados: { [key: string]: string } = {};

  // Lista de opciones de consolidación (quemada por el momento)
  opcionesConsolidacion = [
    { id: 'consolidacion_1', nombre: 'Consolidación Centro' },
    { id: 'consolidacion_2', nombre: 'Consolidación Norte' },
    { id: 'consolidacion_3', nombre: 'Consolidación Sur' },
    { id: 'consolidacion_4', nombre: 'Consolidación Express' },
    { id: 'consolidacion_5', nombre: 'Consolidación Económica' }
  ];

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel'];

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
      { title: 'Multibodega', field_value: 'MULTIBODEGA_TEXTO', sort: true },
      { title: 'Consolidar', field_value: 'CONSOLIDAR_FACTURA_TEXTO', sort: true },
      {
        title: 'Tipo Pedido',
        field_value: 'ORDEN_TIPO_PEDIDO',
        type: 'select',
        options: [
          // { label: 'MOSTRADOR-GYE', value: 'MOSTRADOR-GYE' },
          // { label: 'MOSTRADOR-UIO', value: 'MOSTRADOR-UIO' },
          // { label: 'CUIDAD-GYE', value: 'CUIDAD-GYE' },
          // { label: 'CUIDAD-UIO', value: 'CUIDAD-UIO' },
          // { label: 'PROVINCIA', value: 'PROVINCIA' },
          // // Agregar más opciones si vienen otros valores de la BD
          // { label: 'OTRO', value: 'OTRO' }
        ],
        sort: false
      },
      { title: 'Estado', field_value: 'FACTURA_BLOQUEADA_TEXTO', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'detalle_factura',
        icon: 'eye',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Ingresar Guia'
      }
    ],
    data: []
  };

  public tableConfigCComputron: TableConfigs = {
    columns: [
      { title: 'Sucursal', field_value: 'FACTURA_SUCURSAL', sort: true },
      { title: 'Bodega Facturación', field_value: 'CODIGOS_BODEGA_TEXTO', sort: true },
      { title: 'Cliente', field_value: 'CLIENTE_NOMBRE_TEXTO', sort: true },
      { title: 'Factura', field_value: 'FACTURA_SECUENCIA_TEXTO', sort: true },
      { title: 'Fecha Factura', field_value: 'FACTURA_FECHA', sort: true },
      { title: 'Multibodega', field_value: 'MULTIBODEGA_TEXTO', sort: true },
      // { title: 'Consolidar', field_value: 'CONSOLIDAR_FACTURA_TEXTO', sort: true },
      {
        title: 'Tipo Pedido',
        field_value: 'ORDEN_TIPO_PEDIDO',
        sort: false
      },
      { title: 'Factura Total', field_value: 'FACTURA_TOTAL_TEXTO', sort: true },
      { title: 'Factura Saldo', field_value: 'FACTURA_SALDO_TEXTO', sort: true },
      { title: 'Bodega de Retiro', field_value: 'FACTURA_BODEGA_RETIRO_TEXTO', sort: true },
      { title: 'Comentario', field_value: 'FACTURA_COMENTARIO', sort: true },
      { title: 'Estado', field_value: 'FACTURA_ESTADO_TEXTO', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'detalle_factura',
        icon: 'eye',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Ingresar Guia'
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
    this.loadTableData();

  }

  loadSessionData(): void {
    this.sessionData = this.FacturacionService.getUserSessionData();
    this.empresa = this.sessionData ? this.sessionData.empleado_empresa : '';
    console.log('this.sessionData: ', this.sessionData);
  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };


    this.FacturacionService.GetFacturasPorGuiasPickup(param).subscribe({
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


        this.isLoading = false;
      }
    });
  }


  OnFillTableAction() {
    // Crear opciones dinámicas basadas en los valores únicos de la BD
    this.actualizarOpcionesSelect();


    if (this.empresa === 'COMPUTRON') {
      this.Usuarios_Datos.map(function (x) {
        // x.ORDEN_TIPO_PEDIDO = `<span class="badge badge-info fs-6 fw-bold">${x.ORDEN_TIPO_PEDIDO}</span>`;
        x.FACTURA_SUCURSAL = `<span class="fw-bold badge badge-secondary fs-6">${x.FACTURA_SUCURSAL}</span>`;
        x.CODIGOS_BODEGA_TEXTO = `<span title="${x.BODEGA_CODIGO}-${x.BODEGA_NOMBRE}" class="fw-bold">${x.BODEGA_CODIGO}</span><br><span class="fw-bold text-muted">${x.BODEGA_NOMBRE}</span>`;
        x.CLIENTE_NOMBRE_TEXTO = `<span class="fw-bold">${x.CLIENTE_NOMBRE}</span>`;
        x.FACTURA_SECUENCIA_TEXTO = `<span class="badge bg-dark fs-6 fw-bold">${x.FACTURA_SECUENCIA}</span>`;
        x.FACTURA_FECHA = `<span class="fw-bold">${x.FACTURA_FECHA}</span>`;
        x.MULTIBODEGA_TEXTO = `<span class="fs-6 badge bg-${x.MULTIBODEGA === 'SI' ? 'primary' : 'secondary'} fw-bold">${x.MULTIBODEGA}</span>`;
        x.ORDEN_TIPO_PEDIDO = `<span class="badge badge-info fs-6 fw-bold">${x.ORDEN_TIPO_PEDIDO}</span>`;
        x.FACTURA_TOTAL_TEXTO = `<span class="fw-bold ` + (x.FACTURA_SALDO > 0 ? 'text-danger' : '') + ` fs-6">${new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(x.FACTURA_TOTAL)
          }</span>`;
        x.FACTURA_SALDO_TEXTO = `<span class="fw-bold ` + (x.FACTURA_SALDO > 0 ? 'text-danger' : '') + ` fs-6">${new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(x.FACTURA_SALDO)
          }</span>`;
        x.FACTURA_BODEGA_RETIRO_TEXTO = `<span class="fw-bold">${x.SISCO_BODEGA_RETIRO}</span>`;
        x.FACTURA_COMENTARIO = x.SISCO_COMENTARIO;
        x.FACTURA_ESTADO_TEXTO = `<span class="fw-bold ` + (x.ACTIVAR_LINK == 1 ? 'text-success' : 'text-danger') + `">` + x.FACTURA_ESTADO + `</span>`;
      });
      this.tableConfig = { ...this.tableConfigCComputron, data: this.Usuarios_Datos };
    }

    if (this.empresa === 'CARTIMEX') {
      this.Usuarios_Datos.map(function (x) {
        // let IDS_BODEGA = x.IDS_BODEGA.split(',');
        // let ID_PREPARADAS = x.IDS_PREPARADAS.split(',');
        let CODIGOS_VERIFICADAS = x.CODIGOS_VERIFICADAS.split(',');
        let CODIGOS_CONSOLIDADAS = x.CODIGOS_CONSOLIDADAS.split(',');
        let BODEGAS_ENFACTURA = x.BODEGAS_ENFACTURA.split(',');
        let TEXTO_BODEGAS = "";
        for (let i = 0; i < CODIGOS_VERIFICADAS.length; i++) {
          if (CODIGOS_VERIFICADAS[i] && CODIGOS_VERIFICADAS[i] != '') {
            TEXTO_BODEGAS += `<span class="fw-bold">${CODIGOS_VERIFICADAS[i]}</span><br>`
          }
        }
        for (let i = 0; i < CODIGOS_CONSOLIDADAS.length; i++) {
          if (CODIGOS_CONSOLIDADAS[i] && CODIGOS_CONSOLIDADAS[i] != '') {
            TEXTO_BODEGAS += `<span class="fw-bold">${CODIGOS_CONSOLIDADAS[i]}</span><br>`
          }
        }

        // Mantener el valor original que viene de la base de datos
        // Si no hay valor en la BD, usar un valor por defecto
        if (!x.ORDEN_TIPO_PEDIDO || x.ORDEN_TIPO_PEDIDO === '' || x.ORDEN_TIPO_PEDIDO === null) {
          x.ORDEN_TIPO_PEDIDO = 'MOSTRADOR-GYE'; // Solo si está vacío
        }
        // Si tiene valor, lo mantiene tal como viene de la BD



        // x.ORDEN_TIPO_PEDIDO = `<span class="badge badge-info fs-6 fw-bold">${x.ORDEN_TIPO_PEDIDO}</span>`;
        x.FACTURA_SUCURSAL = `<span class="fw-bold badge badge-secondary fs-6">${x.FACTURA_SUCURSAL}</span>`;
        x.CONSOLIDAR_FACTURA_TEXTO = `<span class="fs-6 badge bg-${x.CONSOLIDAR_FACTURA == 1 ? 'danger' : 'secondary'} fw-bold">${x.CONSOLIDAR_FACTURA == 1 ? 'SI' : 'NO'}</span>`;
        x.CODIGOS_BODEGA_TEXTO = `<span title="${x.BODEGAS_ENFACTURA}" class="fw-bold">${TEXTO_BODEGAS}</span>`;
        x.FACTURA_SECUENCIA_TEXTO = `<span class="badge bg-dark fs-6 fw-bold">${x.FACTURA_SECUENCIA}</span>`;
        x.MULTIBODEGA_TEXTO = `<span class="fs-6 badge bg-${x.MULTIBODEGA === 'SI' ? 'primary' : 'secondary'} fw-bold">${x.MULTIBODEGA}</span>`;
        x.CLIENTE_NOMBRE_TEXTO = `<span class="fw-bold">${x.CLIENTE_NOMBRE}</span>`;
        x.FACTURA_FECHA = `<span class="fw-bold">${x.FACTURA_FECHA}</span>`;
        // x.FACTURA_BLOQUEADA_TEXTO = `<span class="fs-6 badge bg-${x.FACTURA_BLOQUEADA == '0' ? 'success' : 'danger'} fw-bold">${x.FACTURA_BLOQUEADA == 1 ? 'Bloqueada' : 'Desbloqueada'}</span>`;



        x.FACTURA_BLOQUEADA_TEXTO = (
          x.FACTURA_BLOQUEADA == 1
            ? () => `<span class="fs-6 badge bg-danger fw-bold">Bloqueada</span>`
            : () => {
              if (x.CENTRO_CONSOLIDADO == 1 && x.CONSOLIDAR_FACTURA == 1 && (CODIGOS_VERIFICADAS.length + CODIGOS_CONSOLIDADAS.length) != BODEGAS_ENFACTURA.length) {
                return `<span class="fs-6 badge bg-danger fw-bold">Espera Consolidación</span>`;
              } else if (x.CENTRO_CONSOLIDADO == 1 && x.CONSOLIDAR_FACTURA == 1 && (CODIGOS_VERIFICADAS.length + CODIGOS_CONSOLIDADAS.length) == BODEGAS_ENFACTURA.length) {
                return `<span class="fs-6 badge bg-primary fw-bold">consolidacion completa</span>`;
              } else if (x.CENTRO_CONSOLIDADO == 0 && x.CONSOLIDAR_FACTURA == 1 && x.FACTURA_LISTA_ESTADO == '0') {
                return `<span class="fs-6 badge bg-danger fw-bold">Por consolidar</span>`;
              } else if (x.FACTURA_LISTA_ESTADO == '1') {
                return `<span class="fs-6 badge bg-success fw-bold">Consolidada</span>`;
              } else {
                return `<span class="fs-6 badge bg-success fw-bold">Desbloqueada</span>`;
              }
            }
        )(); // 👈 ejecutas la función al final

        // x.FACTURA_BLOQUEADA_TEXTO = x.FACTURA_BLOQUEADA == 1
        //   ? `<span class="fs-6 badge bg-danger fw-bold">Bloqueada</span>`
        //   : (x.CENTRO_CONSOLIDADO == 1 && x.CONSOLIDAR_FACTURA == 1 ? `<span class="fs-6 badge bg-danger fw-bold">Espera Consolidación</span>`
        //     : (x.FACTURA_LISTA_ESTADO == '1' ? `<span class="fs-6 badge bg-success fw-bold">Consolidada</span>`
        //       : `<span class="fs-6 badge bg-success fw-bold">Desbloqueada</span>`)
        //   );
      });
      this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };
    }

  }

  //** ACCIONES DE LOS BOTONES DE LA TABLA */
  onTableAction(action: TableClickedAction) {
    // Debug para ver qué evento llega
    switch (action.action_to_perform) {
      case 'detalle_factura':
        if (this.empresa == 'COMPUTRON') {
          this.onIngresarGuiaComputron(action.data);
          return;
        }
        if (this.empresa == 'CARTIMEX') {
          this.onIngresarGuiaCartimex(action.data);
          return;
        }
        break;
      case 'ORDEN_TIPO_PEDIDO_change':
        this.onTransporteChange(action.data, action.value);
        break;
      default:
        break;
    }
  }

  // Método para manejar el cambio de tipo de pedido en el select
  onTransporteChange(rowData: any, selectedValue: string) {

    if (rowData.FACTURA_LISTA_ESTADO == 1 && rowData.CENTRO_CONSOLIDADO == 0 && rowData.CONSOLIDAR_FACTURA == 1) {
      Swal.fire("Atención!", "La factura " + rowData.FACTURA_SECUENCIA + " ya ha sido consolidada y no se puede cambiar el tipo de pedido.", "warning");
      return; // Detener la ejecución si la factura ya está consolidada
    }
    // Crear una clave única para esta fila
    const facturaKey = rowData.FACTURA_SECUENCIA || rowData.ID;
    // Guardar el valor seleccionado
    this.transportesSeleccionados[facturaKey] = selectedValue;
    // Actualizar el dato en la fuente original
    const index = this.Usuarios_Datos.findIndex(item =>
      (item.FACTURA_SECUENCIA || item.ID) === facturaKey
    );
    if (index !== -1) {
      // Actualizar el campo correcto
      this.Usuarios_Datos[index].ORDEN_TIPO_PEDIDO = selectedValue;
    }
    // Forzar detección de cambios
    this.cdr.detectChanges();
    // Actualizar la configuración de la tabla para reflejar cambios
    this.tableConfig = { ...this.tableConfig, data: [...this.Usuarios_Datos] };
    // Llamar al método para guardar (puedes habilitarlo después)
    this.guardarTransporteSeleccionado(rowData, selectedValue);
  }

  // Método para persistir el cambio del transporte (opcional)
  guardarTransporteSeleccionado(rowData: any, tipo: string) {
    // Ejemplo de llamada al API para guardar el cambio
    const param = {
      factura: rowData.FACTURA_ID,
      tipo: tipo,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };

    if (this.empresa === 'COMPUTRON') {
      return; // Computron no permite cambiar tipo de pedido
    }

    Swal.fire({
      title: "Estás seguro?",
      text: "Si ya hay facturas consolidadas puede haber problemas al ingresar la guía!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.FacturacionService.GuardarCambioTipoPedido(param).subscribe({
          next: (response) => {

            if (response.success) {
              Swal.fire("Éxito!", "Transporte actualizado correctamente", "success");
              this.loadTableData(); // Recargar datos para reflejar cambios
            } else {
              Swal.fire("Error!", response.message, "error");
            }
          },
          error: (error) => {
            Swal.fire("Error!", "No se pudo actualizar el transporte", "error");
          }
        });
      }
    });



  }

  onIngresarGuiaComputron(data: any) {
    console.log('data: ', data);

    // Limpiar ambos modales al inicio
    this.showPrepararModal = false;
    this.showDetalleguiaComputronModal = false;

    if (data.FACTURA_BLOQUEADA == 1 && data.CENTRO_CONSOLIDADO == 0) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " está bloqueada y no se pueden ingresar guías.", "warning");
      return;
    }

    if (data.CONSOLIDAR_FACTURA == 1 && data.CENTRO_CONSOLIDADO == 0 && data.FACTURA_LISTA_ESTADO == 1) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " ya ha sido consolidada y no se pueden ingresar más guías.", "warning");
      return;
    }

    let BOD_VERIFICADAS = data.CODIGOS_VERIFICADAS ? data.CODIGOS_VERIFICADAS.split(',').map((c: string) => c.trim()) : [];

    let BOD_CONSOLIDADAS = data.CODIGOS_CONSOLIDADAS ? data.CODIGOS_CONSOLIDADAS.split(',').map((c: string) => c.trim()) : [];

    let BODEGAS = [...BOD_VERIFICADAS, ...BOD_CONSOLIDADAS];
    let BODEGAS_ENFACTURA = data.BODEGAS_ENFACTURA ? data.BODEGAS_ENFACTURA.split(',').map((c: string) => c.trim()) : [];

    const normalizar = (valor: string): string => {
      if (!valor) return "";
      return parseFloat(valor).toFixed(2); // "00.07" → "0.07"
    };
    // ✅ Buscamos las bodegas que están en BODEGAS pero no en BODEGAS_ENFACTURA
    const bodegasFaltantes: string[] = BODEGAS_ENFACTURA.filter(
      (b: string) => !BODEGAS.some((e: string) => normalizar(e) === normalizar(b))
    );

    if (bodegasFaltantes.length > 0 && data.CENTRO_CONSOLIDADO == 1 && data.CONSOLIDAR_FACTURA == 1) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " tiene bodegas que no se han completado: " + bodegasFaltantes.join(', '), "warning");
      return;
    }

    // Almacenar los datos de la fila para usar en el template
    this.facturaRowData = data;

    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.IDS_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };

    this.FacturacionService.GetFacturasDatosVerificar(param).subscribe({
      next: (response) => {
        console.log('response: ', response);



        if (response.success && response.cabecera) {
          if (response.cabecera.length > 0) {
            this.facturaSeleccionada = response;
            this.facturaActual = response.cabecera[0];
            this.detalleFactura = response.detalle || [];

            // Procesar bodegas para crear campos de guías dinámicos
            this.procesarBodegas(data);

            // Establecer el valor por defecto del checkbox de consolidación
            // Solo si es multibodega, requiere consolidación y no es centro consolidado
            const esMultibodega = this.facturaRowData?.MULTIBODEGA == 'SI';
            const requiereConsolidacion = this.facturaRowData?.CONSOLIDAR_FACTURA == 1;
            const noEsCentroConsolidado = this.facturaRowData?.CENTRO_CONSOLIDADO == '0';

            this.consolidar = esMultibodega && requiereConsolidacion && noEsCentroConsolidado;

            this.showDetalleguiaComputronModal = true;
          } else {
            this.showDetalleguiaComputronModal = false;
            Swal.fire("Error!", "No se encontraron datos para la factura " + data.FACTURA_SECUENCIA, "error");
          }
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {

        this.isLoading = false;
      }
    });

    // Cargar lista de transportes
    this.cargandoTransportes = true;
    this.FacturacionService.GetTransporteGuiasPickup({}).subscribe({
      next: (response) => {


        if (response.success && response.data) {
          this.listaTransportes = response.data;

        } else {

          Swal.fire("Error!", "No se pudieron cargar los transportes disponibles", "warning");
        }
        this.cargandoTransportes = false;
      },
      error: (error) => {

        Swal.fire("Error!", "Error al conectar con el servicio de transportes", "error");
        this.cargandoTransportes = false;
      }
    });
  }

  onIngresarGuiaCartimex(data: any) {
    console.log('data: ', data);

    // Limpiar ambos modales al inicio
    this.showPrepararModal = false;
    this.showDetalleguiaComputronModal = false;

    if (data.FACTURA_BLOQUEADA == 1 && data.CENTRO_CONSOLIDADO == 0) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " está bloqueada y no se pueden ingresar guías.", "warning");
      return;
    }

    if (data.CONSOLIDAR_FACTURA == 1 && data.CENTRO_CONSOLIDADO == 0 && data.FACTURA_LISTA_ESTADO == 1) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " ya ha sido consolidada y no se pueden ingresar más guías.", "warning");
      return;
    }

    let BOD_VERIFICADAS = data.CODIGOS_VERIFICADAS ? data.CODIGOS_VERIFICADAS.split(',').map((c: string) => c.trim()) : [];

    let BOD_CONSOLIDADAS = data.CODIGOS_CONSOLIDADAS ? data.CODIGOS_CONSOLIDADAS.split(',').map((c: string) => c.trim()) : [];

    let BODEGAS = [...BOD_VERIFICADAS, ...BOD_CONSOLIDADAS];
    let BODEGAS_ENFACTURA = data.BODEGAS_ENFACTURA ? data.BODEGAS_ENFACTURA.split(',').map((c: string) => c.trim()) : [];

    const normalizar = (valor: string): string => {
      if (!valor) return "";
      return parseFloat(valor).toFixed(2); // "00.07" → "0.07"
    };
    // ✅ Buscamos las bodegas que están en BODEGAS pero no en BODEGAS_ENFACTURA
    const bodegasFaltantes: string[] = BODEGAS_ENFACTURA.filter(
      (b: string) => !BODEGAS.some((e: string) => normalizar(e) === normalizar(b))
    );



    if (bodegasFaltantes.length > 0 && data.CENTRO_CONSOLIDADO == 1 && data.CONSOLIDAR_FACTURA == 1) {
      Swal.fire("Atención!", "La factura " + data.FACTURA_SECUENCIA + " tiene bodegas que no se han completado: " + bodegasFaltantes.join(', '), "warning");
      return;
    }

    // Almacenar los datos de la fila para usar en el template
    this.facturaRowData = data;

    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.IDS_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };




    this.FacturacionService.GetFacturasDatosVerificar(param).subscribe({
      next: (response) => {
        console.log('response: ', response);



        if (response.success && response.cabecera) {
          if (response.cabecera.length > 0) {
            this.facturaSeleccionada = response;
            this.facturaActual = response.cabecera[0];
            this.detalleFactura = response.detalle || [];

            // Procesar bodegas para crear campos de guías dinámicos
            this.procesarBodegas(data);

            // Establecer el valor por defecto del checkbox de consolidación
            // Solo si es multibodega, requiere consolidación y no es centro consolidado
            const esMultibodega = this.facturaRowData?.MULTIBODEGA == 'SI';
            const requiereConsolidacion = this.facturaRowData?.CONSOLIDAR_FACTURA == 1;
            const noEsCentroConsolidado = this.facturaRowData?.CENTRO_CONSOLIDADO == '0';

            this.consolidar = esMultibodega && requiereConsolidacion && noEsCentroConsolidado;

            this.showPrepararModal = true;
          } else {
            this.showPrepararModal = false;
            Swal.fire("Error!", "No se encontraron datos para la factura " + data.FACTURA_SECUENCIA, "error");
          }
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {

        this.isLoading = false;
      }
    });

    // Cargar lista de transportes
    this.cargandoTransportes = true;
    this.FacturacionService.GetTransporteGuiasPickup({}).subscribe({
      next: (response) => {


        if (response.success && response.data) {
          this.listaTransportes = response.data;

        } else {

          Swal.fire("Error!", "No se pudieron cargar los transportes disponibles", "warning");
        }
        this.cargandoTransportes = false;
      },
      error: (error) => {

        Swal.fire("Error!", "Error al conectar con el servicio de transportes", "error");
        this.cargandoTransportes = false;
      }
    });
  }

  // Método para procesar las bodegas
  procesarBodegas(data: any) {
    if (data.CODIGOS_BODEGA && data.BODEGAS) {
      const codigosBodega = data.CODIGOS_BODEGA.split(',').map((c: string) => c.trim());
      const nombresBodega = data.BODEGAS.split(',').map((n: string) => n.trim());

      this.bodegas = codigosBodega.map((codigo: string, index: number) => ({
        codigo: codigo,
        nombre: nombresBodega[index] || codigo
      }));


    }
  }



  // Método para cerrar el modal
  cerrarModal() {
    // Cerrar ambos modales
    this.showPrepararModal = false;
    this.showDetalleguiaComputronModal = false;
    this.facturaActual = null;
    this.facturaSeleccionada = null;
    this.facturaRowData = null;
    this.detalleFactura = [];

    // Limpiar datos de envío
    this.transporteSeleccionado = '';
    this.numeroGuia = '';
    this.numeroBultos = null;
    this.pesoEnvio = '';
    this.comentariosEnvio = '';
    this.consolidar = false;
    this.tipoConsolidacion = '';
    this.guiaConsolidacion = '';
    this.bodegas = [];
    this.listaTransportes = [];
    this.cargandoTransportes = false;
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
  // Método para debug - ver el estado actual de los datos
  verEstadoActual() {



  }
  // Método para actualizar las opciones del select basado en valores únicos de la BD
  actualizarOpcionesSelect() {
    // Opciones base que siempre deben estar
    let opcionesBase = [];

    if (this.empresa === 'CARTIMEX') {
      opcionesBase.push({ label: 'MOSTRADOR-GYE', value: 'MOSTRADOR-GYE' });
      opcionesBase.push({ label: 'MOSTRADOR-UIO', value: 'MOSTRADOR-UIO' });
      opcionesBase.push({ label: 'CUIDAD-GYE', value: 'CUIDAD-GYE' });
      opcionesBase.push({ label: 'CUIDAD-UIO', value: 'CUIDAD-UIO' });
      opcionesBase.push({ label: 'PROVINCIA', value: 'PROVINCIA' });
    }

    if (this.empresa === 'COMPUTRON') {
      opcionesBase.push({ label: 'PICKUP', value: 'PICKUP' });
      opcionesBase.push({ label: 'ENVIO', value: 'ENVIO' });
    }

    // Obtener valores únicos de la BD
    const valoresUnicos = [...new Set(this.Usuarios_Datos.map(x => x.ORDEN_TIPO_PEDIDO).filter(val => val && val !== ''))];
    // Filtrar los que no están en las opciones base
    const valoresBase = opcionesBase.map(opt => opt.value);
    const nuevosValores = valoresUnicos.filter(val => !valoresBase.includes(val));
    const opcionesAdicionales = nuevosValores.map(val => ({ label: val, value: val }));

    // Combinar opciones base con las adicionales
    const todasLasOpciones = [...opcionesBase, ...opcionesAdicionales];

    // Actualizar la configuración de la tabla
    const columnaSelect = this.tableConfig.columns.find(col => col.type === 'select');
    if (columnaSelect) {
      columnaSelect.options = todasLasOpciones;
    }



  }
  // ==================== MÉTODO PARA GUARDAR CAMBIOS ====================

  guardarCambios() {

    // Buscar el nombre del transporte seleccionado
    const transporteSeleccionadoObj = this.listaTransportes.find(t => t.id === this.transporteSeleccionado);
    const nombreTransporte = transporteSeleccionadoObj ? transporteSeleccionadoObj.Código : 'N/A';

    // Crear objeto con todos los datos de envío
    const datosEnvio = {
      transporteId: this.transporteSeleccionado,
      transporteNombre: nombreTransporte,
      numeroGuia: this.numeroGuia,
      numeroBultos: this.numeroBultos,
      peso: this.pesoEnvio,
      comentarios: this.comentariosEnvio,
      consolidacion: {
        activada: this.consolidar,
        tipo: this.tipoConsolidacion,
        guia: this.guiaConsolidacion
      },
      bodegas: this.bodegas, // Información de bodegas para referencia
      factura: this.facturaActual.Id,
      bodegaInfo: this.facturaSeleccionada.BODEGAS
    };

    console.log('datosEnvio: ', datosEnvio);



    // Validar campos obligatorios
    // Validar consolidación si está activada
    let consolidacionIncompleta = false;
    if (this.consolidar && !this.guiaConsolidacion.trim()) {
      consolidacionIncompleta = true;
    }

    // Validar número de guía solo si no está en modo consolidación
    const requiereNumeroGuia = !this.consolidar && !this.numeroGuia?.trim();

    if (!this.transporteSeleccionado || !this.numeroBultos || requiereNumeroGuia || consolidacionIncompleta) {
      let camposFaltantes = [];
      if (!this.transporteSeleccionado) camposFaltantes.push('Transporte');
      if (!this.numeroBultos) camposFaltantes.push('Número de bultos');
      if (requiereNumeroGuia) camposFaltantes.push('Número de guía');
      // Removido: tipo de consolidación (oculto por el momento)
      if (this.consolidar && !this.guiaConsolidacion.trim()) camposFaltantes.push('Guía de consolidación');

      Swal.fire({
        title: "⚠️ Campos Incompletos",
        html: `
          <div class="text-start">
            <p>Por favor complete los siguientes campos obligatorios:</p>
            <ul class="text-muted">
              ${camposFaltantes.map(campo => `<li>${campo}</li>`).join('')}
            </ul>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Entendido"
      });
      return;
    }

    // Crear HTML para mostrar la información de las bodegas y guía
    const htmlGuiasBodegas = this.bodegas.length > 1
      ? `<p><strong>Número de guía:</strong> ${this.numeroGuia}</p>
         <p><small class="text-muted">Esta guía se aplicará a las ${this.bodegas.length} bodegas: ${this.bodegas.map(b => b.codigo).join(', ')}</small></p>`
      : `<p><strong>Número de guía:</strong> ${this.numeroGuia}</p>`;

    // Crear HTML para consolidación si está activada
    const htmlConsolidacion = this.consolidar ? `
      <hr class="my-2">
      <h6 class="text-warning mb-2"><i class="fa fa-boxes me-1"></i>Consolidación</h6>
      <p><strong>Tipo:</strong> ${this.opcionesConsolidacion.find(op => op.id === this.tipoConsolidacion)?.nombre || 'N/A'}</p>
      <p><strong>Guía de consolidación:</strong> ${this.guiaConsolidacion}</p>
    ` : '';

    Swal.fire({
      title: "✅ Datos Guardados",
      html: `
        <div class="text-start">
          <h6 class="text-primary mb-2"><i class="fa fa-file-invoice me-1"></i>Datos de Factura</h6>
          <p><strong>Factura:</strong> ${this.facturaActual?.Secuencia || 'N/A'}</p>
          <p><strong>Cliente:</strong> ${this.facturaActual?.Nombre || 'N/A'}</p>
          <p><strong>Total productos:</strong> ${this.detalleFactura?.length || 0}</p>
          
          <hr class="my-2">
          
          <h6 class="text-success mb-2"><i class="fa fa-shipping-fast me-1"></i>Datos de Envío</h6>
          <p><strong>Transporte:</strong> ${nombreTransporte} (${this.transporteSeleccionado})</p>
          <p><strong>Bultos:</strong> ${this.numeroBultos}</p>
          <p><strong>Peso:</strong> ${this.pesoEnvio || 'No especificado'}</p>
          ${this.comentariosEnvio ? `<p><strong>Comentarios:</strong> ${this.comentariosEnvio}</p>` : ''}
          
          ${htmlConsolidacion}
          
          <hr class="my-2">
          
          <h6 class="text-info mb-2"><i class="fa fa-barcode me-1"></i>Información de Guía</h6>
          ${htmlGuiasBodegas}
        </div>
      `,
      icon: "success",
      confirmButtonText: "OK"
    });

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Guardar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.FacturacionService.FinalizarGuiasPickup(datosEnvio).subscribe({
          next: (response) => {
            console.log('response: ', response);

            if (response.success) {
              Swal.fire("Éxito!", "Los datos de guía han sido guardados correctamente.", "success");
              this.cerrarModal();
              this.loadTableData();
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
    });
  }

  // ==================== OTROS MÉTODOS ====================

  // Enfocar input código
  enfocarInputCodigo() {
    setTimeout(() => {
      const inputCodigo = document.querySelector('#inputCodigo') as HTMLInputElement;
      if (inputCodigo) inputCodigo.focus();
    }, 100);
  }

}
