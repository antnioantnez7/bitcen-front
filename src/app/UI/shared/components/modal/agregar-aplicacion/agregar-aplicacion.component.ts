import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Aplicacion } from '../../../../../domain/models/aplicacion';
import { PostAplicacionesRegistroUseCase } from '../../../../../domain/usercase/aplicaciones/post-aplicaciones-registro-use-case';
import { AlertasService } from '../../../services/alertas.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertasComponent } from "../../alertas/alertas.component";
import { v4 as uuid } from 'uuid';
import { PostTokenUseCase } from '../../../../../domain/usercase/login/post-token-use-case';
import { PostOperacionBitacoraUseCase } from '../../../../../domain/usercase/registroBitacora/post-operacion-bitacora-use-case';

@Component({
  selector: 'app-agregar-aplicacion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AlertasComponent],
  templateUrl: './agregar-aplicacion.component.html',
  styleUrl: './agregar-aplicacion.component.css'
})
export class AgregarAplicacionComponent implements OnInit {

  //Obtiene la referencia del componente hijo
  @ViewChild('btnCloseModal', { static: true }) btnclosemodal!: ElementRef<HTMLButtonElement>;

  //Define una propiedad enviada por el componente padre
  @Input() titulo!: string;
  @Input() alias!: string;
  @Input() nombreCompleto!: string;
  @Output() private textoEmitido = new EventEmitter<string>();

  //Variables Observables que obtendran los datos de las APis
  responseAplicacionRegistro$!: Observable<string>;
  response$Bitacora!: Observable<any>;
  response$Token!: Observable<any>;

  //Uso de servicio y definición de variables
  _postAplicacionesRegistroUseCase = inject(PostAplicacionesRegistroUseCase);
  _registraBitacora = inject(PostOperacionBitacoraUseCase);
  _alertasService = inject(AlertasService);
  _postToken = inject(PostTokenUseCase);

  id: any;
  listaAplicaciones!: Aplicacion;
  aplicacionForm!: FormGroup;
  datePipe = new DatePipe('en-US');
  dateToday: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //Validación de campos en pantalla
    this.aplicacionForm = this.formBuilder.group({
      'alias': ["", Validators.required],
      'nombreCompleto': ["", Validators.required],
    });
  }


  //Obtiene la referencia de cada componente dentro del formulario
  get f() { return this.aplicacionForm.controls; }

  //Hace referencia al caso de uso registraAplicaciones
  agregaAplicacion() {

    this._alertasService.clear();

    if (this.aplicacionForm.invalid) {
      //Mensaje de error
      return;
    }

    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);

    //Obtiene la fecha del día para registrar un nuevo  usuario
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');
    this.listaAplicaciones = { 'aplicativoId': this.f['alias'].value.trim(), 'nombre': this.f['nombreCompleto'].value, 'usuarioRegistro': 1, 'fechaRegistro': this.dateToday + 'Z', 'usuarioModifica': 1, 'fechaModifica': this.dateToday + 'Z' };

    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {

        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Consume api para el registro de aplicaciones
          this.responseAplicacionRegistro$ = this._postAplicacionesRegistroUseCase.registraAplicaciones(this.listaAplicaciones);
          this.responseAplicacionRegistro$.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200) {

                this.registroBitacora('agregaAplicacion', 'Catálogo de Aplicaciones', 'Alta de aplicación', 'Se agregó la aplicación: ' + this.f['alias'].value, 'C', 'Operación exitosa');
                this.textoEmitido.emit("Agregado");
                this.btnclosemodal.nativeElement.click();
                this.f['alias'].setValue('');
                this.f['nombreCompleto'].setValue('');

              } else {

                this.registroBitacora('agregaAplicacion', 'Catálogo de Aplicaciones', 'Alta de aplicación', 'No se agregó la aplicación: ' + this.f['alias'].value, 'I', 'No se realizó el alta');
                this._alertasService.warning('No se realizó el alta de la aplicación');
              }

            }, error: (e) => {
              let error = e.error.errorMessageDTO;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error.message);
              this.registroBitacora('agregaAplicacion', 'Catálogo de Aplicaciones', 'Alta de aplicación', 'No se agregó la aplicación: ' + this.f['alias'].value, 'I', error.message);
            },
          })

        } else {
          this.registroBitacora('onSubmit', 'Generación de token', 'Catálogo de Aplicaciones', '', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
        this.registroBitacora('onSubmit', 'Generación de token', 'Catálogo de Aplicaciones', '', 'I', error.message);
      },
    })

  }

  //Guarda en bitácora todos los eventos de operación
  registroBitacora(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string) {

    this.response$Bitacora = this._registraBitacora.postOperacionBitacoraData(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion);
    this.response$Bitacora.subscribe({
      next: (res: any) => {

      }, error: (e) => {
        let error = e.error;
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('RegistroBitacora', 'Agregar Aplicacion', 'Catálogo de Aplicaciones', '', 'I', error);
      }
    })

  }
}

