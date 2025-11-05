import { Component } from '@angular/core';

import { SvgIconComponent } from "../ui/svg-icon/svg-icon.component";
import { HeaderBookmarkComponent } from "./widgets/header-bookmark/header-bookmark.component";
import { HeaderCartComponent } from "./widgets/header-cart/header-cart.component";
import { HeaderLanguageComponent } from "./widgets/header-language/header-language.component";
import { HeaderLogoComponent } from "./widgets/header-logo/header-logo.component";
import { HeaderNoticeComponent } from "./widgets/header-notice/header-notice.component";
import { HeaderNotificationComponent } from "./widgets/header-notification/header-notification.component";
import { ModeComponent } from "./widgets/mode/mode.component";
import { ProfileComponent } from "./widgets/profile/profile.component";
import { SearchComponent } from "./widgets/search/search.component";
import { ToggleScreenComponent } from "./widgets/toggle-screen/toggle-screen.component";
import { OutsideDirective } from '../../directives/outside.directive';
import { NavService } from '../../services/nav.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [OutsideDirective, HeaderLogoComponent, HeaderNoticeComponent, HeaderLanguageComponent,
    ToggleScreenComponent, SvgIconComponent, SearchComponent,
    HeaderBookmarkComponent, ModeComponent, HeaderCartComponent,
    HeaderNotificationComponent, ProfileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  constructor(private navService: NavService, private authService: AuthService) { }

  ngOnInit() {
    this.GetUserData();
  }

  toggleLanguage() {
    this.navService.isLanguage = !this.navService.isLanguage;
  }

  clickOutside() {
    this.navService.isLanguage = false;
  }

  openSearch() {
    this.navService.isSearchOpen = true;
  }

  GetUserData() {
    
  }

}
