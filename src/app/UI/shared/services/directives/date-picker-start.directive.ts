import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, NgZone, Output } from '@angular/core';
declare let $: any;

@Directive({
  selector: '[appDatePickerStart]',
  standalone: true,
  exportAs: 'datepicker',
})
export class DatePickerDirectiveStart implements AfterViewInit {


  @Output() dateEventEmitter = new EventEmitter<any>();
  mydate: any;

  constructor(private readonly el: ElementRef, private ngZone: NgZone) {
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

  }

  //Directiva para el manejo del calendario: fecha inicio
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      $(this.el.nativeElement).datepicker({
        onSelect: (date: any) => {
          this.ngZone.run(() => {
            this.setDate(date);
          });
        }
      });
    });
  }

  setDate(date: any) {
    this.mydate = date;
    this.dateEventEmitter.emit(this.mydate);
  }

}
