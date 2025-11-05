import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { UsuariosService } from '../../../services/empresas/empresas.service ';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

import { navigation } from '../../../shared/data/faq';

@Component({
  selector: 'app-customer-order-report',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './customer-order-report.component.html',
  styleUrl: './customer-order-report.component.scss'
})
export class CustomerOrderReportComponent {
  showCreateModal: boolean = false;
  empresaNuevo: any = {};

  showEditModal: boolean = false;
  usuarioEditando: any = null;
  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel', 'pdf', "copy"];

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
      action: 'create_user',
      icon: 'fa fa-plus',
      class: 'btn btn-info',
      tooltip: 'Crear nuevo usuario'
    },

  ];

  public tableConfig: TableConfigs = {
    columns: [
      { title: 'Nombre Empresa', field_value: 'nombre_comercial', sort: true },
      { title: 'Fecha Inscripcion', field_value: 'fecha_creacion', sort: true },
      { title: 'Pais', field_value: 'pais', sort: true },
      { title: 'Plan', field_value: 'plan_nombre', sort: true },
      { title: 'Plan Expiracion', field_value: 'fecha_expira', sort: true },
      { title: 'Días Restantes', field_value: 'dias_restantes', sort: true, },
      // { title: 'Empresa', field_value: 'empresa', sort: true },
      { title: 'Estado', field_value: 'estado', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_empresa',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar empresa'
      },
      {
        label: '',
        action_to_perform: 'manage_empresa',
        icon: 'building',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Administrar Empresa'
      },
      {
        label: '',
        action_to_perform: 'delete_empresa',
        icon: 'trash',
        type: 'button',
        class: 'btn btn-danger btn-sm',
        tooltip: 'Eliminar Empresa'
      }
    ],
    data: []
  };

  constructor(private usuariosService: UsuariosService, private cdr: ChangeDetectorRef, private router: Router) { }

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

    this.usuariosService.getEmpresaList(param).subscribe({
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
  }

  OnFillTableAction() {

    this.Usuarios_Datos.map(function (usuario) {
      usuario.estado = `<span class="badge badge-light-${usuario.estado == 'I' ? 'danger' : 'success'}">${(usuario.estado == 'I' ? 'Inactivo' : 'Activo')}</span>`;
      usuario.fecha_creacion = new Date(usuario.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      usuario.fecha_expira = new Date(usuario.fecha_expira).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      usuario.dias_restantes = 1;
      const hoy = new Date();
      const fechaExpira = new Date(usuario.fecha_expira.split('/').reverse().join('-'));
      const diffTime = fechaExpira.getTime() - hoy.getTime();
      const dias_r = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      usuario.dias_restantes = `<span class="badge badge-light-${dias_r <= 5 ? 'danger' : dias_r <= 15 ? 'warning' : 'primary'}">${dias_r} días</span>`;
    });

    this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };

  }

  onTableAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'edit_user':
        this.editUser(action.data);
        break;
      case 'manage_empresa':
        if (action.data && action.data.id_empresa) {
          this.ManageEmpresa(action.data);
        }
        break;
      case 'delete_user':
        this.deleteUser(action.data);
        break;
      default:
    }
  }

  onCreateUser() {

    this.empresaNuevo = {
      razon_social: '',
      nombre_comercial: '',
      pais: '',
      ruc: '',
      direccion: ''
    };
    this.showCreateModal = true;
  }

  guardarNuevo() {
    this.isLoading = true;
    const datosNuevo = {
      razon_social: this.empresaNuevo.razon_social,
      nombre_comercial: this.empresaNuevo.nombre_comercial,
      pais: this.empresaNuevo.pais,
      ruc: this.empresaNuevo.ruc,
      direccion: this.empresaNuevo.direccion
    };
    if (datosNuevo.razon_social.trim() == "") {
      Swal.fire("Error!", "El campo razón social es obligatorio", "error");
      this.isLoading = false;
      return;
    }

    if (datosNuevo.nombre_comercial.trim() == "") {
      Swal.fire("Error!", "El campo nombre comercial es obligatorio", "error");
      this.isLoading = false;
      return;
    }

    if (datosNuevo.pais.trim() == "") {
      Swal.fire("Error!", "El campo país es obligatorio", "error");
      this.isLoading = false;
      return;
    }
    this.usuariosService.createEmpresa(datosNuevo).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success) {
          Swal.fire("Éxito!", response.message, "success");
          this.showCreateModal = false;
          this.loadTableData();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.log("🚀 ~ CustomerOrderReportComponent ~ guardarNuevo ~ error:", error)
        Swal.fire("Error!", "No se pudo crear el usuario", "error");
        this.isLoading = false;
      }
    });
  }

  private editUser(user: any) {
    let param = {
      id_usuario: user.id_usuario
    };
    this.isLoading = true;
    this.usuariosService.getUserDetails(param).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success && response.data) {
          this.usuarioEditando = response.data[0];
          this.showEditModal = true;
          this.isLoading = false;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  guardarEdicionUsuario() {
    if (!this.usuarioEditando) return;
    this.isLoading = true;
    const datosEditados = {
      id_usuario: this.usuarioEditando.id_usuario,
      usuario: this.usuarioEditando.usuario,
      nombre: this.usuarioEditando.nombre,
      apellido: this.usuarioEditando.apellido,
      email: this.usuarioEditando.email,
      estado: this.usuarioEditando.estado,
      empresa: this.usuarioEditando.empresa,
      rol: this.usuarioEditando.rol
    };
    this.usuariosService.updateUserData(datosEditados).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success) {
          Swal.fire("Éxito!", response.message, "success");
          this.showEditModal = false;
          this.loadTableData();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        Swal.fire("Error!", "No se pudo editar el usuario", "error");
        this.isLoading = false;
      }
    });
  }

  private ManageEmpresa(user: any) {
    console.log("🚀 ~ CustomerOrderReportComponent ~ ManageEmpresa ~ user:", user);
    this.router.navigate(['/empresas/panel_empresa', user.tenant_uid]);
  }

  private deleteUser(user: any) {
    // Confirmación antes de eliminar
    Swal.fire({
      title: "Estas seguro que quieres eliminar este usuario?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const param = { id_usuario: user.id_usuario };
        this.usuariosService.deleteUser({ ...param, estado: 'I' }).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire("Éxito!", "Usuario eliminado correctamente", "success");
              this.loadTableData();
            } else {
              Swal.fire("Error!", response.message, "error");
            }
            this.isLoading = false;
          },
          error: (error) => {
            Swal.fire("Error!", "No se pudo eliminar el usuario", "error");
            this.isLoading = false;
          }
        });
      }
    });
  }

  onCustomAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'refresh':
        this.onRefreshTableData();
        break;
      case 'create_user':
        this.onCreateUser();
        break;
      default:
    }
  }

  onRefreshTableData() {
    console.log('Refrescando datos de la tabla...');
    this.loadTableData();
  }


}
