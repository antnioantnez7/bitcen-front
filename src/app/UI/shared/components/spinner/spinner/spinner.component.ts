import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `		<div id="pause" class="d-flex align-items-center justify-content-center">
  <div id="spinner"></div>
</div>`,
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

}
