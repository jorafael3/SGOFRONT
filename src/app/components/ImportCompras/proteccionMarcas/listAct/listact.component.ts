import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MarcaListActService } from '../../../../services/importacionCompras/marcaListAct.service';
import { MarcaCrearActService } from '../../../../services/importacionCompras/marcaCrearAct.service';
import { CrearActComponent } from '../crearAct/crearact.component';

interface Marca {
  ID: string;
  Nombre: string;
}

@Component({
  selector: 'app-listact',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './listact.component.html',
  styleUrl: './listact.component.scss'
})
export class ListActComponent {
  sessionData: any = null;
  maxDate: string = '';
  marca: Marca | null = null;
  tipos: any[] = [];
  marcas: any[] = [];
  actividadSeleccionada: any = null;
  consolidadoSeleccionada: any = null;
  showModalEdit = false;
  showModalAsignGasto = false;
  showModalAddConsolidado = false;
  showPayConsolidado = false;
  showModalVerActConsolidado = false;
  showPayNotaCredito = false;
  showPayIngreso = false;
  seleccionados: any[] = [];
  nuevoConsolidado: number = 1;
  asignGastosDocs: any = null;
  documentoPago: number = 0
  ARRAY_PAGOS_SELECCIONADOS: any[] = [];
  SUMA_PAGOS_SELECCIONADOS: number = 0;

  activeTab: 'actividades' | 'consolidados' = 'actividades';

  form = {
    FECHAINI: '',
    FECHAFIN: ''
  }

  modoCheck: 'marca' | 'proveedor' = 'marca';

  formEdit = {
    tipo: '',
    marca: {} as Marca | null,
    referencia: '',
    fecha: '',
    periodo: '',
    concepto: '',
    valor: 0,
    fechaActividad: '',
    check_marca: this.modoCheck === 'marca' ? 0 : 1,
  };

  formAddCons = {
    referencia: '',
    descripcion: '',
  };

  formAsignGasto = {
    tipoDocumento: '',
    detalle_documento: '',
  }
  formAsignPago = {
    pay: '',
    empresa: '',
    valor: 0,
    documentoTipo: '',
    documento: '',
    detalledt: '',
    valordt: 0,
    saldodt: 0
  }

  Buttons_Export = ['excel'];

  public consolidadosButtons: CustomButton[] = [
    {
      label: '',
      action: 'create',
      icon: 'fa fa-plus',
      class: 'btn btn-success',
      tooltip: 'Guardar'
    },
    {
      label: '',
      action: 'pay',
      icon: 'fa fa-hand-holding-dollar',
      class: 'btn btn-primary',
      tooltip: 'Asignar Pago'
    }
  ];

  public ActividadesTableConfig: TableConfigs = {
    columns: [
      { title: 'Actividad', field_value: 'actividad_template', sort: false },
      { title: 'Marca', field_value: 'ACTIVIDAD_MARCA_NOMBRE', sort: true },
      { title: 'Tipo', field_value: 'ACTIVIDAD_TIPO', sort: true },
      { title: 'Concepto', field_value: 'ACTIVIDAD_CONCEPTO', sort: true },
      { title: 'Presupuesto', field_value: 'ACTIVIDAD_PRESUPUESTO', sort: true },
      { title: 'Consolidado', field_value: 'CONSOLIDADO_TEMPLATE', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit',
        icon: 'fa fa-edit',
        type: 'button',
        class: 'btn btn-primary btn-sm',
        tooltip: 'Editar'
      },
      {
        label: '',
        action_to_perform: 'asignarPago',
        icon: 'fa fa-money-bill',
        type: 'button',
        class: 'btn btn-success btn-sm',
        tooltip: 'Asignar Gasto'
      },
      {
        label: '',
        action_to_perform: 'delete',
        icon: 'fa fa-trash',
        type: 'button',
        class: 'btn btn-danger btn-sm',
        tooltip: 'Borrar'
      }
    ],
    data: []
  };

  public ActividadesxConsolidarTableConfig: TableConfigs = {
    columns: [
      { title: 'Actividad', field_value: 'actividad_template', sort: false },
      { title: 'Marca', field_value: 'ACTIVIDAD_MARCA_NOMBRE', sort: true },
      { title: 'Tipo', field_value: 'ACTIVIDAD_TIPO', sort: true },
      { title: 'Concepto', field_value: 'ACTIVIDAD_CONCEPTO', sort: true },
      { title: 'Presupuesto', field_value: 'ACTIVIDAD_PRESUPUESTO', sort: true },
    ],
    data: []
  };

