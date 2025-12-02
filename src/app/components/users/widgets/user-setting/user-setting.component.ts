import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { UsuariosService } from '../../../../services/mantenimiento/usuarios.service';
import { UserProfileService } from '../../../../services/users/user-profile.service';

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

  constructor(
    private usuariosService: UsuariosService,
    private userProfileService: UserProfileService
  ) {
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
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos requeridos',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Mostrar confirmación antes de enviar
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea enviar esta solicitud de actualización de datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarEnvio();
      }
    });
  }

  /**
   * Procesar el envío de la solicitud
   */
  private procesarEnvio() {
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

    // Mostrar loading
    Swal.fire({
      title: 'Enviando solicitud...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Enviar al backend
    this.userProfileService.enviarSolicitudActualizacion(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        Swal.close();

        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Solicitud enviada!',
            text: 'Su solicitud ha sido enviada correctamente y será procesada a la brevedad.',
            confirmButtonColor: '#3085d6'
          });
          this.limpiarFormulario();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo enviar la solicitud. Por favor intente nuevamente.',
            confirmButtonColor: '#3085d6'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al enviar solicitud:', error);
        Swal.close();

        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Por favor verifique su conexión e intente nuevamente.',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  /**
   * Cancelar y limpiar el formulario
   */
  cancelar() {
    if (this.solicitud.tipoSolicitud || this.solicitud.campoActualizar ||
      this.solicitud.valorCorrecto || this.solicitud.motivo) {
      Swal.fire({
        title: '¿Cancelar solicitud?',
        text: 'Se perderán los datos ingresados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.limpiarFormulario();
          Swal.fire({
            icon: 'info',
            title: 'Cancelado',
            text: 'La solicitud ha sido cancelada',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    } else {
      this.limpiarFormulario();
    }
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
