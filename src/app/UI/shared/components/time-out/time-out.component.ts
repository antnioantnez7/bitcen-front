import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../../infrastructure/driven-adapter/usuario.service';
import { v4 as uuid } from 'uuid';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { PostTokenUseCase } from '../../../../domain/usercase/login/post-token-use-case';
import { PostUsuarioSesionUseCase } from '../../../../domain/usercase/login/post-usuario-sesion-use-case';
import { PostAccesoBitacoraUseCase } from '../../../../domain/usercase/registroBitacora/post-acceso-bitacora-use-case';




declare let $: any;

@Component({
  selector: 'app-time-out',
  standalone: true,
  imports: [],
  templateUrl: './time-out.component.html',
  styleUrl: './time-out.component.css'
})
export class TimeOutComponent {

  //Definición de variables
  @ViewChild('myModal') myModal!: ElementRef;
  listeningMouse!: boolean;
  idTimeOut: any;
  idSetInterval: any;
  checador: any;
  saliendo: boolean = false;
  progressValue: any;

  dateToday: any;
  datePipe = new DatePipe('en-US');

  response$Token!: Observable<any>;
  responseUsuarioSesion$!: Observable<string>;
  response$Bitacora!: Observable<any>;

  usuarioService: UsuarioService = inject(UsuarioService);
  _postToken = inject(PostTokenUseCase);
  _postUsuarioSesionUseCase = inject(PostUsuarioSesionUseCase);
  _registraBitacora = inject(PostAccesoBitacoraUseCase);

  //Escucha los eventos
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keydown', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:mousewheel', ['$event'])


  //Método que recibe el evento y comienza el conteo
  onActivity(event: Event): void {
    this.listeningMouse = true;

    if (event) {
      clearTimeout(this.checador);
      this.checador = setTimeout(() => {
        // ? Mostrando modal de logout
        if (!this.saliendo) {
          this.decrementando();
        }
      }, 100000);
    }

  }


  //Barra de avance
  decrementando(): void {
    this.saliendo = true;
    this.progressValue = 100;
    $(this.myModal.nativeElement).modal('show');
    this.idSetInterval = setInterval(() => {
      this.progressValue = this.progressValue - 10;
      if (this.progressValue <= 0) {
        clearInterval(this.idSetInterval);
        $(this.myModal.nativeElement).modal('hide');
        this.progressValue = 0;
        alert('Su sesión ha expirado');
        this.cierraSesionActiva(Number(sessionStorage.getItem('identificador')), "N");
      }
    }, 1000);
  }

  //Reinicia el contador
  mantenerSesion(): void {
    clearInterval(this.idSetInterval);
    this.saliendo = false;
    $(this.myModal.nativeElement).modal('hide');
  }

  //Destruye los intervalos
  ngOnDestroy() {
    this.listeningMouse = false;
    clearInterval(this.idSetInterval);
    clearInterval(this.idTimeOut);
    clearTimeout(this.checador);

  }

  //Guarda la sesión activa del usuario
  cierraSesionActiva(identificador: number, sesion: string) {

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
                this.registroBitacora('Login', 'Guarda sesión', 'C', 'Operación exitosa');
                this.usuarioService.logout();
                //Registra la consulta de operaciones en  la bitácora

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

  //Guarda en bitácora cuando recupera el token válido
  registroBitacora(metodo: string, actividad: string, estatusOperacion: string, respuestaOperacion: string) {
    this.response$Bitacora = this._registraBitacora.postAccesoBitacoraData(metodo, actividad, estatusOperacion, respuestaOperacion);
    this.response$Bitacora.subscribe({
      next: (res: any) => {

      }, error: (e) => {
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('Login', 'Ingreso al sistema', 'I', 'Error al registrar en Bitácora Centralizada, el Acceso al Sistema');
      }
    })

  }
}
