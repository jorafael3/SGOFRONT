import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OpcionesService } from '../../../../services/financiero/opciones.service';

@Component({
  selector: 'app-obligaciones',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './obligaciones.component.html',
  styleUrl: './obligaciones.component.scss'
})
export class ObligacionesComponent {
  public tiposObligaciones: any[] = [];

  constructor(private OpcionesService: OpcionesService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.cargarTiposObligaciones();
  }

  cargarTiposObligaciones() {
    let param: never[] = []
    this.OpcionesService.CargarTiposObligaciones(param).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.tiposObligaciones = res.data.map((item: any) => ({
          ...item,
          cuentaDebe: item.cuentaDebe || '',
          cuentaHaber: item.cuentaHaber || '',
          cuentaGasto: item.cuentaGasto || ''
        }));
        // this.tiposObligaciones = res.data;
        console.log("Cargar Tipos Obligaciones ", this.tiposObligaciones)
      }
    })
  }

  guardarCuentasObligaciones() {
    const payload = this.tiposObligaciones.map(item => ({
      id: item.id,
      nombre: item.nombre,
      cuenta: item.cuenta,
      estado: item.estado,
      cuentaDebe: item.cuentaDebe,
      cuentaHaber: item.cuentaHaber,
      cuentaGasto: item.cuentaGasto,
    }));
    console.log('Payload a guardar:', payload);
    this.OpcionesService.ActualizarCuentasObligaciones(payload).subscribe({
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
      cuentaDebe: '',
      cuentaHaber: '',
      cuentaGasto: ''
    });
  }

  borrarTipoObligacion(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
    }).then((result) => {
      this.OpcionesService.BorrarTipoObligacion({ id: item.id }).subscribe({
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