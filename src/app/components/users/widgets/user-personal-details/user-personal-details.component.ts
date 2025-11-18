import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { socialShareOptions } from '../../../../shared/data/product';
import { Users } from '../../../../shared/interface/user';
import { UsuariosService } from '../../../../services/mantenimiento/usuarios.service';


@Component({
  selector: 'app-user-personal-details',
  imports: [NgbTooltipModule],
  templateUrl: './user-personal-details.component.html',
  styleUrl: './user-personal-details.component.scss'
})

export class UserPersonalDetailsComponent {

  @Input() currentUser: Users;

  public socialShareOptions = socialShareOptions;
  public user: Users;
  UserData: any = {};

  constructor(private UsuariosService: UsuariosService) { 
    this.GetUserData();
    this.user = {
      id: 0,
      user_name: '',
      name: '',
      user_profile: '',
      designation: '',
      bio: '',
      email: '',
      DOB: '',
      contact_number: '',
      location: '',
      post: 0,
      followers: 0,
      following: 0,
      role: '',
      status: '',
      creation_date: ''
    };
  }

  GetUserData() { 
    this.UserData = this.UsuariosService.getUserSessionData();
  }

  ngOnChanges() {
    this.user = { ...this.currentUser }
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.user_profile = reader.result as string;
        console.log('Imagen cargada:', this.user.user_profile);
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfile() {
    this.user.user_profile = '';
    console.log('Imagen eliminada');
  }

}
