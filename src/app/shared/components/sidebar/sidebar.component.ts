import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { HeaderLogoComponent } from "../header/widgets/header-logo/header-logo.component";
import { FeatherIconComponent } from "../ui/feather-icon/feather-icon.component";
import { SvgIconComponent } from "../ui/svg-icon/svg-icon.component";
import { LayoutService } from '../../services/layout.service';
import { UsuariosService } from '../../../services/mantenimiento/usuarios.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, HeaderLogoComponent,
    FeatherIconComponent, SvgIconComponent, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  public menuItems: any[] = [];
  public items: any[] = [];
  public leftArrow: boolean = false;
  public rightArrow: boolean = true;
  public pinedItem: any[] = [];

  constructor(private router: Router, public layoutService: LayoutService, private UsuariosService: UsuariosService) {

    this.CargarMenus();

  }

  CargarMenus() {
    this.UsuariosService.GetUserMenu({}).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        
        
        if (response.success && response.data) {
          // Inicializar las propiedades pined y active correctamente
          this.menuItems = this.initializeMenuProperties(response.data);
          this.items = this.menuItems;
          
          // Configurar navegación después de cargar los menús
          this.setupNavigation();
        }
      },
      error: (error: any) => {
        
        this.menuItems = [];
        this.items = [];
      }
    });
  }

  initializeMenuProperties(menuData: any[]): any[] {
    return menuData.map((item: any) => {
      // Inicializar propiedades correctamente
      const menuItem = {
        ...item,
        pined: false,  // Forzar false para todos los elementos
        active: item.type === 'main_title' ? true : false  // Solo main_title activo inicialmente
      };

      // Si tiene children, aplicar recursivamente
      if (menuItem.children && menuItem.children.length > 0) {
        menuItem.children = this.initializeMenuProperties(menuItem.children);
      }

      return menuItem;
    });
  }

  setupNavigation() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlTree = this.router.parseUrl(event.url);
        const cleanPath = '/' + urlTree.root.children['primary']?.segments.map(segment => segment.path).join('/');
        
        this.menuItems.filter((items: any) => {
          if (items.path === cleanPath) {
            this.setNavActive(items);
          }
          if (!items.children) { return false; }
          items.children.filter((subItems: any) => {
            if (subItems.path === cleanPath) {
              this.setNavActive(subItems);
            }
            if (!subItems.children) { return false; }
            subItems.children.filter((subSubItems: any) => {
              if (subSubItems.path === cleanPath) {
                this.setNavActive(subSubItems);
              }
            });
          });
        });
      }
    });
  }

  setNavActive(items: any) {
    this.menuItems.filter((menuItem: any) => {
      if (menuItem !== items) {
        menuItem.active = false;
      } else {
        menuItem.active = true;
        setTimeout(() => {
          this.scroll(items)
        }, 2000);
      }

      if (menuItem.children && menuItem.children.includes(items)) {
        menuItem.active = true;
        setTimeout(() => {
          this.scroll(menuItem)
        }, 2000);
      }

      if (menuItem.children) {
        menuItem.children.filter((submenuItems: any) => {
          if (submenuItems.children && submenuItems.children.includes(items)) {
            menuItem.active = true;
            submenuItems.active = true;
            setTimeout(() => {
              this.scroll(menuItem)
            }, 2000);
          }
        });
      }
    });
  }

  toggleMenu(item: any) {
    if (!item.active) {
      this.menuItems.forEach((menu: any) => {
        if (this.menuItems.includes(item)) {
          menu.active = false
        }
        if (!menu.children) {
          return false;
        }

        menu.children.forEach((subMenu: any) => {
          if (menu.children?.includes(item)) {
            subMenu.active = false
          }

          if (subMenu.children) {
            subMenu.children.forEach((details: any) => {
              if (subMenu.children?.includes(item)) {
                details.active = false;
              }
            })
          }
        })
      })
    }
    item.active = !item.active;
  }

  scrollLeft() {
    this.rightArrow = true;
    if (this.layoutService.margin != 0) {
      this.layoutService.margin = this.layoutService.margin + 500;
    }

    if (this.layoutService.margin == 0) {
      this.leftArrow = false;
    }
  }

  scrollRight() {
    this.leftArrow = true;
    if (this.layoutService.margin != this.layoutService.scrollMargin) {
      this.layoutService.margin = this.layoutService.margin - 500;
    }
    if (this.layoutService.margin == this.layoutService.scrollMargin) {
      this.rightArrow = false;
    }
  }

  closeSidebar() {
    this.layoutService.closeSidebar = true;
  }

  pined(item: any) {
    
    
    if (!item.pined) {
      // Marcar como pineado
      item.pined = true;
      if (!this.pinedItem.includes(item)) {
        this.pinedItem.push(item);
      }
      
    } else {
      // Desmarcar como pineado
      item.pined = false;
      const index = this.pinedItem.indexOf(item);
      if (index > -1) {
        this.pinedItem.splice(index, 1);
      }
      
    }

    
    this.scroll(item);
  }

  scroll(item: any) {
    if (item && item.id) {
      const scrollDiv = document.getElementById(item.id);
      if (scrollDiv) {
        setTimeout(() => {
          scrollDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100);
      }
    }
  }

}
