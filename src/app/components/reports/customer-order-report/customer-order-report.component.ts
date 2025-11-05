import { Component } from '@angular/core';

import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { customerOrderReport } from '../../../shared/data/reports';
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import { CustomerOrderReport } from '../../../shared/interface/reports';
import { ChatService } from '../../../shared/services/chat.service';

@Component({
  selector: 'app-customer-order-report',
  imports: [CardComponent, TableComponent],
  templateUrl: './customer-order-report.component.html',
  styleUrl: './customer-order-report.component.scss'
})

export class CustomerOrderReportComponent {

  public customerOrder: CustomerOrderReport[];
  public allCustomerOrders: CustomerOrderReport[] = []; // Copia completa de los datos
  public selectedDateFilter: string = 'this_month'; // Filtro inicial: este mes
  public isLoading = false; // Estado de carga
  
  // Configuración de botones personalizados
  public customButtons: CustomButton[] = [
    {
      label: '',
      action: 'refresh',
      icon: 'fa fa-refresh',
      class: 'btn btn-success',
      tooltip: 'Actualizar datos de la tabla'
    },
    {
      label: '',
      action: 'send_email',
      icon: 'fa fa-envelope',
      class: 'btn btn-info',
      tooltip: 'Enviar reporte por email'
    },
    {
      label: '',
      action: 'generate_report',
      icon: 'fa fa-chart-bar',
      class: 'btn btn-warning',
      tooltip: 'Generar reporte personalizado'
    },
    {
      label: '',
      action: 'clear_filters',
      icon: 'fa fa-times',
      class: 'btn btn-secondary',
      tooltip: 'Limpiar filtros de fecha'
    }
  ];
  
