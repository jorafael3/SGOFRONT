import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import { FacturacionService } from '../../../../services/logistica/facturacion.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

// import { navigation } from '../../../shared/data/faq';

@Component({
  selector: 'app-preparar-facturas',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './preparar-facturas.component.html',
  styleUrl: './preparar-facturas.component.scss'
})
export class PrepararFacturasComponent {
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
  inputValues: { [key: string]: string } = {};
  productosValidados: any[] = []; // Array para productos validados

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
    },

    // {
    //   label: '',
    //   action: 'create_user',
    //   icon: 'fa fa-plus',
    //   class: 'btn btn-info',
    //   tooltip: 'Crear nuevo usuario'
    // },

  ];

  public tableConfig: TableConfigs = {
    columns: [
      { title: 'Sucursal', field_value: 'FACTURA_SUCURSAL', sort: true },
      { title: 'Bodega', field_value: 'CODIGOS_BODEGA_TEXTO', sort: true },
      { title: 'Cliente', field_value: 'CLIENTE_NOMBRE_TEXTO', sort: true },
      { title: 'Factura', field_value: 'FACTURA_SECUENCIA_TEXTO', sort: true },
      { title: 'Fecha', field_value: 'FACTURA_FECHA', sort: true },
      { title: 'Tipo Pedido', field_value: 'ORDEN_TIPO_PEDIDO', sort: true },
      { title: 'Sucursal', field_value: 'departamento_nombre', sort: true },
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
      },
      // {
      //   label: '',
      //   action_to_perform: 'manage_empresa',
      //   icon: 'building',
      //   type: 'button',
      //   class: 'btn btn-light btn-sm',
      //   tooltip: 'Administrar Empresa'
      // },
      // {
      //   label: '',
      //   action_to_perform: 'delete_empresa',
      //   icon: 'trash',
      //   type: 'button',
      //   class: 'btn btn-danger btn-sm',
      //   tooltip: 'Eliminar Empresa'
      // }
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
      x.departamento_nombre = `<span class="fw-bold">${x.departamento_nombre}</span>`;
    });
    this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };
  }


  //** ACCIONES DE LOS BOTONES DE LA TABLA */
  onTableAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'preparar_factura':
        this.onPrepararFactura(action.data);
        break;
      case 'manage_empresa':
        if (action.data && action.data.id_empresa) {
          this.ManageEmpresa(action.data);
        }
        break;
      case 'delete_user':
        // this.deleteUser(action.data);
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

    this.FacturacionService.GetFacturasDatos(param).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success && response.cabecera) {

          if (response.cabecera.length > 0) {
            this.facturaSeleccionada = response;
            this.facturaActual = response.cabecera[0];
            this.detalleFactura = response.detalle || [];

            // Preparar datos para la tabla del detalle
            this.detalleFactura = this.detalleFactura.map((item, index) => {
              const uniqueId = `${item.ProductoId}_${index}`;
              this.inputValues[uniqueId] = ''; // Inicializar valor del input
              return {
                ...item,
                codigoBarras: '', // Campo para el input de código de barras
                input_field: uniqueId,
                input_value: '',
                validado: false, // Estado de validación
                necesitaValidacion: item.Codigo_barras_tiene === "SI" // Si tiene código de barras, necesita validación
              };
            });

            // Separar productos por JAULA
            this.productosJaula = this.detalleFactura.filter(item => item.EN_JAULA === "1");
            this.productosNoJaula = this.detalleFactura.filter(item => item.EN_JAULA === "0");

            console.log('Productos en JAULA:', this.productosJaula.length);
            console.log('Productos NO JAULA:', this.productosNoJaula.length);

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
        console.log('error: ', error);
        this.isLoading = false;
      }
    });
  }
  // Método para manejar el input en cada fila del detalle
  onInputKeyPress(event: KeyboardEvent, rowData: any, inputId?: string) {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      const inputValue = target.value.trim();

      console.log('Input value for row:', rowData, 'Value:', inputValue);

      if (rowData && inputValue) {
        // Obtener todos los códigos de barras posibles (separados por comas)
        const codigosBarras = rowData.Codigo_barras ? rowData.Codigo_barras.split(',').map((codigo: string) => codigo.trim()) : [];

        // Verificar si el código ingresado coincide con alguno de los códigos de barras o el código del producto
        const codigoValido = codigosBarras.includes(inputValue) || inputValue === rowData.CopProducto;

        console.log('Códigos válidos:', [...codigosBarras, rowData.CopProducto]);
        console.log('Código ingresado:', inputValue);
        console.log('Es válido:', codigoValido);

        if (codigoValido) {
          // Marcar como validado
          rowData.validado = true;
          rowData.codigoBarras = inputValue;

          // Mostrar mensaje de éxito visual
          target.classList.remove('is-invalid');
          target.classList.add('is-valid');

          // Mostrar SweetAlert de éxito
          Swal.fire({
            title: "✅ Validación Correcta",
            html: `
              <div class="text-start">
                <p><strong>Producto:</strong> ${rowData.CopProducto}</p>
                <p><strong>Código validado:</strong> <code class="bg-success text-white px-2 py-1 rounded">${inputValue}</code></p>
              </div>
            `,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "#ffffff",
            color: "#212529"
          });

          console.log(`✅ Producto ${rowData.CopProducto} VALIDADO correctamente con código: ${inputValue}`);

          // Opcional: limpiar el input después de validar
          setTimeout(() => {
            target.value = '';
            this.inputValues[rowData.input_field] = '';
          }, 1000);

        } else {
          // Código incorrecto
          rowData.validado = false;
          target.classList.remove('is-valid');
          target.classList.add('is-invalid');

          // Mostrar SweetAlert con el error
          Swal.fire({
            title: "❌ Código Incorrecto",
            html: `
              <div class="text-start">
                <p><strong>Producto:</strong> ${rowData.CopProducto}</p>
                <p><strong>Descripción:</strong> ${rowData.Detalle}</p>
                <hr>
                <p><strong>Códigos válidos:</strong></p>
                <ul class="list-unstyled">
                  <li><code class="bg-primary text-white px-2 py-1 rounded me-1">${rowData.CopProducto}</code> <small class="text-muted">(Código producto)</small></li>
                  ${codigosBarras.map((codigo: string) =>
              `<li><code class="bg-success text-white px-2 py-1 rounded me-1">${codigo}</code> <small class="text-muted">(Código de barras)</small></li>`
            ).join('')}
                </ul>
                <hr>
                <p><strong>Código ingresado:</strong> <code class="bg-danger text-white px-2 py-1 rounded">${inputValue}</code></p>
              </div>
            `,
            icon: "error",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#dc3545",
            background: "#ffffff",
            color: "#212529"
          });

          console.log(`❌ Código incorrecto para ${rowData.CopProducto}. Esperado: ${rowData.Codigo_barras}, Ingresado: ${inputValue}`);

          // Limpiar el campo después de un momento
          setTimeout(() => {
            target.classList.remove('is-invalid');
            target.value = '';
            this.inputValues[rowData.input_field] = '';
          }, 2000);
        }
      }
    }
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.showPrepararModal = false;
    this.facturaActual = null;
    this.facturaSeleccionada = null;
    this.detalleFactura = [];
    this.productosJaula = [];
    this.productosNoJaula = [];
    this.productosValidados = [];
    this.inputValues = {};
  }

  // Método para guardar la preparación
  guardarPreparacion() {
    // Verificar productos que necesitan validación
    const productosQueNecesitanValidacion = this.detalleFactura.filter(item => item.necesitaValidacion);
    const productosNoValidados = productosQueNecesitanValidacion.filter(item => !item.validado);

    console.log('Productos que necesitan validación:', productosQueNecesitanValidacion.length);
    console.log('Productos no validados:', productosNoValidados.length);

    if (productosNoValidados.length > 0) {
      // Mostrar lista de productos faltantes
      const listadoFaltantes = productosNoValidados.map(item =>
        `• ${item.CopProducto} - ${item.Detalle.substring(0, 50)}...`
      ).join('\n');

      Swal.fire({
        title: "⚠️ Faltan códigos por validar",
        html: `
          <div class="text-start">
            <p><strong>Productos pendientes de validación:</strong></p>
            <div class="alert alert-light border text-start" style="max-height: 300px; overflow-y: auto; background-color: #f8f9fa;">
              ${productosNoValidados.map(item =>
          `<div class="mb-1">
                  <i class="fa fa-exclamation-triangle text-warning me-1"></i>
                  <strong>${item.CopProducto}</strong><br>
                  <small class="text-muted">${item.Detalle.substring(0, 60)}...</small>
                </div>`
        ).join('')}
            </div>
            <p class="text-muted">Total: <strong>${productosNoValidados.length}</strong> de <strong>${productosQueNecesitanValidacion.length}</strong> productos</p>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6c757d",
        background: "#ffffff",
        color: "#212529"
      });
      return;
    }

    // Todos los productos están validados
    const productosValidados = this.detalleFactura.filter(item => item.validado || !item.necesitaValidacion);

    Swal.fire({
      title: "✅ Validación completada",
      html: `
        <div class="text-center">
          <p class="text-success"><i class="fa fa-check-circle fa-2x mb-2"></i></p>
          <p>Todos los productos han sido validados correctamente</p>
          <p class="text-danger">Presione "Continuar" para finalizar la preparación</p>
          <p><strong>Total productos:</strong> ${this.detalleFactura.length}</p>
          <p><strong>Productos validados:</strong> ${productosValidados.length}</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#28a745"
    }).then(() => {
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      let param = {
        factura: this.facturaActual.Id,
        usrid: this.sessionData ? this.sessionData.usrid : null,
        bodegas: this.facturaSeleccionada.BODEGAS,
        solo_servicios: this.facturaActual.SoloServicios
      }

      console.log('param: ', param);

      this.FacturacionService.FinalizarPreparacion(param).subscribe({
        next: (response) => {
          console.log('response: ', response);

          if (response.success) {
            // Verificar si hay datos detallados de la operación
            if (response.data && response.data.length > 0) {
              // Verificar el estado de cada operación en el array data
              const operacionExitosa = response.data.some((item: any) =>
                item.data && item.data.length > 0 &&
                item.data.some((detalle: any) => detalle.success === "true")
              );

              const yaExiste = response.data.some((item: any) =>
                item.data && item.data.length > 0 &&
                item.data.some((detalle: any) => detalle.menssage === "ya existe registro")
              );

              if (yaExiste) {
                // Preparación ya existe
                Swal.fire({
                  title: "⚠️ Preparación ya existe",
                  html: `
                    <div class="text-start">
                      <p><strong>Factura:</strong> ${response.factura}</p>
                      <p><strong>Bodega(s):</strong> ${response.bodegas ? response.bodegas.join(', ') : 'N/A'}</p>
                      <hr>
                      <p class="text-warning">Esta factura ya fue preparada anteriormente.</p>
                    </div>
                  `,
                  icon: "warning",
                  confirmButtonText: "Entendido",
                  confirmButtonColor: "#f39c12",
                  background: "#ffffff",
                  color: "#212529"
                });
              } else if (operacionExitosa) {
                // Preparación exitosa
                Swal.fire({
                  title: "✅ Preparación Finalizada",
                  html: `
                    <div class="text-start">
                      <p><strong>Factura:</strong> ${response.factura}</p>
                      <p><strong>Bodega(s):</strong> ${response.bodegas ? response.bodegas.join(', ') : 'N/A'}</p>
                      <hr>
                      <p class="text-success">${response.message}</p>
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
                // Error en la operación
                Swal.fire({
                  title: "❌ Error en la preparación",
                  html: `
                    <div class="text-start">
                      <p><strong>Factura:</strong> ${response.factura}</p>
                      <p class="text-danger">Ocurrió un error durante la preparación.</p>
                    </div>
                  `,
                  icon: "error",
                  confirmButtonText: "Reintentar",
                  confirmButtonColor: "#dc3545",
                  background: "#ffffff",
                  color: "#212529"
                });
              }
            } else {
              // Respuesta exitosa sin detalles
              Swal.fire({
                title: "✅ Preparación Finalizada",
                html: `
                  <div class="text-start">
                    <p><strong>Factura:</strong> ${response.factura}</p>
                    <p class="text-success">${response.message}</p>
                  </div>
                `,
                icon: "success",
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#28a745",
                background: "#ffffff",
                color: "#212529"
              }).then(() => {
                this.cerrarModal();
                this.onRefreshTableData();
              });
            }
          } else {
            // Error general del servidor
            Swal.fire({
              title: "Error!",
              text: response.message || "Error al finalizar la preparación",
              icon: "error",
              confirmButtonColor: "#dc3545"
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.log('error: ', error);
          this.isLoading = false;
        }
      });

    });
  }

  private ManageEmpresa(user: any) {
    this.router.navigate(['/empresas/panel_empresa', user.tenant_uid]);
  }


  onCustomAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'refresh':
        this.onRefreshTableData();
        break;
      case 'create_user':
        // this.onCreateUser();
        break;
      default:
    }
  }

  onRefreshTableData() {
    this.loadTableData();
  }


}
