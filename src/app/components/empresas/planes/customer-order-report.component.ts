import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { UsuariosService } from '../../../services/empresas/planes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-order-report',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './customer-order-report.component.html',
  styleUrl: './customer-order-report.component.scss'
})
export class PlanesComponent {
  showCreatePlanModal: boolean = false;
  planNuevo: any = {
    nombre: '',
    descripcion: '',
    max_documentos: 0
  };


  showCreateModal: boolean = false;
  usuarioNuevo: any = {};

  showEditModal: boolean = false;
  usuarioEditando: any = null;
  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel', 'pdf'];

  datos_planes: any[] = [];

  public tablePlanesConfig: TableConfigs = {
    columns: [
      { title: 'Periodo', field_value: 'periodo_nombre', sort: true, type: "select", options:[] },  { title: 'Periodo', field_value: 'periodo_nombre', sort: true },
      { title: 'Precio', field_value: 'precio', sort: true },
      { title: 'Usuarios', field_value: 'max_usuarios', sort: true },
      { title: 'Documentos', field_value: 'max_documentos', sort: true },
      { title: 'Almacenamiento (GB)', field_value: 'max_almacenamiento', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_user',
        icon: 'edit',
        class: 'btn btn-sm',
        tooltip: 'Editar usuario'
      },
    ],
    data: []
  };

  public customButtons: CustomButton[] = [
    {
      label: '',
      action: 'refresh',
      icon: 'fa fa-refresh',
      class: 'btn btn-success',
      tooltip: 'Actualizar datos de la tabla'
    },
    {
      label: '',
      action: 'create_plan',
      icon: 'fa fa-plus',
      class: 'btn btn-info',
      tooltip: 'Crear nuevo usuario'
    },

  ];


  constructor(private usuariosService: UsuariosService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Inicializar fechas personalizada con el inicio de mes y la fecha actual
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaPersonalizadaInicio = inicioMes.toISOString().slice(0, 10);
    this.fechaPersonalizadaFin = hoy.toISOString().slice(0, 10);
    this.loadTableData();
  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin
    };
    console.log('param: ', param);

    this.usuariosService.getPlanes(param).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success && response.data) {
          this.datos_planes = response.data;
          this.OnFillTableAction();
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  OnFillTableAction() {

    // this.Usuarios_Datos.map(function (usuario) {
    // usuario.estado = `<span class="badge badge-light-${usuario.estado == 'I' ? 'danger' : 'success'}">${(usuario.estado == 'I' ? 'Inactivo' : 'Activo')}</span>`;
    // });

    this.tablePlanesConfig = { ...this.tablePlanesConfig, data: this.datos_planes };

  }

  onTableAction(action: TableClickedAction) {
    //   switch (action.action_to_perform) {
    //     case 'edit_user':
    //       this.editUser(action.data);
    //       break;
    //     case 'contact_customer':
    //       this.contactCustomer(action.data);
    //       break;
    //     case 'delete_user':
    //       this.deleteUser(action.data);
    //       break;
    //     default:
    //   }
  }

  onCreatePlan() {
    this.planNuevo = {
      nombre: '',
      descripcion: '',
      max_documentos: 0
    };
    this.showCreatePlanModal = true;
  }

  guardarNuevoPlan() {
    this.isLoading = true;
    const datosPlan = {
      nombre: this.planNuevo.nombre,
      descripcion: this.planNuevo.descripcion,
      max_documentos: this.planNuevo.max_documentos
    };
    if (!datosPlan.nombre.trim()) {
      Swal.fire("Error!", "El nombre es obligatorio", "error");
      this.isLoading = false;
      return;
    }
    if (!datosPlan.descripcion.trim()) {
      Swal.fire("Error!", "La descripción es obligatoria", "error");
      this.isLoading = false;
      return;
    }
    if (datosPlan.max_documentos < 0) {
      Swal.fire("Error!", "El máximo de documentos debe ser mayor o igual a 0", "error");
      this.isLoading = false;
      return;
    }
    this.usuariosService.createPlan(datosPlan).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire("Éxito!", response.message, "success");
          this.showCreatePlanModal = false;
          this.loadTableData();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        Swal.fire("Error!", "No se pudo crear el plan", "error");
        this.isLoading = false;
      }
    });
  }



  onCustomAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'refresh':
        this.onRefreshTableData();
        break;
      case 'create_plan':
        this.onCreatePlan();
        break;
      default:
    }
  }

  onRefreshTableData() {
    console.log('Refrescando datos de la tabla...');
    this.loadTableData();
  }


}
