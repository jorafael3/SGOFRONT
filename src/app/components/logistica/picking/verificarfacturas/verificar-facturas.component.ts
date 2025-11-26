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
  selector: 'app-verificar-facturas',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './verificar-facturas.component.html',
  styleUrl: './verificar-facturas.component.scss'
})
export class VerificarFacturasComponent {
  showPrepararModal: boolean = false;
  public sessionData: any = null; // Datos de sesión del usuario actual

  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  // Datos del modal de preparar factura
  facturaSeleccionada: any = null;
  facturaActual: any = null;
  detalleFactura: any[] = [];
  productosJaula: any[] = [];
  productosNoJaula: any[] = [];

  // Variables para captura de series/cantidades
  codigoProductoActual: string = '';
  serieActual: string = '';
  cantidadActual: number | null = null;
  productoActual: any = null;
  productosVerificados: number = 0;

  // Datos de prueba para validación de series
  seriesValidasPrueba = [
    { codigo: 'L3250', serie: 'SN001234567' },
    { codigo: 'L3250', serie: 'SN001234568' },
    { codigo: 'TG-3468', serie: 'SN001234569' },
    { codigo: 'ABC-123', serie: 'ABC001' },
    { codigo: 'ABC-123', serie: 'ABC002' },
    { codigo: 'XYZ-789', serie: 'XYZ100' }
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
      { title: 'Sucursal', field_value: 'FACTURA_SUCURSAL_TEXTO', sort: true },
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
        class: 'btn btn-success btn-sm',
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
    this.loadTableData();

  }

  loadSessionData(): void {
    this.sessionData = this.FacturacionService.getUserSessionData();


  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };


