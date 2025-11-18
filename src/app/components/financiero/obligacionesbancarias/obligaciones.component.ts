import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
      { title: 'Columna 1', field_value: 'campo_1', sort: true },
      { title: 'Columna 2', field_value: 'campo_2', sort: true },
      { title: 'Columna 3', field_value: 'campo_3', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'editar',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar'
      }
    ],
    data: []
  };

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    // TODO: Inicializar componente
  }

  onTableAction(action: TableClickedAction) {
    // TODO: Manejar acciones de la tabla
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
    // TODO: Recargar datos de la tabla
  }
}
