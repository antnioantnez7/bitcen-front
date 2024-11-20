import { AfterViewInit, Directive, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appDatePickerEnd]',
  standalone: true
})
export class DatePickerEndDirective implements AfterViewInit, OnInit {

  //Define una propiedad enviada por el componente padre
  @Output() dateEventEmitter = new EventEmitter<any>();
  mydate: any;

  constructor(private readonly el: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  //Directiva para el manejo del calendario: fecha fin
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
