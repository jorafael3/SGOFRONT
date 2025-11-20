import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, CustomButton } from '../../../shared/interface/common';
import { MenusService } from '../../../services/mantenimiento/menus.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit {
  public menusData: any[] = [];
  public isLoading = false;
  public showCreateModal = false;
  public isEditing = false;

  public selectedEmpresa: string = 'CARTIMEX';
  Buttons_Export = ['excel'];

  public menuTypes = [
    { value: 'main_title', label: 'Menú Principal' },
    { value: 'sub', label: 'Submenú' },
    { value: 'link', label: 'Enlace' }
  ];

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
      action: 'create_menu',
      icon: 'fa fa-plus',
      class: 'btn btn-info',
      tooltip: 'Crear nuevo menú'
    }
  ];

  public tableConfig: TableConfigs = {
    columns: [
      { title: 'ID', field_value: 'MenuId', sort: true },
      { title: 'Título', field_value: 'Titulo', sort: true },
      { title: 'Tipo', field_value: 'Type', sort: true },
      { title: 'Path', field_value: 'Path', sort: true },
      { title: 'Ícono', field_value: 'Icono', sort: false },
      { title: 'Orden', field_value: 'Orden', sort: true },
      { title: 'Padre ID', field_value: 'PadreId', sort: false },
      { title: 'Activo', field_value: 'Activo', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_menu',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar Menú'
      },
      {
        label: '',
        action_to_perform: 'delete_menu',
        icon: 'trash',
        type: 'button',
        class: 'btn btn-danger btn-sm',
        tooltip: 'Eliminar Menú'
      }
    ],
    data: []
  };

  public menuForm: FormGroup;

  constructor(
    private cdr: ChangeDetectorRef,
    private menusService: MenusService,
    public fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      MenuId: [{ value: '', disabled: true }],
      Titulo: ['', Validators.required],
      Type: ['main_title', Validators.required],
      Path: [''],
      Icono: [''],
      Orden: ['', Validators.required],
      PadreId: [''],
      Badge: [0],
      BadgeValue: [''],
      BadgeColor: [''],
      Activo: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.cargarMenus();
  }

  /**
   * Cargar lista de menús
   */
  cargarMenus() {
    this.isLoading = true;
    const param = {
      empresa: this.selectedEmpresa
    };

    this.menusService.getMenuList(param).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        if (response.success) {
          this.menusData = response.data || [];
          this.tableConfig = { ...this.tableConfig, data: this.menusData };
        } else {
          Swal.fire('Error', response.message || 'Error al cargar menús', 'error');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar menús:', error);
        Swal.fire('Error', 'Error al cargar menús', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Cambiar empresa y recargar menús
   */
  onEmpresaChange() {
    this.cargarMenus();
  }

  /**
   * Limpiar menú padre si cambia el tipo
   */
  onTypeChange() {
    const tipoSeleccionado = this.menuForm.get('Type')?.value;

    // Si es menú principal, limpiar PadreId
    if (tipoSeleccionado === 'main_title') {
      this.menuForm.get('PadreId')?.setValue('');
    }
  }

  /**
   * Abrir modal para crear nuevo menú
   */
  abrirCrearMenu() {
    this.isEditing = false;
    this.menuForm.reset({
      MenuId: '',
      Titulo: '',
      Type: 'main_title',
      Path: '',
      Icono: '',
      Orden: 1,
      PadreId: '',
      Badge: 0,
      BadgeValue: '',
      BadgeColor: '',
      Activo: 1
    });
    this.showCreateModal = true;
    this.cdr.detectChanges();
  }

  /**
   * Editar menú existente
   */
  editarMenu(menu: any) {
    console.log('editarMenu llamado con:', menu);
    this.isEditing = true;
    this.menuForm.patchValue({
      MenuId: menu.MenuId,
      Titulo: menu.Titulo,
      Type: menu.Type,
      Path: menu.Path || '',
      Icono: menu.Icono || '',
      Orden: menu.Orden,
      PadreId: menu.PadreId || '',
      Badge: menu.Badge || 0,
      BadgeValue: menu.BadgeValue || '',
      BadgeColor: menu.BadgeColor || '',
      Activo: menu.Activo
    });
    console.log('showCreateModal será:', true);
    this.showCreateModal = true;
    console.log('Despues de asignar showCreateModal:', this.showCreateModal);
    this.cdr.detectChanges();
    console.log('Change detection ejecutado');
  }

  /**
   * Guardar menú (crear o actualizar)
   */
  guardarMenu() {
    if (this.menuForm.invalid) {
      Swal.fire('Validación', 'Por favor completa los campos requeridos', 'warning');
      return;
    }

    const formValue = this.menuForm.getRawValue();
    const menuData = {
      ...formValue,
      Empresa: this.selectedEmpresa,
      PadreId: formValue.PadreId ? parseInt(formValue.PadreId) : null
    };
    console.log('menuData: ', menuData);

    const operacion = this.isEditing ? 'actualizar' : 'crear';
    const metodo = this.isEditing ?
      this.menusService.updateMenu(menuData) :
      this.menusService.createMenu(menuData);

    metodo.subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        if (response.success) {
          Swal.fire('Éxito', `Menú ${operacion}do correctamente`, 'success');
          this.cerrarModal();
          this.cargarMenus();
        } else {
          Swal.fire('Error', response.message || `Error al ${operacion} menú`, 'error');
        }
      },
      error: (error: any) => {
        console.error(`Error al ${operacion} menú:`, error);
        Swal.fire('Error', `Error al ${operacion} menú`, 'error');
      }
    });
  }

  /**
   * Eliminar menú
   */
  eliminarMenu(menu: any) {
    Swal.fire({
      title: '¿Eliminar menú?',
      text: `¿Deseas eliminar el menú "${menu.Titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menusService.deleteMenu(menu.MenuId).subscribe({
          next: (response: any) => {
            if (response.success) {
              Swal.fire('Éxito', 'Menú eliminado correctamente', 'success');
              this.cargarMenus();
            } else {
              Swal.fire('Error', response.message || 'Error al eliminar menú', 'error');
            }
          },
          error: (error: any) => {
            console.error('Error al eliminar menú:', error);
            Swal.fire('Error', 'Error al eliminar menú', 'error');
          }
        });
      }
    });
  }

  /**
   * Cerrar modal
   */
  cerrarModal() {
    this.showCreateModal = false;
    this.menuForm.reset();
    this.cdr.detectChanges();
  }

  /**
   * Manejo de acciones de la tabla
   */
  onTableAction(event: any) {
    console.log('onTableAction evento recibido:', event);
    if (!event) {
      console.log('No hay evento');
      return;
    }

    // El TableComponent emite 'action_to_perform', no 'action'
    const action = event.action_to_perform || event.action;
    const rowData = event.data;

    console.log('Acción:', action, 'Datos:', rowData);

    if (!action) {
      console.log('No hay acción definida');
      return;
    }

    switch (action) {
      case 'edit_menu':
        console.log('Editando menú:', rowData);
        this.editarMenu(rowData);
        break;
      case 'delete_menu':
        console.log('Eliminando menú:', rowData);
        this.eliminarMenu(rowData);
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  }

  /**
   * Manejo de acciones personalizadas
   */
  onCustomAction(event: any) {
    if (!event || !event.action) return;

    const action = event.action;

    switch (action) {
      case 'refresh':
        this.cargarMenus();
        break;
      case 'create_menu':
        this.abrirCrearMenu();
        break;
    }
  }
}
