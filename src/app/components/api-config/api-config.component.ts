import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-config-panel">
      <h5>🔧 Configuración de API</h5>
      
      <div class="current-config">
        <h6>Configuración Actual:</h6>
        <div class="info-item">
          <strong>Hostname:</strong> {{ envInfo.hostname }}
        </div>
        <div class="info-item">
          <strong>Protocolo:</strong> {{ envInfo.protocol }}
        </div>
        <div class="info-item">
          <strong>URL de API:</strong> 
          <span class="api-url">{{ envInfo.apiUrl }}</span>
        </div>
        <div class="info-item">
          <strong>Entorno:</strong> 
          <span [class]="envInfo.isLocal ? 'badge-local' : 'badge-production'">
            {{ envInfo.isLocal ? 'Local' : 'Producción' }}
          </span>
        </div>
      </div>

      <div class="manual-config">
        <h6>Cambiar URL manualmente:</h6>
        <div class="form-group">
          <input 
            type="text" 
            [(ngModel)]="customApiUrl" 
            placeholder="http://tu-servidor/plantillaMVC"
            class="form-control">
          <button (click)="updateApiUrl()" class="btn btn-primary btn-sm">
            Actualizar
          </button>
        </div>
      </div>

      <div class="quick-configs">
        <h6>Configuraciones Rápidas:</h6>
        <button (click)="setQuickConfig('localhost')" class="btn btn-outline-secondary btn-sm">
          Localhost
        </button>
        <button (click)="setQuickConfig('127.0.0.1')" class="btn btn-outline-secondary btn-sm">
          127.0.0.1
        </button>
        <button (click)="setQuickConfig('10.5.3.172')" class="btn btn-outline-secondary btn-sm">
          10.5.3.172
        </button>
      </div>
    </div>
  `,
  styles: [`
    .api-config-panel {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      border: 1px solid #dee2e6;
    }
    
    .info-item {
      margin: 5px 0;
      font-size: 14px;
    }
    
    .api-url {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    
    .badge-local {
      background: #28a745;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .badge-production {
      background: #dc3545;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
    
    .form-group {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }
    
    .form-group input {
      flex: 1;
    }
    
    .quick-configs button {
      margin: 5px 5px 5px 0;
    }
    
    h5, h6 {
      margin-bottom: 10px;
      color: #495057;
    }
  `]
})
export class ApiConfigComponent {
  
  envInfo: any;
  customApiUrl: string = '';

  constructor(private configService: ConfigService) {
    this.loadEnvironmentInfo();
  }

  loadEnvironmentInfo() {
    this.envInfo = this.configService.getEnvironmentInfo();
    this.customApiUrl = this.envInfo.apiUrl;
  }

  updateApiUrl() {
    if (this.customApiUrl.trim()) {
      this.configService.setApiUrl(this.customApiUrl.trim());
      this.loadEnvironmentInfo();
      console.log('API URL actualizada a:', this.customApiUrl);
    }
  }

  setQuickConfig(type: string) {
    const configs: { [key: string]: string } = {
      'localhost': 'http://localhost/plantillaMVC',
      '127.0.0.1': 'http://127.0.0.1/plantillaMVC',
      '10.5.3.172': 'http://10.5.3.172/plantillaMVC'
    };
    
    if (configs[type]) {
      this.customApiUrl = configs[type];
      this.updateApiUrl();
    }
  }
}