    this.FacturacionService.GetFacturasPorVerificar(param).subscribe({
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

      let IDS_BODEGA = x.IDS_BODEGA.split(',');
      let ID_PREPARADAS = x.IDS_PREPARADAS.split(',');
      let CODIGOS_BODEGA = x.CODIGOS_BODEGA.split(',');

      
      let TEXTO_BODEGAS = "";
      for (let i = 0; i < CODIGOS_BODEGA.length; i++) {
        let AGREGADA = 0
        if (ID_PREPARADAS.length < IDS_BODEGA.length) {
          if (CODIGOS_BODEGA[i] == CODIGOS_BODEGA[ID_PREPARADAS.length]) {
            AGREGADA = 1
            TEXTO_BODEGAS += `<span title="Pendiente de preparacion" class="text-danger fw-bold">P: ${CODIGOS_BODEGA[ID_PREPARADAS.length]}</span><br>`
          }
        }
        if (AGREGADA === 0) {
          TEXTO_BODEGAS += `<span class="fw-bold">${CODIGOS_BODEGA[i]}</span><br>`
        }
      }
      x.FACTURA_SUCURSAL_TEXTO = `<span class="fw-bold badge badge-secondary fs-6">${x.FACTURA_SUCURSAL}</span>`;
      x.CODIGOS_BODEGA_TEXTO = TEXTO_BODEGAS;
      x.FACTURA_SECUENCIA_TEXTO = `<span class="badge bg-dark fs-6 fw-bold">${x.FACTURA_SECUENCIA}</span>`;
      x.MULTIBODEGA = `<span class="fs-6 badge bg-${x.MULTIBODEGA === 'SI' ? 'primary' : 'secondary'} fw-bold">${x.MULTIBODEGA}</span>`;
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
    console.log('data: ', data);

    let IDS_BODEGA = data.IDS_BODEGA.split(',');
    console.log('IDS_BODEGA: ', IDS_BODEGA);
    let ID_PREPARADAS = data.IDS_PREPARADAS.split(',');
    console.log('ID_PREPARADAS: ', ID_PREPARADAS);
    let CODIGOS_BODEGA = data.CODIGOS_BODEGA.split(',');

    if (ID_PREPARADAS.length < IDS_BODEGA.length) {
      Swal.fire("Atención!", "Hay productos sin preparar en la factura bodega " + CODIGOS_BODEGA[ID_PREPARADAS.length], "info");
      return;
    }

    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.IDS_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };

    console.log('param: ', param);

    this.FacturacionService.GetFacturasDatosVerificar(param).subscribe({
      next: (response) => {
        console.log('response: ', response);

        if (response.success && response.cabecera) {

          if (response.cabecera.length > 0) {
            this.facturaSeleccionada = response;
            this.facturaActual = response.cabecera[0];
            this.detalleFactura = response.detalle || [];

            // Preparar datos para la tabla del detalle
            this.detalleFactura = this.detalleFactura.map((item, index) => {
              return {
                ...item,
                // Propiedades para series
                seriesIngresadas: [], // Array de series ingresadas
                cantidadVerificada: 0, // Cantidad verificada (series ingresadas o cantidad confirmada)
                seriesCompletas: false // Si ya tiene todas las series/cantidad completa
              };
            });

            // Inicializar contadores
            this.productosVerificados = 0;
            this.limpiarInputsCaptura();

            // Separar productos por JAULA
            this.productosJaula = this.detalleFactura.filter(item => item.EN_JAULA === "1");
            this.productosNoJaula = this.detalleFactura.filter(item => item.EN_JAULA === "0");




            this.showPrepararModal = true;

            // Auto-focus en input código al abrir modal
            setTimeout(() => {
              this.enfocarInputCodigo();
            }, 500);

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
  }
  // Método para cerrar el modal
  cerrarModal() {
    this.showPrepararModal = false;
    this.facturaActual = null;
    this.facturaSeleccionada = null;
    this.detalleFactura = [];
    this.productosJaula = [];
    this.productosNoJaula = [];
  }
  // Método para guardar la verificación de series
  guardarVerificacion() {
    // Verificar que todos los productos estén verificados (series completas)
    const productosNoVerificados = this.detalleFactura.filter(item => !item.seriesCompletas);

    console.log('Productos no verificados:', productosNoVerificados);

    if (productosNoVerificados.length > 0) {
      // Mostrar lista de productos faltantes
      Swal.fire({
        title: "⚠️ Faltan productos por verificar",
        html: `
          <div class="text-start">
            <p><strong>Productos pendientes de verificación:</strong></p>
            <div class="alert alert-light border text-start" style="max-height: 300px; overflow-y: auto; background-color: #f8f9fa;">
              ${productosNoVerificados.map(item =>
          `<div class="mb-1">
                  <i class="fa fa-exclamation-triangle text-warning me-1"></i>
                  <strong>${item.CopProducto}</strong><br>
                  <small class="text-muted">${item.Detalle.substring(0, 60)}...</small><br>
                  <small class="text-info">Verificado: ${item.cantidadVerificada || 0}/${item.Cantidad}</small>
                </div>`
        ).join('')}
            </div>
            <p class="text-muted">Total pendientes: <strong>${productosNoVerificados.length}</strong> de <strong>${this.detalleFactura.length}</strong> productos</p>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#f39c12",
        background: "#ffffff",
        color: "#212529"
      });
      return;
    }

    // Todos los productos están verificados
    const productosVerificados = this.detalleFactura.filter(item => item.seriesCompletas);

    Swal.fire({
      title: "✅ Verificación completada",
      html: `
        <div class="text-center">
          <p class="text-success"><i class="fa fa-check-circle fa-2x mb-2"></i></p>
          <p>Todos los productos han sido verificados correctamente</p>
          <p class="text-danger">Presione "Continuar" para finalizar la verificación</p>
          <p><strong>Total productos:</strong> ${this.detalleFactura.length}</p>
          <p><strong>Productos verificados:</strong> ${productosVerificados.length}</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Continuar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745"
    }).then(() => {
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      let param = {
        cliente: this.facturaActual.Nombre,
        factura: this.facturaActual.Id,
        usrid: this.sessionData ? this.sessionData.usrid : null,
        bodegas: this.facturaSeleccionada.BODEGAS,
        solo_servicios: this.facturaActual.SoloServicios,
        detalle_verificacion: this.detalleFactura.map(item => ({
          producto: item.CopProducto,
          productoId: item.ProductoId,
          cantidad: item.Cantidad,
          cantidadVerificada: item.cantidadVerificada,
          seriesIngresadas: item.seriesIngresadas || [],
          tipoVerificacion: item.RegistaSerie === '1' ? 'series' : 'cantidad'
        }))
      }

      console.log('Parámetros verificación:', param);

      // Llamada al servicio de verificación
      this.FacturacionService.FinalizarVerificacion(param).subscribe({
        next: (response) => {
          console.log('Respuesta verificación:', response);

          if (response.success) {
            Swal.fire({
              title: "✅ Verificación Finalizada",
              html: `
                <div class="text-start">
                  <p><strong>Factura:</strong> ${this.facturaActual.Secuencia}</p>
                  <p class="text-success">`+ response.message + `</p>
                </div>
              `,
              icon: "success",
              confirmButtonText: "Cerrar",
              confirmButtonColor: "#28a745",
              background: "#ffffff",
              color: "#212529"
            }).then(() => {
              // Cerrar el modal y actualizar la tabla
              this.cerrarModal();
              this.onRefreshTableData();
            });
          } else {
            Swal.fire({
              title: "❌ Error en Verificación",
              html: `
                <div class="text-start">
                  <p><strong>Error:</strong> ${response.message || 'Error desconocido'}</p>
                  <p class="text-muted">Por favor, intente nuevamente.</p>
                </div>
              `,
              icon: "error",
              confirmButtonText: "Entendido",
              confirmButtonColor: "#dc3545"
            });
          }
        },
        error: (error) => {
          console.error('Error en verificación:', error);
          Swal.fire({
            title: "❌ Error de Conexión",
            html: `
              <div class="text-start">
                <p>Ocurrió un error al finalizar la verificación.</p>
                <p class="text-muted">Verifique su conexión e intente nuevamente.</p>
              </div>
            `,
            icon: "error",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#dc3545"
          });
        }
      });
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
  // ==================== MÉTODOS PARA CAPTURA DE SERIES ====================

  // Limpiar inputs de captura
  limpiarInputsCaptura() {
    this.codigoProductoActual = '';
    this.serieActual = '';
    this.cantidadActual = null;
    this.productoActual = null;
  }

  // Método para manejar Enter en input de código de producto
  onCodigoProductoEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.validarCodigoProducto();
    }
  }

  // Validar que el código de producto existe en la factura
  validarCodigoProducto() {
    const codigo = this.codigoProductoActual.trim();
    if (!codigo) {
      return;
    }

    console.log('Código ingresado:', codigo);
    console.log('Detalle factura:', this.detalleFactura);
    console.log('Códigos disponibles:', this.detalleFactura.map(item => item.CopProducto));

    // Buscar el producto en el detalle de la factura (comparación sin distinguir mayúsculas/minúsculas)
    const producto = this.detalleFactura.find(item =>
      item.CopProducto.toLowerCase() === codigo.toLowerCase()
    );

    console.log('Producto encontrado:', producto);

    if (producto) {
      this.productoActual = producto;

      // Auto-focus en el siguiente input según el tipo
      setTimeout(() => {
        if (producto.RegistaSerie === '1') {
          // Producto con series - enfocar input serie
          const inputSerie = document.querySelector('#inputSerie') as HTMLInputElement;
          if (inputSerie) inputSerie.focus();
        } else {
          // Producto solo cantidad - enfocar input cantidad
          const inputCantidad = document.querySelector('#inputCantidad') as HTMLInputElement;
          if (inputCantidad) inputCantidad.focus();
        }
      }, 100);

    } else {
      // Código no encontrado
      this.productoActual = null;
      Swal.fire({
        title: "❌ Código No Encontrado",
        html: `
          <div class="text-start">
            <p>El código <strong>${codigo}</strong> no existe en esta factura.</p>
            <p class="text-muted">Verifique el código e intente nuevamente.</p>
          </div>
        `,
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#dc3545"
      }).then(() => {
        // Limpiar y enfocar en código
        this.codigoProductoActual = '';
        setTimeout(() => {
          const inputCodigo = document.querySelector('#inputCodigo') as HTMLInputElement;
          if (inputCodigo) inputCodigo.focus();
        }, 100);
      });
    }
  }

  // Método para manejar Enter en input de serie
  onSerieEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.procesarSerie();
    }
  }

  // Procesar ingreso de serie
  procesarSerie() {
    const serie = this.serieActual.trim();
    if (!serie || !this.productoActual) {
      return;
    }

    // Validar que no se exceda la cantidad
    if (this.productoActual.cantidadVerificada >= this.productoActual.Cantidad) {
      Swal.fire({
        title: "⚠️ Cantidad Completa",
        text: `El producto ${this.productoActual.CopProducto} ya tiene todas sus series completas.`,
        icon: "warning",
        confirmButtonColor: "#f39c12"
      });
      this.limpiarInputsCaptura();
      this.enfocarInputCodigo();
      return;
    }

    // Validar que la serie no esté duplicada
    if (this.productoActual.seriesIngresadas.includes(serie)) {
      Swal.fire({
        title: "❌ Serie Duplicada",
        html: `
          <div class="text-start">
            <p>La serie <strong>${serie}</strong> ya fue ingresada para el producto <strong>${this.productoActual.CopProducto}</strong>.</p>
          </div>
        `,
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
      this.serieActual = '';
      return;
    }

    // Si es serie controlada, validar existencia en base de datos
    if (this.productoActual.registroserieEntrada === '1') {
      this.validarSerieEnBaseDatos(this.productoActual.ProductoId, serie);
    } else {
      // Serie libre - agregar directamente
      this.agregarSerie(serie);
    }
  }

  // Método para manejar Enter en input de cantidad
  onCantidadEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.procesarCantidad();
    }
  }

  // Procesar confirmación de cantidad
  procesarCantidad() {
    if (!this.cantidadActual || !this.productoActual) {
      return;
    }

    // Validar cantidad válida
    if (this.cantidadActual <= 0 || this.cantidadActual > this.productoActual.Cantidad) {
      Swal.fire({
        title: "❌ Cantidad Inválida",
        text: `La cantidad debe ser entre 1 y ${this.productoActual.Cantidad}.`,
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
      return;
    }

    // Confirmar cantidad
    this.productoActual.cantidadVerificada = this.cantidadActual;
    this.productoActual.seriesCompletas = (this.cantidadActual === parseInt(this.productoActual.Cantidad));

    console.log('Cantidad confirmada:', this.cantidadActual);
    console.log('Cantidad total:', this.productoActual.Cantidad);
    console.log('Series completas:', this.productoActual.seriesCompletas);

    // Actualizar contadores
    this.actualizarContadores();

    // Mostrar confirmación
    Swal.fire({
      title: "✅ Cantidad Confirmada",
      html: `
        <div class="text-start">
          <p><strong>Producto:</strong> ${this.productoActual.CopProducto}</p>
          <p><strong>Cantidad confirmada:</strong> ${this.cantidadActual}/${this.productoActual.Cantidad}</p>
        </div>
      `,
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });

    // Limpiar y continuar
    this.limpiarInputsCaptura();
    this.enfocarInputCodigo();
  }

  // Validar serie en base de datos (llamada real al servicio)
  validarSerieEnBaseDatos(codigoProducto: string, serie: string) {
    // Mostrar loading mientras se valida
    Swal.fire({
      title: "Validando serie...",
      html: `
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Validando...</span>
          </div>
          <p class="mt-2">Verificando serie <strong>${serie}</strong> en la base de datos</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const param = {
      codigo_producto: codigoProducto,
      serie: serie,
      bodega: this.facturaActual.CodigoBodega,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };
    console.log('param: ', param);

    this.FacturacionService.ValidarSerie(param).subscribe({
      next: (response) => {
        console.log('Respuesta validación serie:', response);
        Swal.close();
        if (response.success) {
          // Serie válida - agregar

          if (response.serie_encontrada) {

            if (response.serie_disponible == true) {

              this.agregarSerie(serie);

            } else {
              Swal.fire({
                title: "❌ Serie No Disponible",
                html: `
              <div class="text-start">
                <p>La serie <strong>${serie}</strong> ya ha sido utilizada o no está disponible para el producto <strong>${codigoProducto}</strong>.</p>
                <p class="text-muted  ">${response.message || 'Verifique la serie e intente nuevamente.'}</p>
              </div>
            `, icon: "error",
                confirmButtonText: "Reintentar",
                confirmButtonColor: "#dc3545"
              });

              this.serieActual = '';
            }

          } else {
            Swal
              .fire({
                title: "❌ Serie No Válida",
                html: `
              <div class="text-start">
                <p>La serie <strong>${serie}</strong> no existe en la base de datos para el producto <strong>${codigoProducto}</strong>.</p>
                <p class="text-muted">${response.message || 'Verifique la serie e intente nuevamente.'}</p>
              </div>
            `,
                icon: "error",
                confirmButtonText: "Reintentar",
                confirmButtonColor: "#dc3545"
              });
            this.serieActual = '';
          }
        } else {
          // Serie no válida
          Swal.fire({
            title: "❌ Serie No Válida",
            html: `
              <div class="text-start">
                <p>La serie <strong>${serie}</strong> no existe en la base de datos para el producto <strong>${codigoProducto}</strong>.</p>
                <p class="text-muted">${response.message || 'Verifique la serie e intente nuevamente.'}</p>
              </div>
            `,
            icon: "error",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#dc3545"
          });
          this.serieActual = '';
        }
      },
      error: (error) => {
        console.error('Error validando serie:', error);
        Swal.fire({
          title: "❌ Error de Validación",
          html: `
            <div class="text-start">
              <p>Ocurrió un error al validar la serie <strong>${serie}</strong>.</p>
              <p class="text-muted">Por favor, intente nuevamente.</p>
            </div>
          `,
          icon: "error",
          confirmButtonText: "Reintentar",
          confirmButtonColor: "#dc3545"
        });
        this.serieActual = '';
      }
    });
  }

  // Método para agregar serie una vez validada
  agregarSerie(serie: string) {
    // Agregar la serie
    this.productoActual.seriesIngresadas.push(serie);
    this.productoActual.cantidadVerificada = this.productoActual.seriesIngresadas.length;
    this.productoActual.ProductoId = this.productoActual.ProductoId;
    console.log('Serie agregada:', serie);
    console.log('Cantidad verificada:', this.productoActual.cantidadVerificada);
    console.log('Cantidad total:', this.productoActual.Cantidad);

    // Verificar si está completo
    if (this.productoActual.cantidadVerificada === parseInt(this.productoActual.Cantidad)) {
      this.productoActual.seriesCompletas = true;
      console.log('Producto marcado como completo:', this.productoActual.CopProducto);
    }

    // Actualizar contadores
    this.actualizarContadores();

    // Mostrar confirmación y continuar
    Swal.fire({
      title: "✅ Serie Agregada",
      html: `
        <div class="text-start">
          <p><strong>Producto:</strong> ${this.productoActual.CopProducto}</p>
          <p><strong>Serie:</strong> ${serie}</p>
          <p><strong>Progreso:</strong> ${this.productoActual.cantidadVerificada}/${this.productoActual.Cantidad}</p>
        </div>
      `,
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });

    // Limpiar y continuar
    this.serieActual = '';
    if (this.productoActual.seriesCompletas) {
      this.limpiarInputsCaptura();
      this.enfocarInputCodigo();
    }
  }

  // Actualizar contadores
  actualizarContadores() {
    const productosCompletos = this.detalleFactura.filter(item => item.seriesCompletas);
    this.productosVerificados = productosCompletos.length;

    console.log('Actualizando contadores:');
    console.log('Productos completos:', productosCompletos);
    console.log('Total verificados:', this.productosVerificados);
    console.log('Detalle factura:', this.detalleFactura.map(item => ({
      codigo: item.CopProducto,
      seriesCompletas: item.seriesCompletas,
      cantidadVerificada: item.cantidadVerificada,
      cantidad: item.Cantidad
    })));

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  // Enfocar input código
  enfocarInputCodigo() {
    setTimeout(() => {
      const inputCodigo = document.querySelector('#inputCodigo') as HTMLInputElement;
      if (inputCodigo) inputCodigo.focus();
    }, 100);
  }

  // Verificar si se puede guardar (todos los productos completos)
  puedeGuardar(): boolean {
    return this.detalleFactura.every(item => item.seriesCompletas);
  }


}
