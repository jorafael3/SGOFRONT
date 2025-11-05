import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchResultsComponent } from "./search-results/search-results.component";
import { SocialAppPhotosComponent } from "../social-app/widgets/social-app-photos/social-app-photos.component";
import { SearchResultVideoComponent } from "./search-result-video/search-result-video.component";
import { SearchResultAudioComponent } from "./search-result-audio/search-result-audio.component";
import { SearchResultSettingComponent } from "./search-result-setting/search-result-setting.component";
import { searchResultTab } from '../../shared/data/search-result';

@Component({
  selector: 'app-search-result',
  imports: [NgbNavModule, SearchResultsComponent, SocialAppPhotosComponent, 
           SearchResultVideoComponent, SearchResultAudioComponent, SearchResultSettingComponent],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss'
})

export class SearchResultComponent {

  public searchResultTab = searchResultTab;
  public active: string = 'all';

}
