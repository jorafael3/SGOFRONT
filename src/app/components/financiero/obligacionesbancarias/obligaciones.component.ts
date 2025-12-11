import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BancoService } from '../../../services/financiero/banco.service';

@Component({
  selector: 'app-obligaciones-bancarias',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './obligaciones.component.html',
  styleUrl: './obligaciones.component.scss'
})
export class ObligacionesBancariasComponent {
  public sessionData: any = null;
  public Usuarios_Datos: any[] = [];
  public isLoading = false;
  public tiposObligaciones: any[] = [];
  public listProveedores: any[] = [];
  public showModalProveedor = false;
  public filtroProveedor = '';
  private amortizacionSeleccionada: any | null = null;

  activeTab: 'nueva' | 'lista' = 'nueva';
  modoInteres: 'compuesto' | 'simple' = 'compuesto';
  // asd
  form = {
    capital: 0,
    tna: 0,
    cuotas: 12,
    fechaInicio: '',
    otros: 0,
    referencia: '',
    tipoAmortizacion: 1,
    tipoObligacion: "",
    proveedor: '',
    proveedorId: '',
    tasaMensual: 0,
    cuotaFija: 0,
  };
  resumen = {
    capital: 0,
    tasa: 0,
    plazo: 0,
    cuota: 0,
    intereses: 0,
    total: 0,
    proveedor: '',
  };
  showModalRecalculo = false;
  recalculoResumen: any = {
    capital: 0,
    tasa: 0,
    plazo: 0,
    fechaInicio: '',
    otros: 0,
    tasaMensual: 0,
    cuotaFija: 0,
    tipoAmortizacion: ''
  };
  detalleRecalculo: any[] = [];
  reajusteForm = {
    cuota: 0,
    saldoCapital: 0,
    tasa: 0,
    fechaPago: '',
    cuotasFaltantes: 0,
    tasaMensual: 0,
    cuotaFija: 0
  };

  Buttons_Export = ['excel'];

  public listaButtons: CustomButton[] = [
    {
      label: '',
      action: 'refresh',
      icon: 'fa fa-refresh',
      class: 'btn btn-success',
      tooltip: 'Actualizar datos'
    }
  ];
  public amortizacionButtons: CustomButton[] = [
    {
      label: '',
      action: 'save',
      icon: 'fa fa-save',
      class: 'btn btn-success',
      tooltip: 'Guardar'
    }
  ];

  public listaTableConfig: TableConfigs = {
    columns: [
      { title: 'Amortizacion #', field_value: 'id', sort: true },
      { title: 'Detalle', field_value: 'detalle', sort: true },
      { title: 'Capital', field_value: 'capital', sort: true },
      { title: 'Tasa', field_value: 'tasa', sort: true },
      { title: 'Plazo', field_value: 'plazo', sort: true },
      { title: 'Sistema', field_value: 'sistema', sort: true },
      { title: 'Fecha de Creación', field_value: 'creado_date', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit',
        icon: 'fa fa-edit',
        type: 'button',
        class: 'btn btn-primary btn-sm',
        tooltip: 'Reajuste'
      }
    ],
    data: []
  };

  public amortizacionTableConfig: TableConfigs = {
    columns: [
      { title: 'N° de Cuota', field_value: 'cuota', sort: true },
      { title: 'Fecha a Pagar', field_value: 'fechaPago', sort: true },
      { title: 'Valor Capital', field_value: 'pagoTotal', sort: true },
      { title: 'Interes del Período', field_value: 'interes', sort: true },
      { title: 'Otros', field_value: 'otros', sort: true },
      { title: 'Cuota (constante)', field_value: 'abonoCapital', sort: true },
      { title: 'Saldo', field_value: 'saldo', sort: true }
    ],
    data: []
  };

  public reajusteTableConfig: TableConfigs = {
    columns: [
      { title: 'N° de Cuota', field_value: 'cuota', sort: true },
      { title: 'Fecha a Pagar', field_value: 'fechaPago', sort: true },
      { title: 'Valor Capital', field_value: 'pagoTotal', sort: true },
      { title: 'Interes del Período', field_value: 'interes', sort: true },
      { title: 'Otros', field_value: 'otros', sort: true },
      { title: 'Cuota (constante)', field_value: 'abonoCapital', sort: true },
      { title: 'Saldo', field_value: 'saldo', sort: true }
    ],
    data: []
  };

