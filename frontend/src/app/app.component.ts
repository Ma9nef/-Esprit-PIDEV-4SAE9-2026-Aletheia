import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aletheia-frontEnd';

  constructor(private themeService: ThemeService) {
    this.themeService.init();
  }
}
