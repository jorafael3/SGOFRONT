
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements AfterViewInit {

  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef<HTMLVideoElement>;
  
  public show: boolean = false;
  public loginForm: FormGroup;
  public validate: boolean = false;
  public isLoading: boolean = false;

  constructor(
    public router: Router, 
    private toast: ToastrService,
    private authService: AuthService
  ) {

    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      router.navigate(['/dashboard/default']);
    }

    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", Validators.required),
      empresa: new FormControl("", Validators.required)
    })
  }

  ngAfterViewInit() {
    // Intentar reproducir el video después de que la vista se inicialice
    this.playBackgroundVideo();
  }

  playBackgroundVideo() {
    if (this.backgroundVideo && this.backgroundVideo.nativeElement) {
      const video = this.backgroundVideo.nativeElement;
      
      // Forzar propiedades del video
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      // Intentar reproducir el video
      video.play().catch((error) => {
        console.warn('No se pudo reproducir el video automáticamente:', error);
        // Si falla el autoplay, intentar reproducir en el primer click del usuario
        document.addEventListener('click', () => {
          video.play().catch(() => {
            console.warn('No se pudo reproducir el video después del click');
          });
        }, { once: true });
      });
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  login() {
    this.validate = true;
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const credentials: LoginRequest = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        empresa_code: this.loginForm.value.empresa
      };
      console.log("🚀 ~ LoginComponent ~ login ~ credentials:", credentials)

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log("🚀 ~ LoginComponent ~ login ~ response:", response)
          this.isLoading = false;
          if (response.success) {
            this.toast.success('Login exitoso!', '', {
              positionClass: 'toast-top-right',
              closeButton: true,
              timeOut: 2000
            });
            // Pequeño delay para asegurar que el estado se actualice
            setTimeout(() => {
              console.log('Navigating to dashboard...');
              console.log('IsLoggedIn before navigation:', this.authService.isLoggedIn());
              this.router.navigate(["/dashboard/default"]).then(
                (success) => console.log('Navigation success:', success),
                (error) => console.error('Navigation error:', error)
              );
            }, 100);
          } else {
            this.toast.error(response.message || 'Error en el login', '', {
              positionClass: 'toast-top-right',
              closeButton: true,
              timeOut: 2000
            });
          }
        },
        error: (error) => {
          console.error("🚀 ~ LoginComponent ~ login ~ error:", error)
          this.isLoading = false;
          this.toast.error(error || 'Error en el servidor', '', {
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 2000
          });
        }
      });
    }
  }
}
