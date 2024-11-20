import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./UI/shared/components/header/header.component";
import { NavbarComponent } from "./UI/shared/components/navbar/navbar.component";
import { FooterComponent } from "./UI/shared/components/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
`,
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent, FooterComponent]
})
export class AppComponent {
  title = 'BITÁCORA';


  constructor() {}

}
