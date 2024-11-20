import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../../../../domain/models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PostUsuarioRegistroEdicionUseCase } from '../../../../../domain/usercase/usuarios/post-usuario-registro-edicion-use-case';
import { AlertasService } from '../../../services/alertas.service';
import { PostTokenUseCase } from '../../../../../domain/usercase/login/post-token-use-case';
import { v4 as uuid } from 'uuid';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertasComponent } from "../../alertas/alertas.component";
import { PostUsuarioBitacoraUseCase } from '../../../../../domain/usercase/registroBitacora/post-usuario-bitacora-use-case';


@Component({
  selector: 'app-agregar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AlertasComponent],
  templateUrl: './agregar-usuario.component.html',
  styleUrl: './agregar-usuario.component.css'
})
export class AgregarUsuarioComponent implements OnInit {

  //Obtiene la referencia del componente hijo
  @ViewChild('btnCloseModal', { static: true }) btnclosemodal!: ElementRef<HTMLButtonElement>;

  //Define una propiedad enviada por el componente padre
  @Input() titulo!: string;
  @Output() private textoEmitido = new EventEmitter<string>();


  //Variables Observables que obtendran los datos de las APis
  responseUsuarioRegistroEdicion$!: Observable<string>;
  response$Bitacora!: Observable<any>;
  response$Token!: Observable<any>;

  //Uso de servicio y definición de variables
  _postUsuarioRegistroEdicionUseCase = inject(PostUsuarioRegistroEdicionUseCase);
  _registraBitacora = inject(PostUsuarioBitacoraUseCase);
  _alertasService = inject(AlertasService);
  _postToken = inject(PostTokenUseCase);


  id: any;
  listaUsuario!: Usuario;
  usuarioForm!: FormGroup;
  datePipe = new DatePipe('en-US');
  dateToday: any;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {

    //Validación de campos en pantalla
    this.usuarioForm = this.formBuilder.group({
      'usuario': ["", Validators.required],
      'paterno': ["", Validators.required],
      'materno': ["", Validators.required],
      'nombre': ["", Validators.required],
    });
  }


  //Obtiene la referencia de cada componente dentro del formulario
  get f() { return this.usuarioForm.controls; }

  //Hace referencia al caso de uso registraEditaUsuario
  agregaUsuario() {

    this._alertasService.clear();

    if (this.usuarioForm.invalid) {
      //Mensaje de error
      return;
    }

    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);


    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {

        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Obtiene la fecha del día para registrar un nuevo  usuario
          this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');
          this.listaUsuario = {
            'identificador': 0, 'usuario': this.f['usuario'].value.trim(), 'paterno': this.f['paterno'].value, 'materno': this.f['materno'].value, 'nombre': this.f['nombre'].value,
            'sesionActiva': "N", 'usuarioBloqueado': "N", 'intentosFallidos': 0, 'usuarioRegistro': 1,
            'fechaRegistro': this.dateToday + 'Z', 'usuarioModifica': 1, 'fechaModifica': this.dateToday + 'Z'
          };

          //Consume api para el registro de usuarios
          this.responseUsuarioRegistroEdicion$ = this._postUsuarioRegistroEdicionUseCase.registraEditaUsuario(this.listaUsuario);
          this.responseUsuarioRegistroEdicion$.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200) {

                this.registroBitacora('agregaUsuario', 'Usuarios', 'Alta Usuario', 'Se agregó el usuario: ' + this.f['paterno'].value, 'C', 'Operación exitosa');
                this.textoEmitido.emit("Agregado");
                this.btnclosemodal.nativeElement.click();
                this.f['usuario'].setValue('');
                this.f['paterno'].setValue('');
                this.f['materno'].setValue('');
                this.f['nombre'].setValue('');
                
              } else {

                this.registroBitacora('agregaUsuario', 'Usuarios', 'Alta Usuario', 'No se agregó el usuario: ' + this.f['paterno'].value, 'I', 'Error en la operación');
                this._alertasService.warning('No se realizó el alta del Usuario');
              }

            }, error: (e) => {
              let error = e.error.errorMessageDTO;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error.message);
              this.registroBitacora('agregaUsuario', 'Usuarios', 'Alta Usuario', 'No se agregó el usuario: ' + this.f['paterno'].value, 'I', error.message);
            },
          })

        } else {
          this.registroBitacora('agregaUsuario', 'Usuarios', 'Generación de token', 'Para el servicio agregar usuario', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
        this.registroBitacora('agregaUsuario', 'Usuarios', 'Generación de token', 'Para el servicio agregar usuario', 'I', error.message);
      },
    })

  }

  //Guarda en bitácora todos los eventos de usuarios
  registroBitacora(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string) {

    this.response$Bitacora = this._registraBitacora.postUsuarioBitacoraData(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion);
    this.response$Bitacora.subscribe({
      next: (res: any) => {


      }, error: (e) => {
        let error = e.error;
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora(metodo, proceso, subproceso, detalleOperacion, 'I', error);
      }
    })

  }
}
