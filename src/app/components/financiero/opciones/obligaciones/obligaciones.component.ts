import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OpObligacionesService } from '../../../../services/financiero/opObligaciones.service';

@Component({
  selector: 'app-obligaciones',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './obligaciones.component.html',
  styleUrl: './obligaciones.component.scss'
})
export class ObligacionesComponent {
  public tiposObligaciones: any[] = [];
  public cuentasACPP: any[] = [];
  public cuentasACGastos: any[] = [];
  // cuenta Pasivo, cuentaGasto, cuentaProvision
  public cuentaGasto = '';
  public cuentaPasivo = '';
  public cuentaProvision = '';


  constructor(private service: OpObligacionesService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.cargarTiposObligaciones();
    this.cargarACCuentasPP();
    this.cargarACCuentasGastos();
  }

  cargarTiposObligaciones() {
    let param: never[] = []
    this.service.CargarTiposObligaciones(param).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.tiposObligaciones = res.data.map((item: any) => ({
          ...item,
          cuentaGasto: item.cuentaGasto || '',
          cuentaPasivo: item.cuentaPasivo || '',
          cuentaProvision: item.cuentaProvision || '',
        }));
        // this.tiposObligaciones = res.data;
        console.log("Cargar Tipos Obligaciones ", this.tiposObligaciones)
      }
    })
  }
  
  cargarACCuentasPP() {
    let param: never[] = []
    this.service.Cargar_ACC_CuentasPasivos_Provision(param).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.cuentasACPP = res.data;
        console.log("Cargar ACCuentas Pasivos y Provisión", this.cuentasACPP)
      }
    })
  }
  cargarACCuentasGastos() {
    let param: never[] = []
    this.service.CargarACCuentasGastos(param).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.cuentasACGastos = res.data;
        console.log("Cargar ACCuentas Gastos", this.cuentasACGastos)
      }
    })
  }

  guardarCuentasObligaciones() {
    const payload = this.tiposObligaciones.map(item => ({
      id: item.id,
      nombre: item.nombre,
      cuenta: item.cuenta,
      estado: item.estado,
      cuentaGasto: item.cuentaGasto,
      cuentaPasivo: item.cuentaPasivo,
      cuentaProvision: item.cuentaProvision,
    }));
    console.log('Payload a guardar:', payload);
    this.service.ActualizarCuentasObligaciones(payload).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        if (!res.success) {
          Swal.fire('Error', 'No se pudieron guardar las cuentas', 'error');
          return;
        }
        Swal.fire('Guardado', 'Cuentas actualizadas correctamente', 'success');
        this.cargarTiposObligaciones();
      }
    });
  }

  agregarTipoObligacion() {
    this.tiposObligaciones.push({
      id: 0,
      nombre: '',
      cuenta: '',
      estado: 1,
      cuentaGasto: '',
      cuentaPasivo: '',
      cuentaProvision: '',
    });
  }

  borrarTipoObligacion(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
    }).then((result) => {
      this.service.BorrarTipoObligacion({ id: item.id }).subscribe({
        next: (res: any) => {
          console.log('Respuesta del servidor:', res);
          if (!res.success) {
            Swal.fire('Error', 'No se pudieron guardar las cuentas', 'error');
            return;
          }
          Swal.fire('Eliminado', 'Cuentas desactivada correctamente', 'success');
          this.cargarTiposObligaciones();
        }
      });
    });
  }

}