import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { FacturacionService } from '../../../services/logistica/facturacion.service';
import { UsuariosService } from '../../../services/mantenimiento/usuarios.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  showPrepararModal: boolean = false;
  public sessionData: any = null; // Datos de sesión del usuario actual

  public Usuarios_Datos: any[] = [];
  public isLoading = false;

  fechaPersonalizadaInicio: string = '';
  fechaPersonalizadaFin: string = '';
  Buttons_Export = ['excel'];

  ShowCreateModal: boolean = false;
  ListaDepartamentosLogistica: any[] = [];
  selectedEmpresa: string = 'Cartimex';
  isEditing: boolean = false;

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
      { title: 'Usuario', field_value: 'usuario_texto', sort: true },
      { title: 'Nombre', field_value: 'nombre', sort: true },
      { title: 'Departamento', field_value: 'Departamento_texto', sort: true },
      { title: 'Ubicacion Logistica', field_value: 'departamento_log', sort: true },
      { title: 'Email', field_value: 'email', sort: true },
      { title: 'Gerencia', field_value: 'IS_GERENCIA_TEXTO', sort: true },
      { title: 'Admin', field_value: 'IS_ADMIN_TEXTO', sort: true },
      { title: 'Estado', field_value: 'ESTADO_TEXTO', sort: true },
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_user',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar Usuario'
      },
      // {
      //   label: '',
      //   action_to_perform: 'manage_empresa',
      //   icon: 'building',
      //   type: 'button',
      //   class: 'btn btn-light btn-sm',
      //   tooltip: 'Administrar Empresa'
      // },
      // {
      //   label: '',
      //   action_to_perform: 'delete_empresa',
      //   icon: 'trash',
      //   type: 'button',
      //   class: 'btn btn-danger btn-sm',
      //   tooltip: 'Eliminar Empresa'
      // }
    ],
    data: []
  };
  public userForm: FormGroup;

  constructor(private FacturacionService: FacturacionService,
    private cdr: ChangeDetectorRef, private router: Router,
    private UsuariosService: UsuariosService, public fb: FormBuilder) {
    this.userForm = this.fb.group({
      usrid: [''],
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      Departamento: ['', Validators.required],
      EmpleadoID: [''],
      email: ['', [Validators.required, Validators.email]],
      departamento_log: [''],
      departamento_id: [''],
      isgerencia: [false],
      is_admin: [false],
      estado: ['0', Validators.required] // '0' para Activo, '1' para Inactivo
    });
  }

  ngOnInit() {
    // Inicializar fechas personalizada con el inicio de mes y la fecha actual
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaPersonalizadaInicio = inicioMes.toISOString().slice(0, 10);
    this.fechaPersonalizadaFin = hoy.toISOString().slice(0, 10);
    this.loadSessionData();
    this.loadTableData();

  }

  loadSessionData(): void {
    this.sessionData = this.FacturacionService.getUserSessionData();
    console.log('this.sessionData: ', this.sessionData);

  }

  private loadTableData() {
    this.isLoading = true;
    let param = {
      fecha_inicial: this.fechaPersonalizadaInicio,
      fecha_final: this.fechaPersonalizadaFin,
      usrid: this.sessionData ? this.sessionData.usrid : null,
      empresa: this.selectedEmpresa
    };

    console.log('param: ', param);

    this.UsuariosService.getUserList(param).subscribe({
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
        console.log('error: ', error);
        this.isLoading = false;
      }
    });
    this.UsuariosService.getDepartamentosLogistica({ empresa: this.selectedEmpresa }).subscribe({
      next: (response) => {
        console.log('response: ', response);
        if (response.success && response.data) {
          this.ListaDepartamentosLogistica = response.data;
        } else {
          Swal.fire("Error!", response.message, "error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.log('error: ', error);
        this.isLoading = false;
      }
    });

  }

  OnFillTableAction() {

    this.Usuarios_Datos.map(function (x) {
      x.usuario_texto = `<span class="fs-6 fw-bold badge bg-secondary">${x.usuario}</span>`;
      x.Departamento_texto = `<span class="fw-bold">${x.Departamento}</span>`;
      x.IS_GERENCIA_TEXTO = `<span class="fs-6 fw-bold badge bg-${x.IS_GERENCIA === '1' ? 'primary' : 'secondary'}">${x.IS_GERENCIA === '1' ? 'SI' : 'NO'}</span>`;
      x.IS_ADMIN_TEXTO = `<span class="fs-6 fw-bold badge bg-${x.IS_ADMIN === '1' ? 'primary' : 'secondary'}">${x.IS_ADMIN === '1' ? 'SI' : 'NO'}</span>`;
      x.ESTADO_TEXTO = `<span class="fs-6 fw-bold badge badge-light-${x.anulado === '1' ? 'danger' : 'success'}">${x.anulado === '1' ? 'Inactivo' : 'Activo'}</span>`;
      // x.FACTURA_SUCURSAL = `<span class="fw-bold badge badge-secondary fs-6">${x.FACTURA_SUCURSAL}</span>`;
      // x.MULTIBODEGA = `<span class="fs-6 badge bg-${x.MULTIBODEGA === 'SI' ? 'primary' : 'secondary'} fw-bold">${x.MULTIBODEGA}</span>`;
      // x.FACTURA_SECUENCIA_TEXTO = `<span class="badge bg-dark fs-6 fw-bold">${x.FACTURA_SECUENCIA}</span>`;
      // x.CODIGOS_BODEGA_TEXTO = `<span class="fw-bold">${x.CODIGOS_BODEGA}</span>`;
      // x.CLIENTE_NOMBRE_TEXTO = `<span class="fw-bold">${x.CLIENTE_NOMBRE}</span>`;
      // x.FACTURA_FECHA = `<span class="fw-bold">${x.FACTURA_FECHA}</span>`;
      // x.ORDEN_TIPO_PEDIDO = `<span class="badge badge-info fs-6 fw-bold">${x.ORDEN_TIPO_PEDIDO}</span>`;
    });

    this.tableConfig = { ...this.tableConfig, data: this.Usuarios_Datos };

  }


  //** ACCIONES DE LOS BOTONES DE LA TABLA */
  onTableAction(action: TableClickedAction) {
    switch (action.action_to_perform) {
      case 'edit_user':
        this.editUser(action.data);
        break;
      case 'manage_empresa':
        // if (action.data && action.data.id_empresa) {
        //   this.ManageEmpresa(action.data);
        // }
        break;
      case 'delete_user':
        // this.deleteUser(action.data);
        break;
      default:
    }
  }

  onPrepararFactura(data: any) {

    let param = {
      secuencia: data.FACTURA_SECUENCIA,
      bodega: data.ID_BODEGA,
      usrid: this.sessionData ? this.sessionData.usrid : null
    };
    console.log('param: ', param);

  }

  // Método para cerrar el modal
  cerrarModal() {
    this.isEditing = false;
    this.userForm.reset();
    this.ShowCreateModal = false;
  }

  // Método para guardar la preparación


  private ManageEmpresa(user: any) {
    this.router.navigate(['/empresas/panel_empresa', user.tenant_uid]);
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
    this.loadTableData();
  }

  onEmpresaChange() {
    this.loadTableData();
  }

  onCreateUser() {
    this.isEditing = false;
    this.userForm.reset();
    this.ShowCreateModal = true;
  }

  editUser(user: any) {
    this.isEditing = true;
    this.userForm.patchValue(user);
    this.ShowCreateModal = true;
  }

  GuardarUsuario() {
    console.log('this.userForm.valid: ', this.userForm.valid);
    console.log('Errores del formulario:', this.userForm.errors);

    for (let controlName in this.userForm.controls) {
      const control = this.userForm.controls[controlName];
      if (control.errors) {
        console.log(`Errores en ${controlName}:`, control.errors);
      }
    }

    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('Datos del usuario a guardar:', userData);

      if (this.isEditing) {
        this.UsuariosService.updateUser(userData).subscribe({
          next: (response) => {
            console.log('Respuesta de actualización de usuario:', response);
            if (response.success) {
              Swal.fire("Éxito!", "Usuario actualizado correctamente", "success");
              this.cerrarModal();
              this.loadTableData();
            } else {
              Swal.fire("Error!", response.message || "No se pudo actualizar el usuario", "error");
            }
          },
          error: (error) => {
            console.log('Error al actualizar usuario:', error);
            Swal.fire("Error!", "Ocurrió un error al actualizar el usuario", "error");
          }
        });
      } else {
        this.UsuariosService.createUser(userData).subscribe({
          next: (response) => {
            console.log('Respuesta de creación de usuario:', response);
            if (response.success) {
              Swal.fire("Éxito!", "Usuario creado correctamente", "success");
              this.cerrarModal();
              this.loadTableData();
            } else {
              Swal.fire("Error!", response.message || "No se pudo crear el usuario", "error");
            }
          },
          error: (error) => {
            console.log('Error al crear usuario:', error);
            Swal.fire("Error!", "Ocurrió un error al crear el usuario", "error");
          }
        });
      }
    } else {
      let invalidFields = [];
      const fieldNames: { [key: string]: string } = {
        usuario: 'Usuario',
        nombre: 'Nombre',
        clave: 'Contraseña',
        Departamento: 'Departamento',
        email: 'Email',
        estado: 'Estado'
      };

      for (let controlName in this.userForm.controls) {
        const control = this.userForm.controls[controlName];
        if (control.invalid) {
          let errorMsg = fieldNames[controlName] || controlName;
          if (control.errors?.['required']) {
            errorMsg += ' es requerido';
          } else if (control.errors?.['email']) {
            errorMsg += ' debe tener un formato de email válido (ej. usuario@dominio.com)';
          } else {
            errorMsg += ' es inválido';
          }
          invalidFields.push(errorMsg);
        }
      }

      const message = invalidFields.length > 0 ? `Errores encontrados: ${invalidFields.join(', ')}` : "Por favor, complete todos los campos requeridos";
      Swal.fire("Error!", message, "warning");
    }
  }


}
