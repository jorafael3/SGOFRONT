import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { FacturacionService } from '../../../services/logistica/facturacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-series',
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './modificarseries.component.html',
  styleUrl: './modificarseries.component.scss'
})
export class ModificarSeriesComponent {
  public sessionData: any = null; // Datos de sesión del usuario actual

  public isLoading = false;

  // Datos de la factura
  facturaActual: any = null;
  detalleFactura: any[] = [];

  secuenciafactura: string = '';
  secuenciafacturatemp: string = '';
  MostrarDetalleFactura: boolean = false;

  constructor(private FacturacionService: FacturacionService) { }

  ngOnInit() {
    this.loadSessionData();
  }

  loadSessionData(): void {
    this.sessionData = this.FacturacionService.getUserSessionData();
    console.log('this.sessionData: ', this.sessionData);
  }

  onbuscarFactura() {
    if (!this.secuenciafactura || this.secuenciafactura.trim() === '') {
      Swal.fire("Error!", "Por favor ingrese una secuencia de factura", "warning");
      return;
    }
    if (this.secuenciafactura.trim() === "" && this.secuenciafacturatemp.trim() !== "") {
      this.secuenciafactura = this.secuenciafacturatemp;
    }
    this.isLoading = true;
    let param = {
      secuencia: this.secuenciafactura.trim(),
      usrid: this.sessionData ? this.sessionData.usrid : null
    };
    console.log('param: ', param);

    this.FacturacionService.GetFacturasModificarSeries(param).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        if (response.success && response.data && response.data.length > 0) {
          this.facturaActual = response.data[0];
          this.detalleFactura = response.detalle || [];
          this.MostrarDetalleFactura = true;
          this.secuenciafacturatemp = this.secuenciafactura;
        } else {
          Swal.fire("Error!", response.mensaje, "error");
          this.MostrarDetalleFactura = false;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log('error: ', error);
        Swal.fire("Error!", "Ocurrió un error al buscar la factura", "error");
        this.isLoading = false;
        this.MostrarDetalleFactura = false;
      }
    });
  }

  onCustomAction(event: { action: string, data?: any }) {
    switch (event.action) {
      case 'refresh':
        // Acción refresh - sin operación actualmente
        break;
      default:
    }
  }

  onVerDetalleProducto(item: any, index: number) {
    console.log('Producto seleccionado - Índice:', index);
    console.log('Detalles del producto:', item);

    if (item.serie.trim() == "") {
      Swal.fire("Atención!", "El producto seleccionado no tiene serie asignada.", "info");
      return;
    }

    

    this.FacturacionService.SetModificarSeries(item).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
        if (response.success) {

          Swal.fire("Exito", response.mensaje, "success");
          this.onbuscarFactura();

        } else {
          Swal.fire("Error!", response.mensaje, "error");
          // this.MostrarDetalleFactura = false;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log('error: ', error);
        Swal.fire("Error!", "Ocurrió un error al buscar la factura", "error");
        this.isLoading = false;
        // this.MostrarDetalleFactura = false;
      }
    });

  }

}
