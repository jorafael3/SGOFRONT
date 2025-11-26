import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BancoService } from '../../../services/financiero/banco.service';
import { ObligacionesComponent } from './obligaciones/obligaciones.component';
import { ParametrosComponent } from './parametros/parametros.component';

type TabId = 'obligaciones' | 'parametros' | 'otra';

interface Tab {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-opciones-bancarias',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TableComponent,
    ObligacionesComponent,
    ParametrosComponent
  ],
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.scss'
})
export class OpcionesBancariasComponent {
  tabs: Tab[] = [
    { id: 'obligaciones',  label: 'Obligaciones' },
    { id: 'parametros',  label: 'Parámetros' },
    { id: 'otra',         label: 'Que otra opción' },
  ];
  activeTab: TabId = 'parametros';
  
  setTab(tab: TabId) {
    this.activeTab = tab;
  }

}