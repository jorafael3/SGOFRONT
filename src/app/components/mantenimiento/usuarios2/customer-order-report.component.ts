import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { UsuariosService } from '../../../services/mantenimiento/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-order-report',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './customer-order-report.component.html',
  styleUrl: './customer-order-report.component.scss'
})
export class CustomerOrderReportComponent {
  showCreateModal: boolean = false;
  usuarioNuevo: any = {};

  showEditModal: boolean = false;
  usuarioEditando: any = null;
  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel', 'pdf'];

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
      { title: 'Usuario', field_value: 'usuario', sort: true },
      { title: 'Nombre', field_value: 'nombre', sort: true },
      { title: 'Apellido', field_value: 'apellido', sort: true },
      { title: 'Email', field_value: 'email', sort: true },
      // { title: 'Empresa', field_value: 'empresa', sort: true },
      { title: 'Estado', field_value: 'estado', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_user',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar usuario'
      },
      {
        label: '',
        action_to_perform: 'delete_user',
        icon: 'trash',
        type: 'button',
        class: 'btn btn-danger btn-sm ms-1',
        tooltip: 'Eliminar usuario'
      }
    ],
    data: []
  };

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

    this.usuariosService.getUserList(param).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success && response.data) {
          // Forzar cambio de referencia para disparar ngOnChanges en TableComponent
          this.Usuarios_Datos = response.data;
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

    this.Usuarios_Datos.map(function (usuario) {
      usuario.estado = `<span class="badge badge-light-${usuario.estado == 'I' ? 'danger' : 'success'}">${(usuario.estado == 'I' ? 'Inactivo' : 'Activo')}</span>`;
    });

    this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };

  }

  onTableAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'edit_user':
        this.editUser(action.data);
        break;
      case 'contact_customer':
        this.contactCustomer(action.data);
        break;
      case 'delete_user':
        this.deleteUser(action.data);
        break;
      default:
    }
  }

  onCreateUser() {

    this.usuarioNuevo = {
      usuario: '',
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      estado: 'A',
      empresa: '',
      password: '',
      password_confirmation: ''
    };
    this.showCreateModal = true;
  }

  guardarNuevoUsuario() {
    this.isLoading = true;
    const datosNuevo = {
      usuario: this.usuarioNuevo.usuario,
      nombre: this.usuarioNuevo.nombre,
      apellido: this.usuarioNuevo.apellido,
      telefono: this.usuarioNuevo.telefono,
      email: this.usuarioNuevo.email,
      estado: this.usuarioNuevo.estado,
      empresa: this.usuarioNuevo.empresa,
      password: this.usuarioNuevo.password,
      password_confirmation: this.usuarioNuevo.password_confirmation
    };

    if (datosNuevo.usuario.trim() == "") {
      Swal.fire("Error!", "El campo usuario es obligatorio", "error");
      this.isLoading = false;
      return;
    }

    if (datosNuevo.email.trim() == "") {
      Swal.fire("Error!", "El campo email es obligatorio", "error");
      this.isLoading = false;
      return;
    }
    this.usuariosService.createUser(datosNuevo).subscribe({
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

  private contactCustomer(user: any) {
    console.log("🚀 ~ CustomerOrderReportComponent ~ contactCustomer ~ user:", user);
    // Aquí puedes abrir un modal de composición de email o usar mailto:
    if (user.email) {
      window.open(`mailto:${user.email}?subject=Contacto desde CRM&body=Hola ${user.usuario},`);
    } else {
      alert(`No hay email disponible para ${user.usuario}`);
    }
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
