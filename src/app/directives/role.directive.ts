import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserProfileService } from '../services/users/user-profile.service';
import { RoleService } from '../config/roles.config';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  
  private roleId!: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userProfileService: UserProfileService
  ) {}

  @Input() set appHasRole(roleId: number) {
    this.roleId = roleId;
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    
    const currentUser = this.userProfileService.getCurrentProfile();
    if (currentUser && currentUser.id_rol === this.roleId) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  
  private permission!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userProfileService: UserProfileService
  ) {}

  @Input() set appHasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    
    const currentUser = this.userProfileService.getCurrentProfile();
    if (currentUser && RoleService.hasPermission(currentUser.id_rol || 0, this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
