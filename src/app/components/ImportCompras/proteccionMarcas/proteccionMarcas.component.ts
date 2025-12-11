import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CrearActComponent } from './crearAct/crearact.component';
import { ListActComponent } from './listAct/listact.component';

type TabId = 'crear' | 'listar' | 'otra';

interface Tab {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-proteccion-marcas',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TableComponent,
    CrearActComponent,
    ListActComponent
  ],
  templateUrl: './proteccionMarcas.component.html',
  styleUrl: './proteccionMarcas.component.scss'
})
export class ProteccionMarcasComponent {
  tabs: Tab[] = [
    { id: 'crear',  label: 'Nueva Actividad' },
    { id: 'listar',  label: 'Procesar Actividades' },
    { id: 'otra',         label: 'Que otra opción' },
  ];
  activeTab: TabId = 'crear';
  
  setTab(tab: TabId) {
    this.activeTab = tab;
  }

}