import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, TableClickedAction, CustomButton } from '../../../../shared/interface/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OpParametrosService } from '../../../../services/financiero/opParametros.service';

@Component({
  selector: 'app-parametros',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent {
  public fechaVencimiento = 0;


  constructor(private OpcionesService: OpParametrosService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
  }



}