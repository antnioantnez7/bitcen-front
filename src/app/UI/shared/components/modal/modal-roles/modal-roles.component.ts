import { CommonModule, DatePipe } from "@angular/common";
import { Component, ElementRef, Input, ViewChild, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { v4 as uuid } from 'uuid';
import { PostTokenUseCase } from "../../../../../domain/usercase/login/post-token-use-case";
import { PostUsuarioSesionUseCase } from "../../../../../domain/usercase/login/post-usuario-sesion-use-case";
import { UsuarioService } from "../../../../../infrastructure/driven-adapter/usuario.service";
import { Router } from "@angular/router";
import { PostAccesoBitacoraUseCase } from "../../../../../domain/usercase/registroBitacora/post-acceso-bitacora-use-case";


@Component({
  selector: 'app-modal-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modal-roles.component.html',
  styleUrl: './modal-roles.component.css'
})
export class ModalRolesComponent {

  //Obtiene la referencia del componente hijo
  @ViewChild('btnCloseModal', { static: true }) btnclosemodal!: ElementRef<HTMLButtonElement>;

  //Define una propiedad enviada por el componente padre
  @Input() titulo!: any;
  @Input() rolesUsuario!: any;
  @Input() id!: any;

  //Variables Observables que obtendran los datos de las APis
  response$Token!: Observable<any>;
  response$Bitacora!: Observable<any>;
  responseUsuarioSesion$!: Observable<string>;

  //Uso de servicio y definición de variables
  _postToken = inject(PostTokenUseCase);
  _postUsuarioSesionUseCase = inject(PostUsuarioSesionUseCase);
  _authService = inject(UsuarioService);
  _registraBitacora = inject(PostAccesoBitacoraUseCase);

  rolForm: FormGroup;
  dateToday: any;
  datePipe = new DatePipe('en-US');

  constructor(private router: Router) {
    this.rolForm = new FormGroup({
      aplicacion: new FormControl(null, [Validators.required]),
    })

  }

  //Obtiene el valor del combo
  onRolChanged(rol: string) {
    sessionStorage.setItem('perfil', rol);
  }

  //Selecciona el valor del combo
  seleccionarRol() {
    this.btnclosemodal.nativeElement.click();
    this.guardaSesionActiva(Number(sessionStorage.getItem('identificador')), "S");
  }

  //Guarda la sesión activa del usuario
  guardaSesionActiva(identificador: number, sesion: string) {

    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);

    //Obtiene la fecha del día para editar un nuevo  usuario
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');

    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {

        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Consume api para editar el usuario
          this.responseUsuarioSesion$ = this._postUsuarioSesionUseCase.sesionUsuario(identificador, sesion, this.dateToday + 'Z', this.dateToday + 'Z');
          this.responseUsuarioSesion$.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200) {


                this._authService.login();
                this.router.navigate(['/bitacora']);

                //Registra la consulta de operaciones en  la bitácora
                this.registroBitacora('Login', 'Guarda sesión', 'C', 'Operación exitosa');
              } else {

                this.registroBitacora('Login', 'Guarda sesión', 'I', 'Error en la operación');
              }

            }, error: (e) => {
              let error = e.message;
              //Registra el error en la consulta de usuarios
              this.registroBitacora('Login', 'Guarda sesión', 'I', error);
            },
          })

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('Login', 'Guarda sesión', 'I', 'El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('Login', 'Guarda sesión', 'I', error.message);
      },
    })
  }

  //Guarda en bitácora
  registroBitacora(metodo: string, actividad: string, estatusOperacion: string, respuestaOperacion: string) {
    this.response$Bitacora = this._registraBitacora.postAccesoBitacoraData(metodo, actividad, estatusOperacion, respuestaOperacion.slice(0, 100));
    this.response$Bitacora.subscribe({
      next: (res: any) => {

      }, error: (e) => {
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('Login', 'Ingreso al sistema', 'I', 'Error al registrar en Bitácora Centralizada, el Acceso al Sistema');
      }
    })
  }
}
