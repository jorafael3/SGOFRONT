import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { UsuariosService } from '../../../services/empresas/empresas.service ';
import Swal from 'sweetalert2';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-panel-empresa',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent, NgbNavModule],
  templateUrl: './PanelEmpresa.component.html',
  styleUrl: './PanelEmpresa.component.scss'
})
export class PanelEmpresaComponent {

  periodosDisponibles: any[] = []
  periodoSeleccionado: string = '';
  planesDisponibles: any[] = [];
  planSeleccionado: any = null;
  preciosDisponibles: any[] = [];
  precioSeleccionado: number | null = null;
  nombrePeriodoSeleccionado: string = '';

  showCreateModal: boolean = false;
  showAddContactModal: boolean = false;
  showAddPlanModal: boolean = false;
  empresaNuevo: any = {};
  datosEmpresa: any = {};
  contactos: any[] = [];
  historialPagos: any[] = [];
  activeTab = 'home';

  contactoNuevo: any = {
    nombre: '',
    email: '',
    telefono: '',
    rol_contacto: '',
    estado: 'A'
  };
  public isLoading = false;
  public empresaId: string | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Simulación de carga de planes disponibles
    this.planesDisponibles = [];
    this.empresaId = this.route.snapshot.paramMap.get('uid');
    console.log('ID de empresa recibido:', this.empresaId);
    this.Cargar_Datos_Empresa({ id: this.empresaId });
    this.Cargar_Contactos_Empresa({ id: this.empresaId });
    this.Cargar_Historial_Pagos({ id: this.empresaId });
  }


  Cargar_Historial_Pagos(params: { id: string | null }): void {
    if (!params.id) return;
    const param = { id_empresa: params.id };
    this.usuariosService.getHistorialPagosEmpresa(param).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.historialPagos = response.data;
        } else {
          this.historialPagos = [];
        }
      },
      error: (error: any) => {
        this.historialPagos = [];
      }
    });
  }

  Cargar_Datos_Empresa(params: { id: string | null }): void {
    if (!params.id) {
      console.error('ID de empresa no proporcionado');
      return;
    }
    const param = { uid: params.id };
    this.usuariosService.getEmpresaDataByUid(param).subscribe({
      next: (response: any) => {
        console.log("🚀 ~ PanelEmpresaComponent ~ Cargar_Datos_Empresa ~ response:", response);
        if (response.success && response.data) {
          this.empresaNuevo = response.data[0];
          this.datosEmpresa = response.data[0];
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      },
      error: (error: any) => {
        console.error('Error al cargar datos de la empresa:', error);
      }
    });
  }

  Cargar_Contactos_Empresa(params: { id: string | null }): void {
    if (!params.id) return;
    const param = { uid: params.id };
    this.usuariosService.getContactosEmpresa(param).subscribe({
      next: (response: any) => {
        console.log("🚀 ~ PanelEmpresaComponent ~ Cargar_Contactos_Empresa ~ response:", response)
        if (response.success && response.data) {
          this.contactos = response.data;
        } else {
          this.contactos = [];
        }
      },
      error: (error: any) => {
        this.contactos = [];
      }
    });
  }

  Cargar_Planes_Empresa(): void {

    this.usuariosService.getPlanesEmpresa({}).subscribe({
      next: (response: any) => {
        console.log("🚀 ~ PanelEmpresaComponent ~ Cargar_Planes_Empresa ~ response:", response)
        if (response) {
          this.planesDisponibles = response.planes.data;
          this.periodosDisponibles = response.periodos.data;
          this.preciosDisponibles = response.precios.data;
          this.showAddPlanModal = true;
          this.planSeleccionado = null;
        } else {
          this.planesDisponibles = [];
          this.periodosDisponibles = [];
        }
      },
      error: (error: any) => {
        this.planesDisponibles = [];
        this.periodosDisponibles = [];
      }
    });
  }

  public onPlanSelect(planId: string): void {
    this.periodoSeleccionado = '';
    this.planSeleccionado = this.planesDisponibles.find(p => p.plan_id == planId) || null;
    this.precioSeleccionado = null;
    this.nombrePeriodoSeleccionado = '';
  }

  public onPeriodoSelect(periodoId: string): void {
    this.periodoSeleccionado = periodoId;
    console.log("🚀 ~ PanelEmpresaComponent ~ onPeriodoSelect ~ this.periodoSeleccionado:", this.periodoSeleccionado)
    console.log("🚀 ~ PanelEmpresaComponent ~ onPeriodoSelect ~ this.planSeleccionado:", this.planSeleccionado.plan_id)
    console.log("🚀 ~ PanelEmpresaComponent ~ onPeriodoSelect ~ this.preciosDisponibles:", this.preciosDisponibles)
    let precio = this.preciosDisponibles.filter(p => p.id_plan == this.planSeleccionado.plan_id && p.id_periodo == this.periodoSeleccionado);
    console.log("🚀 ~ PanelEmpresaComponent ~ onPeriodoSelect ~ precio:", precio)
    this.precioSeleccionado = precio.length > 0 ? precio[0].precio : null;
  }

  abrirModalAgregarContacto() {
    this.contactoNuevo = {
      nombre: '',
      email: '',
      telefono: '',
      rol_contacto: '',
      estado: 'A'
    };
    this.showAddContactModal = true;
  }

  guardarNuevoContacto() {
    if (!this.empresaId) return;
    let param = {
      id_empresa: this.datosEmpresa.id_empresa,
      ...this.contactoNuevo
    };
    console.log("🚀 ~ PanelEmpresaComponent ~ guardarNuevoContacto ~ param:", param)
    this.usuariosService.createContactoEmpresa(param).subscribe({
      next: (response) => {
        console.log("🚀 ~ PanelEmpresaComponent ~ guardarNuevoContacto ~ response:", response)
        if (response.success) {
          Swal.fire("Éxito!", response.message, "success");
          this.showAddContactModal = false;
          this.Cargar_Contactos_Empresa({ id: this.empresaId });
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      },
      error: (error) => {
        Swal.fire("Error!", "No se pudo crear el contacto", "error");
      }
    });
  }

  abrirModalAgregarPlan() {
    this.periodoSeleccionado = '';
    this.precioSeleccionado = null;
    this.nombrePeriodoSeleccionado = '';
    this.Cargar_Planes_Empresa();
  }

  guardarNuevoPlan(planId: number, periodoSeleccionado: string) {
    if (!this.empresaId) return;
    let param = {
      uid: this.empresaId,
      plan_id: planId,
      periodo: periodoSeleccionado
    };
    console.log("🚀 ~ PanelEmpresaComponent ~ guardarNuevoPlan ~ param:", param)
    // this.usuariosService.agregarPlanEmpresa(param).subscribe({
    //   next: (response) => {
    //     if (response.success) {
    //       Swal.fire("Éxito!", response.message, "success");
    //       this.showAddPlanModal = false;
    //       this.Cargar_Datos_Empresa({ id: this.empresaId });
    //     } else {
    //       Swal.fire("Error!", response.message, "error");
    //     }
    //   },
    //   error: (error) => {
    //     Swal.fire("Error!", "No se pudo agregar el plan", "error");
    //   }
    // });
  }

}


