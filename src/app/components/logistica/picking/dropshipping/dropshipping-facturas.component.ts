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
  selector: 'app-dropshipping-facturas',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './dropshipping-facturas.component.html',
  styleUrl: './dropshipping-facturas.component.scss'
})
export class DropshippingFacturasComponent {
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

  // Datos de despacho
  tipoDespacho: string = '';
  tiendaDestino: string = '';
  direccionEnvio: string = '';
  referenciaEnvio: string = '';
  telefonoEnvio: string = '';
  emailEnvio: string = '';
  comentarioDespacho: string = '';

  // Opciones para los selects
  formasDespacho: any[] = [];
  tiendas: any[] = [];

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


  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };



    this.FacturacionService.GetFacturasDropshipping(param).subscribe({
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

    this.FacturacionService.GetInfoDespacho(param).subscribe({
      next: (response) => {

        if (response.success) {
          // Almacenar datos de formas de despacho y tiendas
          this.formasDespacho = response.forma_Despacho || [];
          this.tiendas = response.tiendas || [];


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
    console.log('data: ', data);


    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.ID_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };


    this.FacturacionService.GetFacturasDatosDropshipping(param).subscribe({
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
  }
  // Método para manejar el input en cada fila del detalle
  // Método para cerrar el modal
  cerrarModal() {
    this.showPrepararModal = false;
    this.facturaActual = null;
    this.facturaSeleccionada = null;
    this.detalleFactura = [];
    this.productosJaula = [];
    this.productosNoJaula = [];

    // Limpiar datos de despacho
    this.tipoDespacho = '';
    this.tiendaDestino = '';
    this.direccionEnvio = '';
    this.referenciaEnvio = '';
    this.telefonoEnvio = '';
    this.emailEnvio = '';
    this.comentarioDespacho = '';
  }

  // Método para guardar la preparación
  guardarPreparacion() {
    // Validar que se haya seleccionado un tipo de despacho
    if (!this.tipoDespacho || this.tipoDespacho === '') {
      Swal.fire({
        title: "⚠️ Validación requerida",
        text: "Debe seleccionar un tipo de entrega",
        icon: "warning",
        confirmButtonColor: "#f39c12"
      });
      return;
    }

    let datosDespacho: any = {
      tipo: this.tipoDespacho,
      tienda: null,
      direccion: null,
      referencia: null,
      telefono: null,
      email: null
    };

    // Validar según el tipo de despacho seleccionado
    if (this.tipoDespacho === '1') {
      // Entrega en Tienda - Puede tener comentario opcional
      datosDespacho.comentario = this.comentarioDespacho || '';
      console.log('Entrega en Tienda seleccionada');
    }
    else if (this.tipoDespacho === '2') {
      // Entrega en Otra Tienda - Validar que se haya seleccionado una tienda
      if (!this.tiendaDestino || this.tiendaDestino === '') {
        Swal.fire({
          title: "⚠️ Validación requerida",
          text: "Debe seleccionar una tienda de destino",
          icon: "warning",
          confirmButtonColor: "#f39c12"
        });
        return;
      }
      datosDespacho.tienda = this.tiendaDestino;
      datosDespacho.comentario = this.comentarioDespacho || '';
      console.log('Entrega en otra tienda:', this.tiendaDestino);
    }
    else if (this.tipoDespacho === '3') {
      // Envío a Domicilio - Validar todos los campos requeridos
      const validaciones = [];

      if (!this.direccionEnvio || this.direccionEnvio.trim() === '') {
        validaciones.push('• Dirección');
      }
      if (!this.referenciaEnvio || this.referenciaEnvio.trim() === '') {
        validaciones.push('• Referencia');
      }
      if (!this.telefonoEnvio || this.telefonoEnvio.trim() === '') {
        validaciones.push('• Teléfono');
      }
      if (!this.emailEnvio || this.emailEnvio.trim() === '') {
        validaciones.push('• Email');
      }

      if (validaciones.length > 0) {
        Swal.fire({
          title: "⚠️ Campos faltantes",
          html: `
            <div class="text-start">
              <p>Los siguientes campos son requeridos para envío a domicilio:</p>
              <ul class="list-unstyled">
                ${validaciones.map(v => `<li class="text-danger fw-bold">${v}</li>`).join('')}
              </ul>
            </div>
          `,
          icon: "warning",
          confirmButtonColor: "#f39c12"
        });
        return;
      }

      // Validar formato del email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailEnvio)) {
        Swal.fire({
          title: "⚠️ Email inválido",
          text: "Por favor ingrese un email válido",
          icon: "warning",
          confirmButtonColor: "#f39c12"
        });
        return;
      }

      // Validar teléfono (solo números y caracteres comunes)
      const telefonoRegex = /^[0-9+\-\s()]+$/;
      if (!telefonoRegex.test(this.telefonoEnvio)) {
        Swal.fire({
          title: "⚠️ Teléfono inválido",
          text: "Por favor ingrese un teléfono válido",
          icon: "warning",
          confirmButtonColor: "#f39c12"
        });
        return;
      }

      datosDespacho.direccion = this.direccionEnvio.trim();
      datosDespacho.referencia = this.referenciaEnvio.trim();
      datosDespacho.telefono = this.telefonoEnvio.trim();
      datosDespacho.email = this.emailEnvio.trim();

    }

    // Mostrar resumen de datos de despacho
    let resumenDespacho = '';
    if (this.tipoDespacho === '0' || this.tipoDespacho === '1') {
      resumenDespacho = `
        <p><strong>Tipo:</strong> Entrega en Tienda</p>
        ${this.comentarioDespacho ? `<p><strong>Comentario:</strong> ${this.comentarioDespacho}</p>` : ''}
      `;
    } else if (this.tipoDespacho === '2') {
      const tienda = this.tiendas.find(t => t.ID === this.tiendaDestino);
      resumenDespacho = `
        <p><strong>Tipo:</strong> Entrega en otra Tienda</p>
        <p><strong>Tienda:</strong> ${tienda?.codigo} - ${tienda?.Nombre}</p>
        ${this.comentarioDespacho ? `<p><strong>Comentario:</strong> ${this.comentarioDespacho}</p>` : ''}
      `;
    } else if (this.tipoDespacho === '3') {
      resumenDespacho = `
        <div class="text-start">
          <p><strong>Tipo:</strong> Envío a Domicilio</p>
          <p><strong>Dirección:</strong> ${this.direccionEnvio}</p>
          <p><strong>Referencia:</strong> ${this.referenciaEnvio}</p>
          <p><strong>Teléfono:</strong> ${this.telefonoEnvio}</p>
          <p><strong>Email:</strong> ${this.emailEnvio}</p>
        </div>
      `;
    }

    // Mostrar confirmación con los datos
    Swal.fire({
      title: "⚠️ Confirmar Datos de Despacho",
      html: resumenDespacho,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "✅ Sí, Guardar",
      cancelButtonText: "❌ Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545"
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí irá la lógica para enviar al backend


        // Convertir null a string vacío
        const param = {
          factura: this.facturaSeleccionada.cabecera[0].Id,
          bodegas: this.facturaSeleccionada.BODEGAS,
          tipo: datosDespacho.tipo || '',
          tienda: datosDespacho.tienda || '',
          direccion: datosDespacho.direccion || '',
          referencia: datosDespacho.referencia || '',
          telefono: datosDespacho.telefono || '',
          email: datosDespacho.email || '',
          comentario: datosDespacho.comentario || ''
        };
          console.log('param: ', param);

        this.FacturacionService.GuardarDropshipping(param).subscribe({
          next: (response) => {
            console.log('response: ', response);
            if (response.success) {
              // Almacenar datos de formas de despacho y tiendas
              Swal.fire("Éxito!", "Datos de despacho guardados correctamente.", "success");
              this.cerrarModal();
              this.loadTableData();

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
