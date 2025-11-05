import { Component } from '@angular/core';

import { StarRatingComponent } from "./widgets/star-rating/star-rating.component";
import { StarMsgRatingComponent } from "./widgets/star-msg-rating/star-msg-rating.component";
import { ResetRatingComponent } from "./widgets/reset-rating/reset-rating.component";
import { HorizontalRatingBarComponent } from "./widgets/horizontal-rating-bar/horizontal-rating-bar.component";
import { VerticalRatingBarComponent } from "./widgets/vertical-rating-bar/vertical-rating-bar.component";
import { CurrentRatingBarComponent } from "./widgets/current-rating-bar/current-rating-bar.component";
import { SquareRatingComponent } from "./widgets/square-rating/square-rating.component";
import { MovieRatingComponent } from "./widgets/movie-rating/movie-rating.component";

@Component({
  selector: 'app-rating',
  imports: [StarRatingComponent, StarMsgRatingComponent,
            ResetRatingComponent, HorizontalRatingBarComponent, VerticalRatingBarComponent,
            CurrentRatingBarComponent, SquareRatingComponent, MovieRatingComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})

export class RatingComponent {

}
