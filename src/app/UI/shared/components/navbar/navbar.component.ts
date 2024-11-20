import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from './../../../../infrastructure/driven-adapter/usuario.service';
import { HeaderComponent } from "../header/header.component";
import { NavItem } from '../../../../domain/models/menu';
import { DatosMenuService } from '../../../../infrastructure/driven-adapter/datos-menu.service';
import { AlertasService } from '../../services/alertas.service';
import { Observable } from 'rxjs';
import { ModalWarningComponent } from "../modal/modal-warning/modal-warning.component";
import { v4 as uuid } from 'uuid';
import { PostTokenUseCase } from '../../../../domain/usercase/login/post-token-use-case';
import { PostUsuarioSesionUseCase } from '../../../../domain/usercase/login/post-usuario-sesion-use-case';
import { PostAccesoBitacoraUseCase } from '../../../../domain/usercase/registroBitacora/post-acceso-bitacora-use-case';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [CommonModule, RouterModule, NavbarComponent, HeaderComponent, ModalWarningComponent]
})
export class NavbarComponent {

  //Define un observable para mostrar el menú, sólo en el caso
  //de que el usuario se haya logueado
  isLoggedIn$!: Observable<boolean>;
  currentUser$!: Observable<string>;
  response$Token!: Observable<any>;
  responseUsuarioSesion$!: Observable<string>;
  response$Bitacora!: Observable<any>;

  titulo: string = "Cerrar sesión";
  contenido: string = "¿Está seguro que desea salir de Bitácora Centralizada ";
  dataUser: any;
  iniciales: string = "";
  nombre: string = "";
  perfil: string = "";
  usuario: string = "";
  dateToday: any;
  datePipe = new DatePipe('en-US');

  buttonPrimary: string = "Salir";
  buttonSecondary: string = "Cancelar";

  //Uso de servicio y definición de variables
  menuList: NavItem[] = [];
  datosMenuService: DatosMenuService = inject(DatosMenuService);
  usuarioService: UsuarioService = inject(UsuarioService);
  _postToken = inject(PostTokenUseCase);
  _postUsuarioSesionUseCase = inject(PostUsuarioSesionUseCase);
  _registraBitacora = inject(PostAccesoBitacoraUseCase);

  //Obtiene los datos que se muestran en el menú
  constructor(private alertaService: AlertasService) {
    this.menuList = this.datosMenuService.getvaloresMenu();
  }

  //Obtiene el valor de Logueo a través del observable
  ngOnInit() {

    this.validaLogueo();

    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
    this.currentUser$ = this.usuarioService.isUser.pipe();

  }

  //Valida logueo
  async validaLogueo() {
    let respuesta;
    this.usuarioService.isLoggedIn.pipe().subscribe((response: any) => {
      respuesta = response;

      if (respuesta) {

        this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
        this.perfil = sessionStorage.getItem('perfil')!;

        this.usuario = this.dataUser.usuario;
        this.iniciales = (this.usuario.slice(0, 2)).toUpperCase();
        this.nombre = this.dataUser.nombre;

      }
    }); return respuesta;
  }

  //Sale a la pantalla de Login
  onLogout(flagAction: boolean) {
    try {
      if (flagAction) {
        this.cierraSesionActiva(Number(sessionStorage.getItem('identificador')), "N");
      }
    } catch (error: any) {
      this.alertaService.danger(error);
    }
  }

  gotoroute(route: string) {
    console.log("");
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