  constructor(private BancoService: BancoService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.form.fechaInicio = this.hoy();
    this.buscarProveedor();
    this.cargarTiposObligaciones();
  }
  hoy() {
    return new Date().toISOString().split('T')[0];
  }

  actualizarResumen() {
    const capital = Number(this.form.capital) || 0;
    const tasa = Number(this.form.tna) || 0;
    const plazo = Number(this.form.cuotas) || 0;

    this.resumen.capital = capital;
    this.resumen.tasa = tasa;
    this.resumen.plazo = plazo;

    this.form.otros = (this.modoInteres === 'compuesto' && capital > 0) ? +(capital * 0.005).toFixed(2) : 0;

    if (capital > 0 && tasa > 0 && plazo > 0) {
      const tasaMensualPorcentaje = tasa / plazo;
      const tasaMensualDecimal = tasaMensualPorcentaje / 100;

      this.form.tasaMensual = +tasaMensualPorcentaje.toFixed(2);

      const cuota = this.calcularCuotaFrancesa(capital, tasaMensualDecimal, plazo);
      this.form.cuotaFija = +cuota.toFixed(2);

      const divisor = 12;
      const tasaPeriodo = (tasa / 100) / divisor;

      const cuotaEstimada = capital * tasaPeriodo / (1 - Math.pow(1 + tasaPeriodo, -plazo));
      const totalAPagar = cuotaEstimada * plazo;
      const interesTotal = totalAPagar - capital;

      this.resumen.cuota = cuotaEstimada;
      this.resumen.intereses = interesTotal;
      this.resumen.total = totalAPagar;
    } else {
      this.form.tasaMensual = 0;
      this.form.cuotaFija = 0;
      this.resumen.cuota = 0;
      this.resumen.intereses = 0;
      this.resumen.total = 0;
    }
  }

  private calcularCuotaFrancesa(monto: number, tasaMensual: number, cuotas: number): number {
    const i = tasaMensual;
    const n = cuotas;
    const numerador = i * Math.pow(1 + i, n);
    const denominador = Math.pow(1 + i, n) - 1;
    return monto * (numerador / denominador);
  }

