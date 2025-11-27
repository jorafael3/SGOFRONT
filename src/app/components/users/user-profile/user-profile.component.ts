import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { userDetailsTab, users } from '../../../shared/data/user';
import { UserActivityComponent } from "../widgets/user-activity/user-activity.component";
import { UserPersonalDetailsComponent } from "../widgets/user-personal-details/user-personal-details.component";
import { UserTaskComponent } from "../widgets/user-task/user-task.component";
import { UserNotificationComponent } from "../widgets/user-notification/user-notification.component";
import { UserSettingComponent } from "../widgets/user-setting/user-setting.component";
import { Users } from '../../../shared/interface/user';
import { UsuariosService } from '../../../services/mantenimiento/usuarios.service';
import { UserProfileService } from '../../../services/users/user-profile.service';

@Component({
  selector: 'app-user-profile',
  imports: [NgbNavModule, UserPersonalDetailsComponent, CardComponent,
    UserActivityComponent, UserTaskComponent, UserNotificationComponent,
    UserSettingComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  public currentUserId: number;
  public currentUser: Users;
  public activeTab: string = 'activity';

  public users = users;

  // Definir tabs locales para personalizar
  public userDetailsTab = [
    {
      id: 1,
      title: 'Datos Personales',
      value: 'activity',
      icon: 'fa-solid fa-user'
    },
    {
      id: 2,
      title: 'Cargas Familiares',
      value: 'task',
      icon: 'fa-solid fa-users'
    },
    {
      id: 3,
      title: 'Vacaciones',
      value: 'notification',
      icon: 'fa-solid fa-plane'
    },
    {
      id: 4,
      title: 'Ajustes',
      value: 'setting',
      icon: 'fa-solid fa-gears'
    }
  ];

  public usuarioActual: any = {};

  // Datos del empleado desde el backend
  public datosPersonales: any = null;
  public cargasFamiliares: any[] = [];
  public vacaciones: any[] = [];
  public totalVacacionesDisponibles: number = 0;

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private userProfileService: UserProfileService
  ) {
    this.loadCurrentUserData();
  }

  ngOnInit() {
    console.log('UserProfileComponent.ngOnInit() iniciado');
    console.log('Datos del usuario actual:', this.usuarioActual);

    // Cargar datos del empleado si tenemos el ID (el campo es EmpleadoID, no EMPLEADO_ID)
    if (this.usuarioActual.EmpleadoID) {
      console.log('✅ EmpleadoID encontrado:', this.usuarioActual.EmpleadoID);
      this.loadEmployeeData(this.usuarioActual.EmpleadoID);
    } else {
      console.warn('⚠️ No se encontró EmpleadoID en usuarioActual');
    }

    this.route.params.subscribe(params => {
      console.log('Params recibidos:', params);
      const id = +params['id'];
      if (!isNaN(id)) {
        this.currentUserId = id;
        const user = this.users.find(user => user.id === this.currentUserId);
        if (user) {
          this.currentUser = user;
          console.log('Usuario encontrado:', user);
        } else {
          console.log('Usuario no encontrado con id:', id);
        }
      } else {
        console.log('ID inválido:', params['id']);
      }
    });
  }

  /**
   * Cargar datos del usuario actual
   */
  loadCurrentUserData() {
    try {
      this.usuarioActual = this.usuariosService.getUserSessionData();
      console.log('Datos del usuario actual:', this.usuarioActual);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  /**
   * Cargar datos del empleado desde el backend
   */
  loadEmployeeData(empleadoId: string) {
    console.log('🔄 Cargando datos del empleado ID:', empleadoId);

    // Llamar a getDatosPersonales
    this.userProfileService.getDatosPersonales(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Datos Personales recibidos:', response);
        if (response.success && response.data && response.data.length > 0) {
          this.datosPersonales = response.data[0];
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener datos personales:', error);
      }
    });

    // Llamar a getCargasFamiliares
    this.userProfileService.getCargasFamiliares(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Cargas Familiares recibidas:', response);
        if (response.success && response.data) {
          this.cargasFamiliares = response.data;
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener cargas familiares:', error);
      }
    });

    // Llamar a getVacaciones
    this.userProfileService.getVacaciones(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Vacaciones recibidas:', response);
        if (response.success && response.data) {
          this.vacaciones = response.data;
          // Calcular total de días disponibles
          this.totalVacacionesDisponibles = this.vacaciones.reduce((acc: number, curr: any) => {
            return acc + (parseFloat(curr.Disponibles) || 0);
          }, 0);
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener vacaciones:', error);
      }
    });
  }

}
