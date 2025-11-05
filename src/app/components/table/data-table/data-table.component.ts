import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { country } from '../../../shared/data/data-table';
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { Country } from '../../../shared/interface/data-table';

@Component({
  selector: 'app-data-table',
  imports: [TableComponent, CardComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})

export class DataTableComponent {

  public country = country;
  public isLoading = false; // Estado de carga
  
  // Configuración de botones personalizados
  public customButtons: CustomButton[] = [
    {
      label: 'Refresh',
      action: 'refresh_data',
      icon: 'fa fa-sync-alt',
      class: 'btn btn-primary',
      tooltip: 'Recargar datos de la tabla'
    },
    {
      label: 'Reset Filters',
      action: 'reset_filters',
      icon: 'fa fa-times-circle',
      class: 'btn btn-secondary',
      tooltip: 'Limpiar todos los filtros'
    },
    {
      label: 'Simulate Load',
      action: 'simulate_load',
      icon: 'fa fa-database',
      class: 'btn btn-info',
      tooltip: 'Simular carga de datos desde servidor'
    }
  ];
  
  public tableConfig: TableConfigs = {
    columns: [
      { title: '#', field_value: 'id', sort: true },
      { title: 'Country', field_value: 'country_name', sort: true },
      { title: 'Area', field_value: 'area', sort: true },
      { title: 'Population', field_value: 'population', sort: true },
    ],
    row_action: [
      {
        label: 'Ver Detalles',
        action_to_perform: 'view_details',
        icon: 'eye',
        type: 'button',
        class: 'btn btn-primary btn-sm me-2'
      },
      {
        label: 'Editar',
        action_to_perform: 'edit',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-warning btn-sm'
      }
    ],
    data: [] as Country[]
  };
  
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadTableData();
  }

  // Función para cargar/recargar los datos de la tabla
  private loadTableData() {
    console.log('Cargando datos de la tabla...');
    this.tableConfig.data = this.formatCountryData(country);
    console.log('Datos cargados:', this.tableConfig.data.length, 'países');
  }

  // Función asíncrona para simular carga desde servidor
  private async loadTableDataAsync(): Promise<void> {
    console.log('Iniciando carga asíncrona de datos...');
    this.isLoading = true;
    
    try {
      // Simular delay de red
      await this.delay(2000);
      
      // Cargar datos
      this.tableConfig.data = this.formatCountryData(country);
      
      console.log('Datos cargados de forma asíncrona:', this.tableConfig.data.length, 'países');
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      this.isLoading = false;
    }
  }

  // Función utilitaria para crear delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Función para formatear los datos de países
  private formatCountryData(countries: Country[]): Country[] {
    return countries.map((country: Country) => {
      const formattedCountry = { ...country };
      const html = `<img src="https://upload.wikimedia.org/wikipedia/commons/${country.flag}"	
                       [alt]="'The flag of '${country.country_name}" 
                      class="me-2" 
                     style="width:20px"/> ${country.country_name}`;
                     
      // formattedCountry.country_name = this.sanitizer.bypassSecurityTrustHtml(html)

      return formattedCountry;
    });
  }

  // Método público para refrescar los datos (llamado desde botones externos)
  public refreshTableData() {
    console.log('Refrescando datos de la tabla...');
    this.loadTableData();
  }

  // Método para manejar las acciones de los botones
  onTableAction(action: TableClickedAction) {
    console.log('Acción ejecutada:', action);
    
    switch (action.action_to_perform) {
      case 'view_details':
        this.viewCountryDetails(action.data);
        break;
      case 'edit':
        this.editCountry(action.data);
        break;
      default:
        console.log('Acción no reconocida:', action.action_to_perform);
    }
  }

  // Método para manejar acciones de botones personalizados
  onCustomAction(event: {action: string, data?: any}) {
    console.log('Acción personalizada ejecutada:', event);
    
    switch (event.action) {
      case 'refresh_data':
        this.handleRefreshData();
        break;
      case 'reset_filters':
        this.handleResetFilters();
        break;
      case 'simulate_load':
        this.handleSimulateLoad();
        break;
      default:
        console.log('Acción personalizada no reconocida:', event.action);
    }
  }

  // Manejo específico para refresh de datos
  private handleRefreshData() {
    console.log('Ejecutando refresh de datos...');
    this.refreshTableData();
    // Aquí podrías agregar un toast o notificación
    // this.showSuccessMessage('Datos actualizados correctamente');
  }

  // Manejo específico para reset de filtros
  private handleResetFilters() {
    console.log('Limpiando filtros...');
    // Aquí podrías agregar lógica para limpiar filtros
    // Por ejemplo, restablecer fechas, búsquedas, etc.
    this.refreshTableData();
  }

  // Manejo específico para simular carga
  private handleSimulateLoad() {
    console.log('Simulando carga de datos desde servidor...');
    this.loadTableDataAsync();
  }

  // Método para ver detalles del país
  private viewCountryDetails(country: Country) {
    // alert(`Detalles del país:\n\nPaís: ${country.country_name}\nÁrea: ${country.area}\nPoblación: ${country.population}`);
    console.log('Ver detalles de:', country);
  }

  // Método para editar el país
  private editCountry(country: Country) {
    // alert(`Editando el país: ${country.country_name}`);
    console.log('Editar país:', country);
    // Aquí puedes abrir un modal o navegar a una página de edición
  }
}