  buscarProveedor() {
    this.BancoService.BuscarProveedor({ nombre: '' }).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.listProveedores = res.data;
        console.log("Buscar Proveedor ", res.data)
      }
    })
  }

  cargarTiposObligaciones() {
    this.BancoService.CargarTiposObligaciones().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.tiposObligaciones = res.data;
        console.log("Cargar Tipos Obligaciones ", this.tiposObligaciones)
      }
    })
  }

  calcularAmortizacion() {
    const payload = {
      capital: this.form.capital,
      tasa: this.form.tna,
      plazo: this.form.cuotas,
      tipo_pago: 12,
      tipo_amortizacion: this.form.tipoAmortizacion,
      fecha_primer_pago: this.form.fechaInicio,
      otros: this.form.otros,
      tasaMensual: this.form.tasaMensual,
      // referencia: this.form.referencia,
      cuotafija: this.form.cuotaFija
    };
    if (isNaN(this.form.capital) || isNaN(this.form.tna) || isNaN(this.form.cuotas) || this.form.capital <= 0 || this.form.tna <= 0 || this.form.cuotas <= 0) {
      Swal.fire("Error", "Por favor ingrese valores numéricos válidos mayores a cero", "error");
      return;
    }
    this.BancoService.CalcularAmortizacion(payload).subscribe({
      next: (res: any) => {
        if (!res.success) {
          Swal.fire('Error', 'Ocurrió un error al calcular.', 'error');
          return;
        }
        console.log("Calcular Amortización ", res.data)
        const fila0 = {
          abonoCapital: '-',
          cuota: 0,
          fechaPago: this.form.fechaInicio,
          interes: '-',
          otros: this.form.otros,
          pagoTotal: '-',
          saldo: this.form.capital
        }
        // this.tablaAmortizacion = res.data;
        this.amortizacionTableConfig = {
          ...this.amortizacionTableConfig,
          data: [fila0, ...res.data]
        };

        // Calcular resumen
        const totalInteres = res.data.reduce((acc: number, row: any) => acc + parseFloat(row.interes), 0);
        const totalPagado = res.data.reduce((acc: number, row: any) => acc + parseFloat(row.pagoTotal), 0);

        this.resumen = {
          capital: this.form.capital,
          tasa: this.form.tna,
          plazo: this.form.cuotas,
          cuota: parseFloat(res.data[0].pagoTotal),
          intereses: totalInteres,
          total: totalPagado,
          proveedor: this.form.proveedor
        };
      }
    })
  }

  actualizarResumenSimple(): void {
    const capital = Number(this.form.capital);
    const tasa = Number(this.form.tna);
    const plazo = Number(this.form.cuotas);

    this.resumen.capital = capital;
    this.resumen.tasa = tasa;
    this.resumen.plazo = plazo;
    this.form.otros = 0;
    this.form.tasaMensual = 0;
    this.form.cuotaFija = 0;

    if (capital > 0 && tasa > 0 && plazo > 0) {
      const intereses = (capital * tasa * plazo) / 100;
      this.resumen.intereses = intereses;
      this.resumen.total = capital + intereses;
      this.resumen.proveedor = '';
      this.resumen.cuota = 0
    } else {
      this.form.tasaMensual = 0;
      this.form.cuotaFija = 0;
      this.resumen.cuota = 0;
      this.resumen.intereses = 0;
      this.resumen.total = 0;
    }
  }

  guardarAmortizacion() {
    if (!this.amortizacionTableConfig.data || this.amortizacionTableConfig.data.length === 0) {
      Swal.fire("Error", "Primero debe calcular una tabla de amortización", "error");
      return;
    }
    if (this.modoInteres === 'compuesto') {
      if (this.form.proveedorId.length === 0) {
        Swal.fire("Error", "Por favor seleccione un proveedor antes de guardar el modelo", "error");
        return;
      }
    }
    Swal.fire({
      title: 'Guardar Amortización',
      input: 'text',
      inputLabel: 'Ingrese un nombre para la amortización',
      inputPlaceholder: 'Nombre de la amortización',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: (nombre) => {
        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio');
        } return nombre;
      }
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const params = {
        nombre: result.value,
        capital: this.form.capital,
        tasa: this.form.tna,
        plazo: this.form.cuotas,
        tipo_pago: 12,
        tipo_amortizacion: this.form.tipoAmortizacion,
        fecha_primer_pago: this.form.fechaInicio,
        tasaMensual: this.form.tasaMensual,
        otros: this.form.otros,
        cuotafija: this.form.cuotaFija,
        referencia: this.form.referencia,
        tipo_obligacion: this.form.tipoObligacion,
        proveedor: this.form.proveedorId,
        datos: this.amortizacionTableConfig.data
      };
      console.log("Params Guardar Amortización ", params)
      this.BancoService.GuardarAmortizacion(params).subscribe({
        next: (res: any) => {
          console.log("Guardar Amortización ", res)
          if (!res.success) {
            Swal.fire('Error', 'Ocurrió un error al Guardar.', 'error');
            return;
          }
          Swal.fire('Éxito', 'Amortización guardada correctamente.', 'success');
        }
      })
    });
  }

  cargarLista() {
    this.BancoService.CargarAmortizacion().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        // this.listaTableConfig.data = res.data;
        const dataTransformada = res.data.map((item: any) => ({
          ...item,
          sistema: item.tipo_amortizacion == 1 || item.tipo_amortizacion == '1'
            ? 'Francés'
            : 'Alemán'
        }));

        this.listaTableConfig = {
          ...this.listaTableConfig,
          data: dataTransformada
        };
      }
    });
  }

  onListaAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'edit':
        const row = action.data;
        console.log('Reajustar Amortización ', row);
        this.amortizacionSeleccionada = row;
        this.recalculoResumen = {
          capital: parseFloat(row.capital ?? 0),
          tasa: parseFloat(row.tasa ?? 0),
          plazo: Number(row.plazo ?? row.cuotas ?? 0),
          fechaInicio: row.fecha_inicio ?? row.fechaInicio ?? '',
          otros: parseFloat(row.otros_valores ?? 0),
          tasaMensual: parseFloat(row.tasa_mensual ?? 0),
          cuotaFija: parseFloat(row.cuota_fija ?? 0),
          tipoAmortizacion: row.tipo_amortizacion ?? ''
        };
        const detalle = (row.amortizacion_detalle ?? []).map((d: any) => ({
          cuota: Number(d.n_cuota),
          fechaPago: d.fecha_pago,
          abonoCapital: parseFloat(d.abono_capital),
          interes: parseFloat(d.interes),
          otros: parseFloat(d.otros),
          pagoTotal: parseFloat(d.cuota),
          saldo: parseFloat(d.saldo)
        }));
        this.detalleRecalculo = detalle;
        this.reajusteTableConfig = {
          ...this.reajusteTableConfig,
          data: this.detalleRecalculo
        };
        this.reajusteForm = {
          cuota: 0,
          saldoCapital: 0,
          tasa: 0,
          fechaPago: '',
          cuotasFaltantes: 0,
          tasaMensual: 0,
          cuotaFija: 0
        };
        this.showModalRecalculo = true;
        break;

      default:
        break;
    }
  }

  onAmortizacionAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'save':
        this.guardarAmortizacion();
        break;
      default:
    }
  }

  abrirModalProveedor() {
    this.showModalProveedor = true;
    this.filtroProveedor = '';
  }

  cerrarModalProveedor() {
    this.showModalProveedor = false;
    this.filtroProveedor = '';
  }

  cerrarModalRecalculo(): void {
    this.showModalRecalculo = false;
  }

  seleccionarProveedor(prov: any) {
    this.form.proveedor = prov.Nombre;
    this.form.proveedorId = prov.id;
    this.resumen.proveedor = prov.Nombre;
    this.showModalProveedor = false;
    this.filtroProveedor = '';
  }

  get proveedoresFiltrados() {
    if (!this.filtroProveedor) return this.listProveedores;
    const filtro = this.filtroProveedor.toLowerCase();
    return this.listProveedores.filter((prov: any) =>
      (prov.Nombre || '').toLowerCase().includes(filtro) ||
      (prov.id !== undefined ? String(prov.id).toLowerCase() : '').includes(filtro)
    );
  }

  onModoInteresChange(): void {
    this.limpiarFormularioYTabla();
  }

  private limpiarFormularioYTabla(): void {
    // Limpia inputs
    this.form.capital = 0;
    this.form.tna = 0;
    this.form.cuotas = 0;
    this.form.fechaInicio = '';
    this.form.referencia = '';
    this.form.tipoObligacion = '';
    this.form.otros = 0;
    this.form.tasaMensual = 0;
    this.form.cuotaFija = 0;
    this.form.proveedor = '';
    this.form.proveedorId = '';

    // Limpia resumen
    this.resumen = {
      capital: 0,
      tasa: 0,
      plazo: 0,
      cuota: 0,
      intereses: 0,
      total: 0,
      proveedor: ''
    };

    // Limpia tabla de amortización
    if (this.amortizacionTableConfig) {
      this.amortizacionTableConfig = {
        ...this.amortizacionTableConfig,
        data: []
      };
    }

    // Limpia datos de reajuste / refinanciamiento
    this.amortizacionSeleccionada = null;
    this.detalleRecalculo = [];
    this.reajusteForm = {
      cuota: 0,
      saldoCapital: 0,
      tasa: 0,
      fechaPago: '',
      cuotasFaltantes: 0,
      tasaMensual: 0,
      cuotaFija: 0
    };
    this.reajusteTableConfig = {
      ...this.reajusteTableConfig,
      data: []
    };
    this.showModalRecalculo = false;
  }


  calcularReajuste(): void {
    const {
      cuota,
      saldoCapital,
      tasa,
      fechaPago,
      cuotasFaltantes,
      tasaMensual,
      cuotaFija
    } = this.reajusteForm;

    if (
      isNaN(saldoCapital as any) ||
      isNaN(tasa as any) ||
      isNaN(cuotasFaltantes as any) ||
      isNaN(cuotaFija as any) ||
      saldoCapital <= 0 ||
      tasa <= 0 ||
      cuotasFaltantes <= 0 ||
      cuotaFija <= 0
    ) {
      Swal.fire("Error", "Por favor ingrese valores numéricos válidos mayores a cero", "error");
      return;
    }

    if (!this.amortizacionSeleccionada) {
      Swal.fire("Error", "No se ha cargado la amortización base para el reajuste", "error");
      return;
    }

    Swal.fire({
      title: 'Calculando',
      html: 'Generando tabla de amortización reajustada...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const tipoPago = Number(this.amortizacionSeleccionada.tipo_pago ?? 12);
    let tipoAmortizacion: any =
      this.amortizacionSeleccionada.tipo_amortizacion ??
      this.recalculoResumen.tipoAmortizacion ??
      1;

    if (typeof tipoAmortizacion === 'string') {
      if (!isNaN(+tipoAmortizacion)) {
        tipoAmortizacion = +tipoAmortizacion;
      } else {
        const s = tipoAmortizacion.toLowerCase();
        tipoAmortizacion = s.startsWith('franc') ? 1 : 2;
      }
    }
    const tipoAmortizacionNum = Number(tipoAmortizacion);

    const payload = {
      capital: Number(saldoCapital),
      tasa: Number(tasa),
      plazo: Number(cuotasFaltantes),
      tipo_pago: tipoPago,
      tipo_amortizacion: tipoAmortizacionNum,
      fecha_primer_pago: fechaPago,
      otros: 0,
      tasaMensual: Number(tasaMensual),
      cuotafija: Number(cuotaFija)
    };

    console.log('Payload para recalculo:', payload);

    this.BancoService.CalcularAmortizacion(payload).subscribe({
      next: (res: any) => {
        Swal.close();
        if (!res.success) {
          Swal.fire('Error', res.message || 'Error al calcular la amortización reajustada', 'error');
          return;
        }
        const nCuota = Number(this.reajusteForm.cuota);
        const arrayCompleto = this.amortizacionSeleccionada.amortizacion_detalle || [];

        const mapaACR: Record<number, string | null> = {};
        arrayCompleto.forEach((item: any) => {
          mapaACR[Number(item.n_cuota)] = item.ACR_ID || null;
        });

        const detalleAnteriorBackend = arrayCompleto.filter(
          (item: any) => Number(item.n_cuota) <= nCuota
        );

        const detalleNuevoBackend = (res.data || []).map((item: any, index: number) => {
          const nuevaCuotaNum = nCuota + index + 1;
          return {
            id: "",
            cabecera_id: this.amortizacionSeleccionada.id,
            n_cuota: String(nCuota + index + 1),
            fecha_pago: item.fechaPago,
            abono_capital: Number(item.abonoCapital).toFixed(4),
            interes: Number(item.interes).toFixed(4),
            cuota: Number(item.pagoTotal).toFixed(4),
            saldo: Number(item.saldo).toFixed(4),
            otros: Number(item.otros ?? 0).toFixed(4),
            fila_reajuste: index === 0 ? '1' : '0',
            ACR_ID: mapaACR[nuevaCuotaNum] || null
          };
        });

        const detalleFinalBackend = [...detalleAnteriorBackend, ...detalleNuevoBackend];
        const d = {
          id: this.amortizacionSeleccionada.id,
          detalle: this.amortizacionSeleccionada.detalle,
          capital: payload.capital,
          tasa: payload.tasa,
          plazo: payload.plazo,
          tipo_pago: tipoPago,
          tipo_amortizacion: tipoAmortizacionNum,
          creado_por: this.amortizacionSeleccionada.creado_por ?? "",
          creado_date: this.amortizacionSeleccionada.creado_date ?? "",
          otros_valores: 0,
          cuota_fija: payload.cuotafija,
          tasa_mensual: payload.tasaMensual,
          fecha_inicio: payload.fecha_primer_pago,
          amortizacion_detalle: detalleFinalBackend
        };

        this.amortizacionSeleccionada = d;

        this.recalculoResumen.capital = payload.capital;
        this.recalculoResumen.tasa = payload.tasa;
        this.recalculoResumen.plazo = payload.plazo;
        this.recalculoResumen.fechaInicio = payload.fecha_primer_pago;
        this.recalculoResumen.otros = payload.otros;
        this.recalculoResumen.tasaMensual = this.reajusteForm.tasaMensual;
        this.recalculoResumen.cuotaFija = this.reajusteForm.cuotaFija;
        this.recalculoResumen.tipoAmortizacion =
          tipoAmortizacionNum === 1 ? 'Francés' : 'Alemán';
        this.detalleRecalculo = detalleFinalBackend.map((d: any) => ({
          cuota: Number(d.n_cuota),
          fechaPago: d.fecha_pago,
          abonoCapital: Number(d.abono_capital),
          interes: Number(d.interes),
          otros: Number(d.otros),
          pagoTotal: Number(d.cuota),
          saldo: Number(d.saldo)
        }));

        this.reajusteTableConfig = {
          ...this.reajusteTableConfig,
          data: this.detalleRecalculo
        };

        Swal.fire('Éxito', 'Amortización reajustada calculada correctamente.', 'success');
      },
      error: (err: any) => {
        Swal.close();
        console.error(err);
        Swal.fire('Error', 'Ocurrió un error al calcular la amortización reajustada', 'error');
      }
    });
  }

  actualizarReajuste(): void {
    const nCuota = Number(this.reajusteForm.cuota) || 0;
    const tasaNueva = Number(this.reajusteForm.tasa) || 0;
    const plazoTotal = Number(this.recalculoResumen.plazo) || 0;

    if (!nCuota || nCuota <= 0 || !plazoTotal) {
      this.reajusteForm.saldoCapital = 0;
      this.reajusteForm.cuotasFaltantes = 0;
      this.reajusteForm.fechaPago = '';
    } else {
      const cuotaRow = this.detalleRecalculo.find((x: any) => Number(x.cuota) === nCuota);

      if (!cuotaRow) {
        this.reajusteForm.saldoCapital = 0;
        this.reajusteForm.cuotasFaltantes = 0;
        this.reajusteForm.fechaPago = '';
      } else {
        this.reajusteForm.saldoCapital = Number(cuotaRow.saldo) || 0;
        this.reajusteForm.fechaPago = cuotaRow.fechaPago || cuotaRow.fecha_pago || '';
        this.reajusteForm.cuotasFaltantes = Math.max(0, plazoTotal - nCuota);
      }
    }

    const capital = Number(this.reajusteForm.saldoCapital);
    const n = Number(this.reajusteForm.cuotasFaltantes);

    if (!tasaNueva || tasaNueva <= 0 || !n || n <= 0 || !capital || capital <= 0) {
      this.reajusteForm.tasaMensual = 0;
      this.reajusteForm.cuotaFija = 0;
      return;
    }

    const iAnual = tasaNueva / 100;
    const iMensual = iAnual / 12;

    this.reajusteForm.tasaMensual = +(iMensual * 100).toFixed(4);
    const i = iMensual;
    const cuota = capital * i / (1 - Math.pow(1 + i, -n));
    this.reajusteForm.cuotaFija = +cuota.toFixed(2);
  }

  guardarRefinanciamiento(): void {
    if (!this.amortizacionSeleccionada) {
      Swal.fire("Error", "No hay datos de reajuste para guardar.", "error");
      return;
    }
    if (!this.reajusteForm.cuota || this.reajusteForm.cuota <= 0) {
      Swal.fire("Error", "Debe seleccionar una cuota para el reajuste.", "error");
      return;
    }
    const param = {
      ARRAY_DATOS_REAJUSTE: this.amortizacionSeleccionada,
      ARRAYCUOTASREAJUSTE: [Number(this.reajusteForm.cuota)]
    };

    console.log('param refinanciamiento: ', param);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar cambios"
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.BancoService.GuardarReajuste(param).subscribe({
        next: (res: any) => {
          console.log('GuardarReajuste respuesta: ', res);

          if (!res.success) {
            Swal.fire("Error", res.message || "Ocurrió un error al Guardar.", "error");
            return;
          }
          this.cargarLista();
          Swal.fire("Guardado", res.message || "Refinanciamiento guardado correctamente.", "success");

          this.amortizacionSeleccionada = null;
          this.detalleRecalculo = [];
          this.reajusteForm = {
            cuota: 0,
            saldoCapital: 0,
            tasa: 0,
            fechaPago: '',
            cuotasFaltantes: 0,
            tasaMensual: 0,
            cuotaFija: 0
          };
          this.reajusteTableConfig = {
            ...this.reajusteTableConfig,
            data: []
          };
          this.showModalRecalculo = false;
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire("Error", "Ocurrió un error al Guardar el refinanciamiento.", "error");
        }
      });
    });
  }

}