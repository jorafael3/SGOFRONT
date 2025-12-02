import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { userDetailsTab, users } from '../../../shared/data/user';
import { UserPersonalDetailsComponent } from '../widgets/user-personal-details/user-personal-details.component';
import { UserActivityComponent } from '../widgets/user-activity/user-activity.component';
import { UserTaskComponent } from '../widgets/user-task/user-task.component';
import { UserNotificationComponent } from '../widgets/user-notification/user-notification.component';
import { UserSettingComponent } from '../widgets/user-setting/user-setting.component';
import { UsuariosService } from '../../../services/mantenimiento/usuarios.service';
import { UserProfileService } from '../../../services/users/user-profile.service';

@Component({
  selector: 'app-user-profile',
  imports: [NgbNavModule, UserPersonalDetailsComponent, CardComponent,
    UserActivityComponent, UserTaskComponent, UserNotificationComponent,
    UserSettingComponent, CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  public activeTab = 'activity';
  public currentUser: any;
  public usuarioActual: any = {};

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
      id: 5,
      title: 'Estudios Realizados',
      value: 'education',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      id: 6,
      title: 'Roles de Pago',
      value: 'payroll',
      icon: 'fa-solid fa-money-bill'
    },
    {
      id: 4,
      title: 'Ajustes',
      value: 'setting',
      icon: 'fa-solid fa-cog'
    }
  ];

  // Datos del empleado desde el backend
  public datosPersonales: any = null;
  public datosPersonalesOriginal: any = null; // Backup para cancelar edición
  public editandoDatosPersonales: boolean = false;

  public cargasFamiliares: any[] = [];
  public vacaciones: any[] = [];
  public totalVacacionesDisponibles: number = 0;

  // Nueva carga familiar
  public nuevaCarga = {
    nombres: '',
    cedula: '',
    tipoCarga: '',
    sexo: '',
    fechaNacimiento: '',
    edad: ''
  };
  public mostrarFormularioCarga: boolean = false;

  // Datos de estudios y médicos
  public estudios: any[] = [];
  public nuevoEstudio = {
    titulo: '',
    institucion: '',
    anio: ''
  };
  public datosMedicos: any = {
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    contactoEmergenciaRelacion: '',
    alergias: '',
    enfermedades: ''
  };
  public tieneEnfermedades: boolean = false;

  // Roles de Pago
  public fechaConsultaRol: string = '';
  public rolesPago: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.currentUser = data['user'];
    });

    // Obtener usuario actual del servicio
    this.userProfileService.userProfile$.subscribe((usuario: any) => {
      if (usuario) {
        this.usuarioActual = usuario;
        console.log('👤 Usuario actual cargado:', this.usuarioActual);

        // Cargar datos del empleado
        if (this.usuarioActual.EmpleadoID) {
          this.loadEmployeeData(this.usuarioActual.EmpleadoID);
        }
      }
    });
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
          this.totalVacacionesDisponibles = this.vacaciones.reduce((total, vacacion) => {
            const disponibles = parseFloat(vacacion.Disponibles) || 0;
            return total + disponibles;
          }, 0);
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener vacaciones:', error);
      }
    });


    // Llamar a getCargasEstudios
    this.userProfileService.getCargasEstudios(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Estudios recibidos:', response);
        if (response.success && response.data) {
          this.estudios = response.data;
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener estudios:', error);
      }
    });

    // Llamar a getenfermedades
    const payload = { empleadoId: empleadoId };
    this.userProfileService.getenfermedades(payload).subscribe({
      next: (response) => {
        console.log('✅ Datos médicos recibidos:', response);
        if (response.success && response.data && response.data.length > 0) {
          // Los datos vienen en un array, acceder al primer elemento
          const datos = response.data[0];
          this.datosMedicos = {
            contactoEmergenciaNombre: datos.contactoEmergenciaNombre || '',
            contactoEmergenciaTelefono: datos.contactoEmergenciaTelefono || '',
            contactoEmergenciaRelacion: datos.contactoEmergenciaRelacion || '',
            alergias: datos.alergias || '',
            enfermedades: datos.enfermedades || ''
          };
          // Si hay datos médicos, marcar el checkbox
          if (datos.alergias || datos.enfermedades || datos.contactoEmergenciaNombre) {
            this.tieneEnfermedades = true;
          }
          console.log('📋 Datos médicos cargados:', this.datosMedicos);
        }
      },
      error: (error: any) => {
        console.error('❌ Error al obtener datos médicos:', error);
      }
    });
  }

  /**
   * Recargar solo datos personales
   */
  loadDatosPersonales() {
    const empleadoId = this.usuarioActual.EmpleadoID;
    console.log('🔄 Recargando datos personales del empleado ID:', empleadoId);

    this.userProfileService.getDatosPersonales(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Datos Personales recargados:', response);
        if (response.success && response.data && response.data.length > 0) {
          this.datosPersonales = response.data[0];
        }
      },
      error: (error: any) => {
        console.error('❌ Error al recargar datos personales:', error);
      }
    });
  }

  /**
   * Activar modo edición para datos personales
   */
  editarDatosPersonales() {
    this.editandoDatosPersonales = true;
    // Guardar copia de seguridad
    this.datosPersonalesOriginal = { ...this.datosPersonales };
  }

  /**
   * Cancelar edición de datos personales
   */
  cancelarEdicionDatosPersonales() {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se perderán los cambios realizados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Restaurar datos originales
        this.datosPersonales = { ...this.datosPersonalesOriginal };
        this.editandoDatosPersonales = false;
      }
    });
  }

  /**
   * Actualizar datos personales
   */
  actualizarDatosPersonales() {
    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      ...this.datosPersonales
    };

    console.log('📤 Actualizando datos personales:', payload);

    // Llamar al servicio para actualizar
    this.userProfileService.actualizarDatosPersonales(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);

        // Validar si la respuesta fue exitosa
        if (response.success) {
          console.log('✅ ÉXITO:', response.message || 'Datos actualizados correctamente');
          if (response.data) {
            console.log('Datos actualizados:', response.data);
          }

          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: response.message || 'Los datos personales han sido actualizados correctamente',
            confirmButtonColor: '#3085d6'
          });

          this.editandoDatosPersonales = false;

          // Recargar datos personales para reflejar cambios
          this.loadDatosPersonales();
        } else {
          // El backend respondió pero con error
          console.error('❌ ERROR del backend:', response.error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudieron actualizar los datos personales',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ ERROR HTTP:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Por favor intente nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  /**
   * Mostrar/ocultar formulario de nueva carga familiar
   */
  toggleFormularioCarga() {
    this.mostrarFormularioCarga = !this.mostrarFormularioCarga;
    if (!this.mostrarFormularioCarga) {
      // Limpiar formulario al ocultar
      this.nuevaCarga = {
        nombres: '',
        cedula: '',
        tipoCarga: '',
        sexo: '',
        fechaNacimiento: '',
        edad: ''
      };
    }
  }

  /**
   * Agregar nueva carga familiar (guarda directamente al backend)
   */
  agregarCargaFamiliar() {
    if (!this.nuevaCarga.nombres || !this.nuevaCarga.cedula || !this.nuevaCarga.tipoCarga) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete al menos nombre, cédula y parentesco',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Calcular edad automáticamente si hay fecha de nacimiento
    let edadCalculada = '';
    if (this.nuevaCarga.fechaNacimiento) {
      edadCalculada = this.calcularEdad(this.nuevaCarga.fechaNacimiento);
    }

    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      cargasFamiliares: [{
        Nombres: this.nuevaCarga.nombres,
        'cédula': this.nuevaCarga.cedula,
        TipoCarga: this.nuevaCarga.tipoCarga,
        Sexo: this.nuevaCarga.sexo,
        FechaNacimiento: this.nuevaCarga.fechaNacimiento,
        Edad: edadCalculada,
        empleadoId: this.usuarioActual.EmpleadoID,
        Creado_Por: this.usuarioActual.username
      }]
    };

    console.log('📤 Guardando nueva carga familiar:', payload);

    this.userProfileService.actualizarcargasempleado(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: response.message || 'La carga familiar ha sido guardada correctamente',
            timer: 2000,
            showConfirmButton: false
          });

          // Limpiar y ocultar formulario
          this.toggleFormularioCarga();

          // Recargar cargas familiares desde el backend
          this.recargarCargasFamiliares();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudo guardar la carga familiar',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al guardar carga:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  /**
   * Recargar cargas familiares desde el backend
   */
  recargarCargasFamiliares() {
    const empleadoId = this.usuarioActual.EmpleadoID;
    this.userProfileService.getCargasFamiliares(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Cargas familiares recargadas:', response);
        if (response.success && response.data) {
          this.cargasFamiliares = response.data;
        }
      },
      error: (error: any) => {
        console.error('❌ Error al recargar cargas familiares:', error);
      }
    });
  }

  /**
   * Calcular edad a partir de fecha de nacimiento
   */
  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '';

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad.toString();
  }

  /**
   * Guardar cargas familiares al backend
   */
  guardarCargasFamiliares() {
    if (this.cargasFamiliares.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin cargas',
        text: 'No hay cargas familiares para guardar',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      cargasFamiliares: this.cargasFamiliares
    };

    console.log('📤 Guardando cargas familiares:', payload);

    this.userProfileService.actualizarcargasempleado(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: response.message || 'Las cargas familiares han sido guardadas correctamente',
            confirmButtonColor: '#3085d6'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudieron guardar las cargas familiares',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al guardar cargas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  /**
   * Agregar un nuevo estudio (guarda directamente al backend)
   */
  agregarEstudio() {
    if (!this.nuevoEstudio.titulo || !this.nuevoEstudio.institucion || !this.nuevoEstudio.anio) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos del estudio',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      estudios: [{
        titulo: this.nuevoEstudio.titulo,
        institucion: this.nuevoEstudio.institucion,
        anio: this.nuevoEstudio.anio,
        Creado_Por: this.usuarioActual.username
      }]
    };

    console.log('📤 Guardando nuevo estudio:', payload);

    this.userProfileService.actualizarestudios(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: response.message || 'El estudio ha sido guardado correctamente',
            timer: 2000,
            showConfirmButton: false
          });

          // Limpiar formulario
          this.nuevoEstudio = {
            titulo: '',
            institucion: '',
            anio: ''
          };

          // Recargar estudios desde el backend
          this.recargarEstudios();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudo guardar el estudio',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al guardar estudio:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  /**
   * Recargar estudios desde el backend
   */
  recargarEstudios() {
    const empleadoId = this.usuarioActual.EmpleadoID;
    this.userProfileService.getCargasEstudios(empleadoId).subscribe({
      next: (response) => {
        console.log('✅ Estudios recargados:', response);
        if (response.success && response.data) {
          this.estudios = response.data;
        }
      },
      error: (error: any) => {
        console.error('❌ Error al recargar estudios:', error);
      }
    });
  }

  /**
   * Eliminar un estudio
   */
  eliminarEstudio(index: number) {
    Swal.fire({
      title: '¿Eliminar estudio?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.estudios.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El estudio ha sido eliminado',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  /**
   * Guardar estudios al backend
   */
  guardarEstudios() {

    if (this.estudios.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin estudios',
        text: 'No hay estudios para guardar',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      estudios: this.estudios
    };

    console.log('📤 Guardando estudios:', payload);

    this.userProfileService.actualizarestudios(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: response.message || 'Datos de estudio guardados correctamente',
            confirmButtonColor: '#3085d6'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudieron guardar las cargas familiares',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al guardar cargas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }



  /**
   * Guardar datos médicos al backend
   */
  guardarDatosMedicos() {

    const payload = {

      empleadoId: this.usuarioActual.EmpleadoID,
      ...this.datosMedicos
    };

    console.log('📤 Guardando datos médicos:', payload);

    this.userProfileService.actualizarenfermedades(payload).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: response.message || 'Datos de enfermedades guardados correctamente',
            confirmButtonColor: '#3085d6'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudieron guardar las cargas familiares',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al guardar cargas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  /**
   * Consultar roles de pago por fecha
   */
  consultarRolesPago() {
    if (!this.fechaConsultaRol) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Por favor seleccione una fecha para consultar',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Convertir fecha de YYYY-MM a YYYYMMDD (primer día del mes)
    const fechaFormateada = this.fechaConsultaRol.replace('-', '') + '01';

    const payload = {
      empleadoId: this.usuarioActual.EmpleadoID,
      fecha: fechaFormateada
    };

    console.log('📤 Consultando roles de pago:', payload);

    this.userProfileService.consultarRolesPago(payload).subscribe({
      next: (response) => {
        console.log('✅ Roles de pago recibidos:', response);
        if (response.success && response.data) {
          this.rolesPago = response.data;
          if (this.rolesPago.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Sin resultados',
              text: 'No se encontraron roles de pago para la fecha seleccionada',
              confirmButtonColor: '#3085d6'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'No se pudieron obtener los roles de pago',
            confirmButtonColor: '#d33'
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al consultar roles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          confirmButtonColor: '#d33'
        });
      }
    });
  }


  formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


  // abrirPDF(rol: any) {
  //   console.log("Abrir PDF para:", rol);
  //   // Aquí luego implementas la descarga del pdf
  // }



  abrirPDF(rol: any) {
    console.log("📄 Abrir PDF para:", rol);

    this.userProfileService.descargarRolPago(rol.RolID).subscribe({
      next: (response) => {
        console.log("✅ Respuesta backend PDF:", response);

        // Caso 1: si backend devuelve base64
        if (response?.pdfBase64) {
          const byteCharacters = atob(response.pdfBase64);
          const bytes = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            bytes[i] = byteCharacters.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          return;
        }

        // Caso 2: si backend devuelve una URL para abrir
        if (response?.url) {
          window.open(response.url, "_blank");
          return;
        }

        // Caso 3: si devuelve blob directo (muy raro pero valido)
        if (response instanceof Blob) {
          const url = URL.createObjectURL(response);
          window.open(url, "_blank");
          return;
        }

        // Si no identifica formato
        Swal.fire({
          icon: "error",
          title: "Formato desconocido",
          text: "El servidor no regresó un PDF válido."
        });
      },
      error: (error) => {
        console.error("❌ Error al pedir PDF:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el rol de pago"
        });
      }
    });
  }




  // abrirPDF() {

  //   if (this.roles.length === 0) {
  //     Swal.fire({
  //       icon: 'info',
  //       title: 'Sin roles',
  //       text: 'No hay roles para guardar',
  //       confirmButtonColor: '#3085d6'
  //     });
  //     return;
  //   }

  //   const payload = {
  //     empleadoId: this.usuarioActual.EmpleadoID,
  //     roles: this.roles   // <<— AQUÍ ENVIAS LOS IDS O OBJETOS DE ROLES
  //   };

  //   console.log('📤 Guardando roles:', payload);

  //   this.userProfileService.actualizarroles(payload).subscribe({
  //     next: (response) => {
  //       console.log('✅ Respuesta del backend:', response);
  //       if (response.success) {
  //         Swal.fire({
  //           icon: 'success',
  //           title: '¡Guardado!',
  //           text: response.message || 'Roles guardados correctamente',
  //           confirmButtonColor: '#3085d6'
  //         });
  //       } else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: response.error || 'No se pudieron guardar los roles',
  //           confirmButtonColor: '#d33'
  //         });
  //       }
  //     },
  //     error: (error) => {
  //       console.error('❌ Error al guardar roles:', error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error de conexión',
  //         text: 'No se pudo conectar con el servidor',
  //         confirmButtonColor: '#d33'
  //       });
  //     }
  //   });
  // }

}
