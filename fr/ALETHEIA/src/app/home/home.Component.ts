import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.Component.html',
    standalone: true,
  imports: [RouterModule],
  styleUrls: ['./home.Component.css'], // <-- 'styleUrls' au pluriel
})
export class Home {}
