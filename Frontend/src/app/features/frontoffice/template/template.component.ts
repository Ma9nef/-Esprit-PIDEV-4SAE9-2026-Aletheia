import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    FooterComponent
  ],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {

}
