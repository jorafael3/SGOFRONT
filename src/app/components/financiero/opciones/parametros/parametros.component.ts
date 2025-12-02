import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OpParametrosService } from '../../../../services/financiero/opParametros.service';

@Component({
  selector: 'app-parametros',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent {
  public optParam: any = {};

  constructor(private service: OpParametrosService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.cargarParam();
  }

  cargarParam() {
    this.service.Cargar_OPT_Param().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.optParam = res.data[0] || {};
      }
    })
  }

  guardarParametros() {
    this.service.Guardar_OPT_Param(this.optParam).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire("Guardado", "Los parámetros fueron actualizados", "success");
        }
      }
    });
  }

}