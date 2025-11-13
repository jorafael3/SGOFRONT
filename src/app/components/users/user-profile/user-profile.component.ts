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
  public userDetailsTab = userDetailsTab;
  public usuarioActual: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService
  ) {
    this.loadCurrentUserData();
  }

  ngOnInit() {
    console.log('UserProfileComponent.ngOnInit() iniciado');
    console.log('Datos del usuario actual antes de params:', this.usuarioActual);
    
    this.route.params.subscribe(params => {
      console.log('Params recibidos:', params);
      const id = +params['id'];
      if (!isNaN(id)) {
        this.currentUserId = id;
        const user = this.users.find(user => user.id === this.currentUserId);
        if(user) {
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

}
