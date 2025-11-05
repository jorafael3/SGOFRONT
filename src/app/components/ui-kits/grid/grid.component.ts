import { Component } from '@angular/core';

import { GridOptionsComponent } from "./widgets/grid-options/grid-options.component";
import { GridForColumnsComponent } from "./widgets/grid-for-columns/grid-for-columns.component";
import { FlexBehaviorsComponent } from "./widgets/flex-behaviors/flex-behaviors.component";
import { HorizontalGuttersComponent } from "./widgets/horizontal-gutters/horizontal-gutters.component";
import { VerticalGuttersComponent } from "./widgets/vertical-gutters/vertical-gutters.component";
import { RowColumnGuttersComponent } from "./widgets/row-column-gutters/row-column-gutters.component";
import { NoGuttersComponent } from "./widgets/no-gutters/no-gutters.component";
import { VerticalAlignmentComponent } from "./widgets/vertical-alignment/vertical-alignment.component";
import { HorizontalAlignmentComponent } from "./widgets/horizontal-alignment/horizontal-alignment.component";
import { NestingComponent } from "./widgets/nesting/nesting.component";
import { OrderComponent } from "./widgets/order/order.component";
import { OffsetComponent } from "./widgets/offset/offset.component";

@Component({
  selector: 'app-grid',
  imports: [GridOptionsComponent, GridForColumnsComponent, FlexBehaviorsComponent,
            HorizontalGuttersComponent, VerticalGuttersComponent, RowColumnGuttersComponent,
            NoGuttersComponent, VerticalAlignmentComponent, HorizontalAlignmentComponent,
            NestingComponent, OrderComponent, OffsetComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})

export class GridComponent {

}