  public ConsolidadosTableConfig: TableConfigs = {
    columns: [
      // { title: 'Consolidado', field_value: 'CONSOLIDADO_ID', sort: true },
      { title: 'Consolidado', field_value: 'consolidado_template', sort: true },
      { title: 'Concepto', field_value: 'CONSOLIDADO_DESCRIPCION', sort: true },
      { title: 'Actividades', field_value: 'ACTIVIDADES_CANTIDAD', sort: true },
      { title: 'Presupuesto', field_value: 'ACTIVIDAD_PRESUPUESTO', sort: true },
      { title: 'Gastos', field_value: '_SUMA_GASTOS', sort: true },
      { title: 'Saldo', field_value: '_SALDO', sort: true },
      { title: 'Pago', field_value: '_SUMA_PAGOS', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit',
        icon: 'fa fa-edit',
        type: 'button',
        class: 'btn btn-primary btn-sm',
        tooltip: 'Editar'
      },
      {
        label: '',
        action_to_perform: 'ver',
        icon: 'fa fa-eye',
        type: 'button',
        class: 'btn btn-info btn-sm',
        tooltip: 'Ver Actividades'
      }
    ],
    data: []
  };

  public ConsolidadosActTableConfig: TableConfigs = {
    columns: [
      { title: 'Actividad', field_value: 'actividad_template', sort: false },
      { title: 'Marca', field_value: 'ACTIVIDAD_MARCA_NOMBRE', sort: true },
      { title: 'Tipo', field_value: 'ACTIVIDAD_TIPO', sort: true },
      { title: 'Concepto', field_value: 'ACTIVIDAD_CONCEPTO', sort: true },
      { title: 'Presupuesto', field_value: 'ACTIVIDAD_PRESUPUESTO', sort: true },
      { title: 'Consolidado', field_value: 'CONSOLIDADO_TEMPLATE', sort: true }
    ],
    data: []
  };

  constructor(private service: MarcaListActService, private serviceEdit: MarcaCrearActService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.form.FECHAFIN = this.maxDate;
  }

  private convertirFecha(fecha: string): string {
    return fecha ? fecha.replace(/-/g, '') : '';
  }

