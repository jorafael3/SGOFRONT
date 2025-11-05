import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { PersonalDetailsComponent } from "./widgets/personal-details/personal-details.component";
import { YourEducationComponent } from "./widgets/your-education/your-education.component";
import { YourExperienceComponent } from "./widgets/your-experience/your-experience.component";
import { UploadFilesComponent } from "./widgets/upload-files/upload-files.component";

@Component({
  selector: 'app-apply-form',
  imports: [CommonModule, NgbRatingModule, PersonalDetailsComponent, 
    YourEducationComponent, YourExperienceComponent, UploadFilesComponent],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.scss'
})

export class ApplyFormComponent {

  constructor(public config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

}
