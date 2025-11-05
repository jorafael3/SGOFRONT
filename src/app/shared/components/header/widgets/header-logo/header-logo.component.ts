import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutService } from '../../../../services/layout.service';
import { FeatherIconComponent } from '../../../ui/feather-icon/feather-icon.component';
import { AuthService } from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-header-logo',
  imports: [RouterModule, FeatherIconComponent],
  templateUrl: './header-logo.component.html',
  styleUrls: ['./header-logo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderLogoComponent {

  @Input() icon: string;
  @Input() type: string;

  EmpresaNombre: string = '';

  constructor(public layoutService: LayoutService, private authService: AuthService) { }

  ngOnInit() {
    this.GetUserData();
  }

  toggleSidebar() {
    this.layoutService.closeSidebar = !this.layoutService.closeSidebar;
  }

  GetUserData() {
    
    let datauser = this.authService.getCurrentUser();
    this.EmpresaNombre = datauser?.empresa_name || 'SGO Front';
  }

}
