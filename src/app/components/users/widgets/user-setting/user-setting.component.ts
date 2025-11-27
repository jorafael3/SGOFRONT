import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { UsuariosService } from '../../../../services/mantenimiento/usuarios.service';

@Component({
  selector: 'app-user-setting',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.scss'
})
export class UserSettingComponent {

  public usuarioActual: any = {};

  // Modelo del formulario
  public solicitud = {
    tipoSolicitud: '',
    campoActualizar: '',
    valorCorrecto: '',
    motivo: ''
  };

  constructor(private usuariosService: UsuariosService) {
    this.loadCurrentUserData();
  }

  /**
   * Cargar datos del usuario actual
   */
  loadCurrentUserData() {
    try {
      this.usuarioActual = this.usuariosService.getUserSessionData();
      console.log('Usuario actual en Ajustes:', this.usuarioActual);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  /**
   * Enviar solicitud de actualización
   */
  enviarSolicitud() {
    // Validar que todos los campos requeridos estén completos
    if (!this.solicitud.tipoSolicitud || !this.solicitud.campoActualizar ||
      !this.solicitud.valorCorrecto || !this.solicitud.motivo) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Preparar el payload para enviar al backend
    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      empleadoNombre: this.usuarioActual.EMPLEADO_NOMBRE,
      tipoSolicitud: this.solicitud.tipoSolicitud,
      campoActualizar: this.solicitud.campoActualizar,
      valorCorrecto: this.solicitud.valorCorrecto,
      motivo: this.solicitud.motivo,
      fechaSolicitud: new Date().toISOString()
    };

    // Mostrar en consola los datos que se enviarán
    console.log('📤 DATOS DE LA SOLICITUD A ENVIAR:');
    console.log('=====================================');
    console.log('Empleado ID:', payload.empleadoId);
    console.log('Empleado Nombre:', payload.empleadoNombre);
    console.log('Tipo de Solicitud:', payload.tipoSolicitud);
    console.log('Campo a Actualizar:', payload.campoActualizar);
    console.log('Valor Correcto:', payload.valorCorrecto);
    console.log('Motivo:', payload.motivo);
    console.log('Fecha de Solicitud:', payload.fechaSolicitud);
    console.log('=====================================');
    console.log('Payload completo:', JSON.stringify(payload, null, 2));

    // TODO: Aquí se hará la llamada al servicio para enviar al backend
    // this.userProfileService.enviarSolicitudActualizacion(payload).subscribe(...)

    alert('Solicitud enviada correctamente. Revisa la consola para ver los datos.');

    // Limpiar el formulario
    this.limpiarFormulario();
  }

  /**
   * Cancelar y limpiar el formulario
   */
  cancelar() {
    this.limpiarFormulario();
  }

  /**
   * Limpiar todos los campos del formulario
   */
  limpiarFormulario() {
    this.solicitud = {
      tipoSolicitud: '',
      campoActualizar: '',
      valorCorrecto: '',
      motivo: ''
    };
  }

}