  Cargar_Datos_Actividades() {
    const param = {
      FECHAINI: this.convertirFecha(this.form.FECHAINI),
      FECHAFIN: this.convertirFecha(this.form.FECHAFIN)
    }
    this.service.marca_creada(param).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.ConsolidadosTableConfig = {
          ...this.ConsolidadosTableConfig,
          data: res.consolidadas.map((x: any) => ({
            ...x,
            consolidado_template: `
      <div>
        <div><strong>Consolidado:</strong> #${x.CONSOLIDADO_ID}</div>
        <strong>Fecha Creación:</strong> ${x.CONSOLIDADO_CREADO_FECHA}
        <strong>Creado Por:</strong> ${x.CONSOLIDADO_CREADO_POR}
        <strong>Referencia:</strong> ${x.CONSOLIDADO_REFERENCIA}
      </div>
    `
          }))
        };
        this.ActividadesTableConfig = {
          ...this.ActividadesTableConfig,
          data: res.individuales.map((x: any) => ({
            ...x,
            CONSOLIDADO_TEMPLATE: x.consolidado_id
              ? `<div>#${x.consolidado_id}</div>`
              : " - ",
            actividad_template: `
      <div>
        <div><strong>Actividad:</strong> #${x.ACTIVIDAD_ID}</div>
        <strong>Fecha creación:</strong> ${x.ACTIVIDAD_FECHA_CREADA}
        <strong>Referencia:</strong> ${x.ACTIVIDAD_REFERENCIA}
      </div>
    `
          }))
        };
        this.ActividadesxConsolidarTableConfig = {
          ...this.ActividadesxConsolidarTableConfig,
          data: res.individuales.filter((x: any) => x.consolidado == 0).map((x: any) => ({
            ...x,
            actividad_template: `
      <div>
        <div><strong>Actividad:</strong> #${x.ACTIVIDAD_ID}</div>
        <strong>Fecha creación:</strong> ${x.ACTIVIDAD_FECHA_CREADA}
        <strong>Referencia:</strong> ${x.ACTIVIDAD_REFERENCIA}
      </div>
    `
          }))
        };
      }
    });
  }

  // Actividades
  onActAction(action: TableClickedAction) {
    this.actividadSeleccionada = action.data;
    switch (action.action_to_perform) {
      case 'edit':
        this.abrirModalEditAct();
        this.Cargar_Tipos_Marcas();
        this.Cargar_Marcas();
        setTimeout(() => {
          this.cargarDatosEnFormulario(action.data);
        }, 150);
        console.log('Edit')
        break;
      case 'asignarPago':
        this.abrirModalAsignGastoAct();
        console.log(this.actividadSeleccionada)
        console.log('asignarPago')
        break;
      case 'delete':
        if (this.actividadSeleccionada.consolidado == 0) {
          this.Eliminar_linea(this.actividadSeleccionada.ACTIVIDAD_ID)
        } else {
          Swal.fire('Error', 'Actividad No se puede Eliminar porque esta Consignada', 'error');
        }
        console.log('delete')
        break;
      default:
        break;
    }
  }

  // Consolidados
  onListAction(action: TableClickedAction) {
    this.consolidadoSeleccionada = action.data
    switch (action.action_to_perform) {
      case 'edit':
        this.nuevoConsolidado = 0;
        this.Limpiar_campos();
        this.limpiarSeleccionActividadesXConsolidar();
        this.llenarFormConsolidado(action.data);
        this.abrirModalAddConsolidado();
        console.log(this.consolidadoSeleccionada)
        console.log('Edit')
        break;
      case 'ver':
        this.llenarVerConsolidado(action.data);
        this.abrirModalVerActConsolidado();
        console.log(this.consolidadoSeleccionada)
        console.log('Ver')
        break;
      default:
        break;
    }
  }

  onListConsAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'create':
        this.nuevoConsolidado = 1;
        this.Limpiar_campos();
        this.limpiarSeleccionActividadesXConsolidar();
        this.abrirModalAddConsolidado();
        console.log('Create')
        break;
      case 'pay':
        this.Limpiar_campos();
        this.limpiarSeleccionConsolidar();
        this.tooglePayConsolidado();
        console.log('Pay')
        break;
      default:
        break;
    }
  }
  onRowsSelected(rows: any) {
    console.log(rows)
    this.seleccionados = rows;
    this.recalcularSuma(rows);
  }
  recalcularSuma(filas: any[]) {
    let suma = 0;
    filas.forEach(row => {
      const v = row?._SALDO ?? row?.ACTIVIDAD_PRESUPUESTO ?? 0;
      const n = parseFloat((v ?? 0).toString());
      if (!isNaN(n)) suma += n;
    });
    this.SUMA_PAGOS_SELECCIONADOS = suma;
    this.formAsignPago.valor = suma;
  }

  abrirModalEditAct() {
    this.showModalEdit = true;
  }
  cerrarModalEditAct() {
    this.showModalEdit = false;
    this.Limpiar_campos();
  }
  abrirModalAsignGastoAct() {
    this.showModalAsignGasto = true;
  }
  cerrarModalAsignGastoAct() {
    this.showModalAsignGasto = false;
    this.Limpiar_campos();
  }
  abrirModalAddConsolidado() {
    this.showModalAddConsolidado = true;
  }
  cerrarModalAddConsolidado() {
    this.showModalAddConsolidado = false;
    this.limpiarSeleccionActividadesXConsolidar();
    this.Limpiar_campos();
  }
  abrirModalVerActConsolidado() {
    this.showModalVerActConsolidado = true;
  }
  cerrarModalVerActConsolidado() {
    this.showModalVerActConsolidado = false;
    this.Limpiar_campos();
  }
  tooglePayConsolidado() {
    this.showPayConsolidado = !this.showPayConsolidado;
    this.showPayIngreso = false;
    this.showPayNotaCredito = false;
    this.Limpiar_campos();
    this.limpiarSeleccionConsolidar();
  }
  tooglePayNotaCredito() {
    this.showPayNotaCredito = !this.showPayNotaCredito;
    this.formAsignPago.pay = this.showPayNotaCredito ? 'NOTA_CREDITO' : '';
    if (this.showPayNotaCredito) {
      this.showPayIngreso = false;
    }
    this.Limpiar_campos();
    this.limpiarSeleccionConsolidar();
  }
  tooglePayIngreso() {
    this.showPayIngreso = !this.showPayIngreso;
    if (this.showPayIngreso) {
      this.formAsignPago.pay = this.showPayIngreso ? 'INGRESO' : '';
      this.showPayNotaCredito = false;
    }
    this.Limpiar_campos();
    this.limpiarSeleccionConsolidar();
  }

  // Consolidado
  llenarFormConsolidado(data: any) {
    this.formAddCons = {
      referencia: data.CONSOLIDADO_REFERENCIA || '',
      descripcion: data.CONSOLIDADO_DESCRIPCION || '',
    };
    this.consolidadoSeleccionada = data;
    const detalles: any[] = data._detalle_actividades ? [...data._detalle_actividades] : [];
    const mapToRow = (x: any) => ({
      ...x,
      actividad_template: `
        <div>
          <div><strong>Actividad:</strong> #${x.ACTIVIDAD_ID}</div>
          <strong>Fecha creación:</strong> ${x.ACTIVIDAD_FECHA}
          <strong>Referencia:</strong> ${x.ACTIVIDAD_REFERENCIA}
        </div>
      `,
      ACTIVIDAD_PRESUPUESTO: x.ACTIVIDAD_VALOR,
      is_checked: true
    });
    const consolidadoRows = detalles.map(mapToRow);
    const disponibles = (this.ActividadesxConsolidarTableConfig?.data || []) as any[];
    const disponiblesFiltradas = disponibles.filter(d => !detalles.some(c => c.ACTIVIDAD_ID === d.ACTIVIDAD_ID)).map(d => ({ ...d, is_checked: false }));
    // const disponiblesFiltradas = disponibles.filter(d => !detalles.some(c => c.ACTIVIDAD_ID === d.ACTIVIDAD_ID));
    const combined = [...consolidadoRows, ...disponiblesFiltradas];
    this.ActividadesxConsolidarTableConfig = {
      ...this.ActividadesxConsolidarTableConfig,
      data: combined
    };
    this.seleccionados = consolidadoRows.map(r => r);
  }
  llenarVerConsolidado(data: any) {
    const detalles: any[] = data._detalle_actividades ? [...data._detalle_actividades] : [];
    this.ConsolidadosActTableConfig = {
      ...this.ConsolidadosActTableConfig,
      data: detalles.map((x: any) => ({
        ...x,
        CONSOLIDADO_TEMPLATE: x.consolidado_id
          ? `<div>#${x.consolidado_id}</div>`
          : " - ",
        actividad_template: `
      <div>
        <div><strong>Actividad:</strong> #${x.ACTIVIDAD_ID}</div>
        <div><strong>Fecha creación:</strong> ${x.ACTIVIDAD_FECHA}</div>
        <div><strong>Referencia:</strong> ${x.ACTIVIDAD_REFERENCIA}</div>
      </div>
    `
      }))
    };
  }
  limpiarFormConsolidado() {

  }

  // Limpia la selección de actividades en la tabla de ActividadesxConsolidar
  limpiarSeleccionActividadesXConsolidar(): void {
    try {
      const rows = (this.ActividadesxConsolidarTableConfig?.data || []) as any[];
      const cleaned = rows.map(r => {
        const copy = { ...r };
        if (copy.hasOwnProperty('is_checked')) copy.is_checked = false;
        return copy;
      });
      this.ActividadesxConsolidarTableConfig = {
        ...this.ActividadesxConsolidarTableConfig,
        data: cleaned
      };
      this.seleccionados = [];
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error limpiando selección ActividadesxConsolidar', err);
    }
  }
  limpiarSeleccionConsolidar(): void {
    try {
      const rows = (this.ConsolidadosTableConfig?.data || []) as any[];
      const cleaned = rows.map(r => {
        const copy = { ...r };
        if (copy.hasOwnProperty('is_checked')) copy.is_checked = false;
        return copy;
      });
      this.ConsolidadosTableConfig = {
        ...this.ConsolidadosTableConfig,
        data: cleaned
      };
      this.seleccionados = [];
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error limpiando selección Consolidar', err);
    }
  }
  crearConsolidado(data?: any) {
    let referencia = this.formAddCons.referencia;
    let descripcion = this.formAddCons.descripcion;
    let CONSOLIDADO_ID = data?.CONSOLIDADO_ID ?? '';
    let CONSOLIDADO_NUEVO = this.nuevoConsolidado;
    const datos: any[] = [...this.seleccionados];
    const param = {
      DATOS: datos,
      CONSOLIDADO_ID: CONSOLIDADO_ID,
      CONSOLIDADO_NUEVO: CONSOLIDADO_NUEVO,
      REFERENCIA: referencia,
      DESCRIPCION: descripcion,
    }
    this.service.Consolidar_Actividades(param).subscribe({
      next: (res: any) => {
        if (!res.success) { Swal.fire('Error', 'No se pudo Crear Consolidado', 'error'); return; }
        Swal.fire('Éxito', 'Consolidado guardada correctamente', 'success');
        this.cerrarModalAddConsolidado();
        this.Cargar_Datos_Actividades();
      }
    });
  }
  Validar_Pago() {
    let PG_NUMERO_DOCUMENTO = this.formAsignPago.documento;
    let DOCUMENTO = this.formAsignPago.pay;
    let empresa = this.formAsignPago.empresa;
    let tipoDocumentoValor = this.formAsignPago.documentoTipo;
    let param = {
      PG_NUMERO_DOCUMENTO: PG_NUMERO_DOCUMENTO,
      DOCUMENTO: DOCUMENTO,
      empresa: empresa,
      tipoDocumentoValor: tipoDocumentoValor
    }
    console.log(param)
    // return;
    if (PG_NUMERO_DOCUMENTO == "") { Swal.fire("Debe ingresar un numero de documento", "", "error"); return; }
    // Show loading modal until the request completes
    Swal.fire({
      title: 'Validando documento',
      html: 'Espere por favor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.service.Validar_Pagos(param).subscribe({
          next: (res: any) => {
            Swal.close();
            console.log(res)
            if (!res.success) { Swal.fire('Error', 'No se pudo Validar Documento', 'error'); return; }
            if (res.data && res.data.length > 0) {
              this.ARRAY_PAGOS_SELECCIONADOS = res.data;
              this.formAsignPago.detalledt = res.data[0].DOC_DETALLE
              this.formAsignPago.valordt = res.data[0].DOC_VALOR
              this.formAsignPago.saldodt = res.data[0].SALDO
              console.log('Log ARRAY_PAGOS_SELECCIONADOS ', this.ARRAY_PAGOS_SELECCIONADOS);
              console.log('Log FormAsignPago ', this.formAsignPago);
              Swal.fire('Éxito', 'Pago validado correctamente', 'success');
            } else {
              Swal.fire('No existe un Pago con ese numero de documento', '', 'error')
            }
          },
          error: (err: any) => {
            Swal.close();
            console.error('Validar_Pagos error', err);
            Swal.fire('Error', 'Ocurrió un error al validar el documento', 'error');
          }
        });
      }
    });
  }
  Agregar_Pago() {
    let Valor_Aplicar = this.SUMA_PAGOS_SELECCIONADOS || 0;
    let param = {
      Valor_Aplicar: this.SUMA_PAGOS_SELECCIONADOS,
      ARRAY_PAGOS_SELECCIONADOS: this.ARRAY_PAGOS_SELECCIONADOS,
      CONSOLIDADOS_SELECCIONADOS: this.seleccionados
    }
    console.log('param: ', param);
    if (this.seleccionados.length == 0) {
      Swal.fire("Debe seleccionar al menos un consolidado", "", "error");
      return;
    }
    if (this.ARRAY_PAGOS_SELECCIONADOS.length == 0) {
      Swal.fire("Debe buscar un pago antes de agregarlo", "", "error");
      return;
    }
    if (Valor_Aplicar <= 0) {
      Swal.fire("No se han ingresado valores a aplicar", "", "error");
      return;
    }
    if (this.ARRAY_PAGOS_SELECCIONADOS[0].SALDO < Valor_Aplicar) {
      Swal.fire("El valor a aplicar es mayor que el saldo disponible", "", "error");
      return;
    }
    Swal.fire({
      title: "Se agregará el pago?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agregarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Agregar_Pago(param).subscribe({
          next: (res: any) => {
            if (!res.success) { Swal.fire('Error', 'No se pudo Agregar el Pago', 'error') }
            Swal.fire('Éxito', 'Pago agregado Correctamente', 'success')

          }
        })
      }
    })
  }

  /////////////// ACTIVIDADES
  private cargarDatosEnFormulario(data: any) {
    const fechaActividad = data.ACTIVIDAD_FECHA?.split(" ")[0] || "";
    const fechaCreada = data.ACTIVIDAD_FECHA_CREADA?.split(" ")[0] || "";
    this.formEdit = {
      tipo: data.ACTIVIDAD_TIPO_ID || '',
      marca: this.marcas.find(m => m.Nombre === data.ACTIVIDAD_MARCA_NOMBRE) || null,
      referencia: data.ACTIVIDAD_REFERENCIA || '',
      fecha: fechaCreada || '',
      periodo: data.ACTIVIDAD_PERIODO || '',
      concepto: data.ACTIVIDAD_CONCEPTO || '',
      valor: data.ACTIVIDAD_PRESUPUESTO || 0,
      fechaActividad: fechaActividad || '',
      check_marca: data.CHECK_MARCA ?? 0
    };

    this.modoCheck = this.formEdit.check_marca === 0 ? 'marca' : 'proveedor';
  }
  onCheckMarcaChange(): void {
    this.Cargar_Marcas();
  }
  private mostrarAlerta(fieldName: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: `El campo "${fieldName}" es obligatorio.`,
      confirmButtonText: 'Aceptar'
    });
  }
  Actualizar_actividad() {
    const isValueInvalid = (value: string | number | null | undefined): boolean => {
      return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    };
    if (isValueInvalid(this.formEdit.fechaActividad)) {
      this.mostrarAlerta('Fecha de Actividad');
      return;
    }
    if (isValueInvalid(this.formEdit.tipo)) {
      this.mostrarAlerta('Tipo');
      return;
    }
    if (isValueInvalid(this.formEdit.marca?.ID)) {
      const fieldName = this.modoCheck === 'marca' ? 'Marca' : 'Proveedor';
      this.mostrarAlerta(fieldName);
      return;
    }
    if (isValueInvalid(this.formEdit.referencia)) {
      this.mostrarAlerta('Referencia');
      return;
    }
    if (isValueInvalid(this.formEdit.periodo)) {
      this.mostrarAlerta('Periodo');
      return;
    }
    if (this.formEdit.valor === null || this.formEdit.valor <= 0) {
      this.mostrarAlerta('Valor');
      return;
    }
    if (isValueInvalid(this.formEdit.concepto)) {
      this.mostrarAlerta('Concepto');
      return;
    }
    const param = {
      Tipo: this.formEdit.tipo,
      MarcaID: this.formEdit.marca?.ID,
      MarcaNombre: this.formEdit.marca?.Nombre,
      Referencia: this.formEdit.referencia,
      Periodo: this.formEdit.periodo,
      Concepto: this.formEdit.concepto,
      valor: this.formEdit.valor,
      Fecha_actividad: this.formEdit.fechaActividad,
      Cheek_marca: this.formEdit.check_marca,
      Actividad_ID: this.actividadSeleccionada.ACTIVIDAD_ID
    }
    // return;
    this.service.Actualizar_actividad(param).subscribe({
      next: (res: any) => {
        if (!res.success) { Swal.fire('Error', 'No se pudo Editar la actividad', 'error'); return; }
        Swal.fire('Éxito', 'Actividad guardada correctamente', 'success');
        this.cerrarModalEditAct();
        this.Cargar_Datos_Actividades();
      }
    });
  }
  Eliminar_linea(ID_Marca: any) {
    const param = {
      ID_Marca: ID_Marca
    }
    this.service.Eliminar_actividad_creada(param).subscribe({
      next: (res: any) => {
        if (!res.success) { Swal.fire('Error', 'No se pudo Eliminar la actividad', 'error'); return; }
        Swal.fire('Éxito', 'Actividad Eliminada correctamente', 'success');
        this.Cargar_Datos_Actividades();
      }
    });
  }
  Limpiar_campos(): void {
    this.consolidadoSeleccionada = null;
    this.seleccionados = [];
    this.formEdit = {
      tipo: '',
      marca: null,
      referencia: '',
      fecha: '',
      periodo: '',
      concepto: '',
      valor: 0,
      fechaActividad: '',
      check_marca: this.modoCheck === 'marca' ? 0 : 1,
    };
    this.formAddCons = {
      referencia: '',
      descripcion: '',
    };
    this.formAsignGasto = {
      tipoDocumento: '',
      detalle_documento: '',
    };
    this.formAsignPago = {
      pay: '',
      empresa: '',
      valor: 0,
      documentoTipo: '',
      documento: '',
      detalledt: '',
      valordt: 0,
      saldodt: 0
    };
    this.asignGastosDocs = '';
    this.documentoPago = 0;
    this.ARRAY_PAGOS_SELECCIONADOS = [];
    this.SUMA_PAGOS_SELECCIONADOS = 0;
    this.formAsignPago.valor = 0;
    this.cdr.detectChanges();
  }
  Cargar_Tipos_Marcas() {
    this.service.Cargar_Tipos_Marcas().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.tipos = res.data;
      }
    });
  }
  Cargar_Marcas() {
    const params = {
      marca: this.modoCheck === 'marca' ? 0 : 1
    };
    this.serviceEdit.Cargar_Marcas(params).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.marcas = res.data;
      }
    });
  }
  Buscar_Documentos() {
    if (!this.formAsignGasto.tipoDocumento) {
      Swal.fire('Error', 'Seleccione un tipo de documento', 'warning');
      return;
    }
    if (!this.formAsignGasto.detalle_documento) {
      Swal.fire('Error', 'Ingrese el detalle del documento', 'warning');
      return;
    }
    const param = {
      Tipo_Documento: this.formAsignGasto.tipoDocumento,
      Dt_Documento: this.formAsignGasto.detalle_documento
    }
    this.service.Buscar_Documentos(param).subscribe({
      next: (res: any) => {
        console.log(res)//0400003216
        if (!res.success) { Swal.fire('Sin resultados', 'No se encontraron documentos que coincidan', 'info'); return; }
        this.asignGastosDocs = Array.isArray(res.data) ? res.data : [res.data];
        this.asignGastosDocs.forEach((d: any) => d.valorAplicar = 0);
        console.log('AsignGastosDocs', this.asignGastosDocs)
        Swal.fire('Éxito', `Se encontró documento`, 'success');
      }
    });
  }
  Aplicar_Documento(doc: any) {
    const Valor_Aplicar = Number(doc?.valorAplicar) || 0;
    const Actividad_ID = this.actividadSeleccionada?.ACTIVIDAD_ID;
    const Tipo_Documento = this.formAsignGasto.tipoDocumento;
    const Id_Documento = doc;

    const ARRAY_DOCUMENTOS_SELECCIONADOS = [doc];

    if (doc?.SALDO < Valor_Aplicar) {
      Swal.fire('Error', 'El valor a aplicar no puede ser mayor al saldo del documento');
      return;
    }
    if (Valor_Aplicar <= 0) {
      Swal.fire('Error', 'El valor a aplicar no puede ser 0');
      return;
    }
    const param = {
      Valor_Aplicar: Valor_Aplicar,
      Consolidado_id: Actividad_ID,
      ARRAY_DOCUMENTOS_SELECCIONADOS: ARRAY_DOCUMENTOS_SELECCIONADOS,
      Tipo_Documento: Tipo_Documento,
      Id_Documento: Id_Documento
    };
    console.log('Aplicar_Documento param', param);

    Swal.fire({
      title: 'Se agregará el gasto?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, agregarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.GUARDAR_DATOS(param).subscribe({
          next: (res: any) => {
            console.log(res);
            if (!res.success) { Swal.fire('Error', 'No se pudo guardar el gasto', 'error'); return; }
            if (res.success) { Swal.fire('Exito', 'Gasto Agregado Correctamente', 'success'); }
            // this.cerrarModalAsignGastoAct();
            this.Cargar_Datos_Actividades();
          }
        });
      }
    });
  }

}