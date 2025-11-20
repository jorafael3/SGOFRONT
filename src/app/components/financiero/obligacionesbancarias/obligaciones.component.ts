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
  activeTab: 'nueva' | 'lista' = 'nueva';
  modoInteres: 'compuesto' | 'simple' = 'compuesto';
  form = {
    capital: 0,
    tna: 0,
    cuotas: 12,
    fechaInicio: '',
    otros: 0,
    referencia: '',
    tipoAmortizacion: 1,
    tipoObligacion: '',
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
  tablaAmortizacion: any[] = [];

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
      action: 'refresh',
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
        action_to_perform: 'ver',
        icon: 'fa fa-eye',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Ver'
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

    this.form.otros = capital > 0 ? +(capital * 0.005).toFixed(2) : 0;

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
    let param: never[] = []
    this.BancoService.CargarTiposObligaciones(param).subscribe({
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
        // this.tablaAmortizacion = res.data;
        this.amortizacionTableConfig = {
          ...this.amortizacionTableConfig,
          data: res.data
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

  guardarAmortizacion() {
    const params = {
      // nombre: this.result.value,
      capital: this.form.capital,
      tasa: this.form.tna,
      plazo: this.form.cuotas,
      // tipo_pago: 12,
      tipo_amortizacion: this.form.tipoAmortizacion,
      fecha_primer_pago: this.form.fechaInicio,
      tasaMensual: this.form.tasaMensual,
      otros: this.form.otros,
      cuotafija: this.form.cuotaFija,
      referencia: this.form.referencia,
      tipo_obligacion: this.form.tipoObligacion,
      // datos: datosAmortizacion,
      // proveedor: Proveedor_Seleccionado
    };
    this.BancoService.GuardarAmortizacion(params).subscribe({
      next: (res: any) => {
        if (!res.success) {
          Swal.fire('Error', 'Ocurrió un error al Guardar.', 'error');
          return;
        }

      }
    })
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

  guardarReajuste() {
    const payload = {
      capital: this.form.capital,
      tasa: this.form.tna,
      plazo: this.form.cuotas,
      tipo_pago: 12,
      tipo_amortizacion: this.form.tipoAmortizacion,
      fecha_primer_pago: this.form.fechaInicio,
      otros: this.form.otros,
      referencia: this.form.referencia,
    };
    this.BancoService.GuardarReajuste(payload).subscribe({
      next: (res: any) => {
        if (!res.success) {
          Swal.fire('Error', 'Ocurrió un error al Guardar.', 'error');
          return;
        }
      }
    })
  }

  onListaAction(action: TableClickedAction) {
    if (action.action_to_perform === 'ver') {
      Swal.fire('Información', 'Aquí puedes abrir una vista detallada.', 'info');
    }
  }

  onCustomAction(event: { action: string }) {
    if (event.action === 'refresh') {
      this.cargarLista();
    }
  }

  abrirModalProveedor() {
    this.showModalProveedor = true;
  }

  cerrarModalProveedor() {
    this.showModalProveedor = false;
  }

  seleccionarProveedor(prov: any) {
    this.form.proveedor = prov.Nombre;
    this.form.proveedorId = prov.id;
    this.resumen.proveedor = prov.Nombre;
    this.showModalProveedor = false;
  }

  get proveedoresFiltrados() {
    if (!this.filtroProveedor) return this.listProveedores;
    const filtro = this.filtroProveedor.toLowerCase();
    return this.listProveedores.filter((p: any) =>
      (p.nombre || '').toLowerCase().includes(filtro) ||
      (p.identificacion || '').toLowerCase().includes(filtro)
    );
  }



}