  public tableConfig: TableConfigs = {
    columns: [
      { title: 'Customer Name', field_value: 'customer_name', sort: true },
      { title: 'Customer Group', field_value: 'customer_group', sort: true },
      { title: 'No. Of Orders', field_value: 'orders', sort: true },
      { title: 'No. Of Products', field_value: 'items', sort: true },
      { title: 'Total', field_value: 'total', sort: true, type: 'price' },
    ],
    row_action: [
      {
        label: 'Ver Pedidos',
        action_to_perform: 'view_orders',
        icon: 'eye',
        type: 'button',
        class: 'btn btn-info btn-sm me-2'
      },
      {
        label: 'Contactar',
        action_to_perform: 'contact_customer',
        icon: 'message',
        type: 'button',
        class: 'btn btn-success btn-sm'
      }
    ],
    data: [] as CustomerOrderReport[]
  };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadTableData();
  }

  // Función principal para cargar datos
  private loadTableData() {
    console.log('Cargando datos de customer orders...');
    
    // Generar datos con fechas aleatorias
    this.allCustomerOrders = this.addRandomDatesToOrders(customerOrderReport);
    
    // Aplicar filtro de fecha actual
    this.applyDateFilter();
  }

  // Función para agregar fechas aleatorias a los pedidos
  private addRandomDatesToOrders(orders: CustomerOrderReport[]): CustomerOrderReport[] {
    const dates = this.generateRandomDates();
    
    return orders.map((order, index) => ({
      ...order,
      date: dates[index % dates.length] // Ciclar a través de las fechas
    }));
  }

  // Generar fechas aleatorias para los últimos 30 días
  private generateRandomDates(): string[] {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }
    
    return dates;
  }

  // Aplicar filtro de fecha
  private applyDateFilter() {
    let filteredData: CustomerOrderReport[] = [];
    
    switch (this.selectedDateFilter) {
      case 'today':
        filteredData = this.filterByToday();
        break;
      case 'yesterday':
        filteredData = this.filterByYesterday();
        break;
      case '7_days':
        filteredData = this.filterByLast7Days();
        break;
      case '30_days':
        filteredData = this.filterByLast30Days();
        break;
      case 'this_month':
        filteredData = this.filterByThisMonth();
        break;
      case 'last_month':
        filteredData = this.filterByLastMonth();
        break;
      default:
        filteredData = this.allCustomerOrders; // Mostrar todos
    }
    
    console.log(`Filtro aplicado: ${this.selectedDateFilter}, Registros: ${filteredData.length}`);
    this.tableConfig.data = this.formatCustomerOrder(filteredData);
    this.customerOrder = filteredData;
  }

  // Métodos de filtrado por fecha
  private filterByToday(): CustomerOrderReport[] {
    const today = new Date().toISOString().split('T')[0];
    return this.allCustomerOrders.filter(order => order.date === today);
  }

  private filterByYesterday(): CustomerOrderReport[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return this.allCustomerOrders.filter(order => order.date === yesterdayStr);
  }

  private filterByLast7Days(): CustomerOrderReport[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    return this.allCustomerOrders.filter(order => order.date >= sevenDaysAgoStr);
  }

  private filterByLast30Days(): CustomerOrderReport[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    return this.allCustomerOrders.filter(order => order.date >= thirtyDaysAgoStr);
  }

  private filterByThisMonth(): CustomerOrderReport[] {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];
    
    // Filtrar desde el inicio del mes hasta hoy
    return this.allCustomerOrders.filter(order => 
      order.date >= firstDayStr && order.date <= todayStr
    );
  }

  private filterByLastMonth(): CustomerOrderReport[] {
    const now = new Date();
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const firstDayStr = firstDayOfLastMonth.toISOString().split('T')[0];
    const lastDayStr = lastDayOfLastMonth.toISOString().split('T')[0];
    
    return this.allCustomerOrders.filter(order => 
      order.date >= firstDayStr && order.date <= lastDayStr
    );
  }

  private formatCustomerOrder(orders: CustomerOrderReport[]) {
    return orders.map((order: CustomerOrderReport) => {
      const formattedOrder = { ...order };
      formattedOrder.customer_name = `<div class="customer-details">
                                        <img class="img-fluid" src="${order.customer_profile}" alt="${order.customer_name}">
                                        <div>
                                        <a href="javascript:void(0">${order.customer_name}</a>
                                          <p class="c-o-light">${order.customer_email}</p>
                                        </div>
                                      </div>`;
      
      let customerGroupHTML = '';
      for (let i = 0; i < order.customer_group.length; i++) {
        
        if(order.customer_group[i]['profile']) {
          customerGroupHTML += `<li>
                                  <img class="common-circle" src="${order.customer_group[i]['profile']}" alt="user">
                                </li>`;
        } else {
          customerGroupHTML += `<li> 
                                  <div class="common-circle bg-lighter-${this.chatService.getTextColor(this.chatService.getUserText(order.customer_group[i]['name']))}">${this.chatService.getUserText(order.customer_group[i]['name'], 'singleText')}</div>
                                </li>`
        }
      }
      formattedOrder.customer_group = `<ul class="common-f-start customer-group">
                                        ${customerGroupHTML}
                                      </ul>`

      
      return formattedOrder;
    });
  }

  // Método para manejar las acciones de los botones
  onTableAction(action: TableClickedAction) {
    console.log('Acción ejecutada:', action);
    
    switch (action.action_to_perform) {
      case 'view_orders':
        this.viewCustomerOrders(action.data);
        break;
      case 'contact_customer':
        this.contactCustomer(action.data);
        break;
      default:
        console.log('Acción no reconocida:', action.action_to_perform);
    }
  }

  // Método para ver pedidos del cliente
  private viewCustomerOrders(customer: CustomerOrderReport) {
    alert(`Ver pedidos de: ${customer.customer_name}\nTotal de pedidos: ${customer.orders}`);
    console.log('Ver pedidos de:', customer);
  }

  // Método para contactar al cliente
  private contactCustomer(customer: CustomerOrderReport) {
    alert(`Contactar a: ${customer.customer_name}\nEmail: ${customer.customer_email}`);
    console.log('Contactar cliente:', customer);
  }

  // Método para manejar acciones de botones personalizados
  onCustomAction(event: {action: string, data?: any}) {
    console.log('Acción personalizada ejecutada:', event);
    
    switch (event.action) {
      case 'refresh':
        this.refreshData();
        break;
      case 'send_email':
        this.sendEmailReport(event.data);
        break;
      case 'generate_report':
        this.generateCustomReport(event.data);
        break;
      case 'clear_filters':
        this.clearDateFilters();
        break;
      default:
        console.log('Acción personalizada no reconocida:', event.action);
    }
  }

  // Método para refrescar datos
  private refreshData() {
    console.log('Refrescando datos...');
    this.isLoading = true;
    
    // Simular un delay de carga
    setTimeout(() => {
      this.loadTableData();
      this.isLoading = false;
      console.log('Datos actualizados correctamente');
    }, 1000);
  }

  // Método para limpiar filtros de fecha
  private clearDateFilters() {
    console.log('Limpiando filtros de fecha...');
    this.selectedDateFilter = 'all';
    this.applyDateFilter();
  }

  // Método para manejar cambios en el filtro de fecha desde la interfaz
  onDateFilterChange(dateFilter: string) {
    console.log('Filtro de fecha cambiado desde la UI:', dateFilter);
    this.selectedDateFilter = dateFilter;
    this.applyDateFilter();
  }

  // Método para enviar reporte por email
  private sendEmailReport(data: any) {
    console.log('Enviando reporte por email...', data);
    alert(`Enviando reporte por email con ${data.length} registros`);
    // Aquí integrarías con tu servicio de email
  }

  // Método para generar reporte personalizado
  private generateCustomReport(data: any) {
    console.log('Generando reporte personalizado...', data);
    alert(`Generando reporte personalizado con ${data.length} registros`);
    // Aquí integrarías con tu servicio de reportes
  }
}
