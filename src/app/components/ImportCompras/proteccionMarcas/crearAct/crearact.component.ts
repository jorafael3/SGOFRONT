import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MarcaCrearActService } from '../../../../services/importacionCompras/marcaCrearAct.service';

interface Marca {
  ID: string;
  Nombre: string;
}

@Component({
  selector: 'app-crearact',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './crearact.component.html',
  styleUrl: './crearact.component.scss'
})
export class CrearActComponent {
  public marca: Marca | null = null;
  public tipos: any[] = [];
  public marcas: any[] = [];
  public maxDate: string = '';

  modoCheck: 'marca' | 'proveedor' = 'marca';

  form = {
    tipo: '',
    marca: {} as Marca | null,
    referencia: '',
    fecha: '',
    periodo: '',
    concepto: '',
    valor: 0,
    fechaActividad: '',
    check_marca: this.modoCheck === 'marca' ? 0 : 1,
  };

  constructor(private service: MarcaCrearActService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.Cargar_Tipos_Marcas();
    this.Cargar_Marcas();
  }

  onCheckMarcaChange(): void {
    this.Cargar_Marcas();
  }

  private mostrarAlerta(fieldName: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: `El campo "${fieldName}" es obligatorio.`,
      confirmButtonText: 'Aceptar'
    });
  }

  Guardar_datos() {
    const isValueInvalid = (value: string | number | null | undefined): boolean => {
      return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    };
    if (isValueInvalid(this.form.fechaActividad)) {
      this.mostrarAlerta('Fecha de Actividad');
      return;
    }
    if (isValueInvalid(this.form.tipo)) {
      this.mostrarAlerta('Tipo');
      return;
    }
    if (isValueInvalid(this.form.marca?.ID)) {
      const fieldName = this.modoCheck === 'marca' ? 'Marca' : 'Proveedor';
      this.mostrarAlerta(fieldName);
      return;
    }
    if (isValueInvalid(this.form.referencia)) {
      this.mostrarAlerta('Referencia');
      return;
    }
    if (isValueInvalid(this.form.periodo)) {
      this.mostrarAlerta('Periodo');
      return;
    }
    if (this.form.valor === null || this.form.valor <= 0) {
      this.mostrarAlerta('Valor');
      return;
    }
    if (isValueInvalid(this.form.concepto)) {
      this.mostrarAlerta('Concepto');
      return;
    }
    const param = {
      Tipo: this.form.tipo,
      MarcaID: this.form.marca?.ID,
      MarcaNombre: this.form.marca?.Nombre,
      Referencia: this.form.referencia,
      Periodo: this.form.periodo,
      Concepto: this.form.concepto,
      valor: this.form.valor,
      Fecha_actividad: this.form.fechaActividad,
      Cheek_marca: this.form.check_marca
    }
    // console.log(param);
    // return;
    this.service.Guardar_datos(param).subscribe({
      next: (res: any) => {
        console.log(res)
        if (!res.success) { Swal.fire('Error', 'No se pudo guardar la actividad', 'error'); return; }
        Swal.fire('Éxito', 'Actividad guardada correctamente', 'success');
        this.Limpiar_campos();
      }
    });
  }

  Limpiar_campos(): void {
    this.form = {
      tipo: '',
      marca: null,
      referencia: '',
      fecha: '',
      periodo: '',
      concepto: '',
      valor: 0,
      fechaActividad: '',
      check_marca: this.modoCheck === 'marca' ? 0 : 1,
    };
    this.cdr.detectChanges();
  }

  Cargar_Tipos_Marcas() {
    this.service.Cargar_Tipos_Marcas().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.tipos = res.data;
      }
    });
  }

  Cargar_Marcas() {
    const params = {
      marca: this.modoCheck === 'marca' ? 0 : 1
    };
    this.service.Cargar_Marcas(params).subscribe({
      next: (res: any) => {
        if (!res.success) return;
        this.marcas = res.data;
      }
    });
  }

}