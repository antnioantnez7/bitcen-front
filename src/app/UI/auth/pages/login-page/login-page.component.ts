import { ModalSesionComponent } from './../../../shared/components/modal/modal-sesion/modal-sesion.component';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertasService } from '../../../shared/services/alertas.service';
import { Observable } from 'rxjs';
import { AlertasComponent } from "../../../shared/components/alertas/alertas.component";
import { PostCredentialsUseCase } from '../../../../domain/usercase/login/post-encode-use-case';
import { PostLDAPUseCase } from '../../../../domain/usercase/login/post-ldap-use-case';
import { PostTokenUseCase } from '../../../../domain/usercase/login/post-token-use-case';
import { v4 as uuid } from 'uuid';
import { PostAccesoBitacoraUseCase } from '../../../../domain/usercase/registroBitacora/post-acceso-bitacora-use-case';
import { BitacoraAcceso } from '../../../../domain/models/bitacoraAcceso';
import { UsuarioService } from '../../../../infrastructure/driven-adapter/usuario.service';
import { Usuario } from '../../../../domain/models/usuario';
import { PostUsuarioRegistroEdicionUseCase } from '../../../../domain/usercase/usuarios/post-usuario-registro-edicion-use-case';
import { PostUsuariosConsultaUseCase } from '../../../../domain/usercase/usuarios/post-usuarios-consulta-use-case';
import { ModalRolesComponent } from "../../../shared/components/modal/modal-roles/modal-roles.component";
import { AgregarAplicacionComponent } from "../../../shared/components/modal/agregar-aplicacion/agregar-aplicacion.component";
import { PostUsuarioSesionUseCase } from '../../../../domain/usercase/login/post-usuario-sesion-use-case';
declare let $: any;

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [ReactiveFormsModule, CommonModule, AlertasComponent, ModalRolesComponent, AgregarAplicacionComponent,
    ModalSesionComponent]
})

export class LoginPageComponent implements OnInit {

  //Se suscribe al evento, para ejecutar el comportamiento.
  response$Encode!: Observable<any>;
  response$Ldap!: Observable<any>;
  response$Token!: Observable<any>;
  response$Bitacora!: Observable<any>;
  response$!: Observable<boolean>;
  responseUsuarioRegistroEdicion$!: Observable<string>;
  responseUsuarioConsulta$!: Observable<Usuario>;
  responseUsuarioSesion$!: Observable<string>;

  //Uso de servicio y definición de variables
  _alertasService = inject(AlertasService);
  _postEncodeUseCase = inject(PostCredentialsUseCase);
  _postLdapUseCase = inject(PostLDAPUseCase);
  _postToken = inject(PostTokenUseCase);
  _registraBitacora = inject(PostAccesoBitacoraUseCase);
  _authService = inject(UsuarioService);
  _postUsuarioRegistroEdicionUseCase = inject(PostUsuarioRegistroEdicionUseCase);
  _postUsariosConsultaUseCase = inject(PostUsuariosConsultaUseCase);
  _postUsuarioSesionUseCase = inject(PostUsuarioSesionUseCase);

  submitted: boolean = false;
  error: any = {};
  accesos!: BitacoraAcceso;
  dataUser: any;
  perfil: string = "";
  dateToday: any;
  datePipe = new DatePipe('en-US');
  identificador: string = "";
  sesion: string = "";

  listaUsuario!: Usuario;
  listaUsuarios: Usuario[] = [];
  userRoles: string[] = [];
  tituloModalRol: string = "Seleccionar Rol";
  tituloModalSesion: string = "Acceso denegado"
  contenido: string = "Usted ya tiene una sesión activa";
  contenidoSesion: string = "Usted ya tiene una sesión activa."
  buttonPrimary: string = "Aceptar";
  loginForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    //Define la colección de controles del formulario
    this.loginForm = this.formBuilder.group({
      'usuario': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  //Obtiene la referencia de cada componente dentro del formulario
  get f() { return this.loginForm.controls; }

  //Evento del botón ENVIAR para hacer uso del método login
  //Envia valores de email y password.
  onSubmit() {
    this._alertasService.clear();

    if (this.loginForm.invalid) {
      //Mensaje de error
      this._alertasService.danger('Favor de ingresar todos los campos');
      return;
    } else {

      sessionStorage.setItem('usuario', this.f['usuario'].value);
      sessionStorage.setItem('password', this.f['password'].value);
    }
    //Encripta los valores de usuario y password.
    this.response$Encode = this._postEncodeUseCase.postEncode();
    this.response$Encode.subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {

          let data = res.dataDTO;
          let encode = data.data;
          sessionStorage.setItem('encode', encode);

          //Crea el número de transacción para validar el token
          let transaccion = uuid();
          sessionStorage.setItem('transaccion', transaccion);

          //Verifica el el usuario está activo en LDAP
          this.response$Ldap = this._postLdapUseCase.postloginUserLDAP();
          this.response$Ldap.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200 && res.ldapDTO != null) {

                let data = res.ldapDTO;
                sessionStorage.setItem('dataLDAP', JSON.stringify(data));
                let activo = data.activo;

                if (activo == 1) {

                  this.validaUsuarioBitacora(this.f['usuario'].value);

                } else {

                  //Registra el acceso del usuario en la Bitácora
                  this.registroBitacora('Login', 'Ingreso al sistema', 'I', 'Usuario deshabilitado en Directorio Activo');
                  this._alertasService.danger('Usuario deshabilitado en Directorio Activo');
                }
              } else {

                //Registra el acceso del usuario en la Bitácora
                this.registroBitacora('Login', 'Ingreso al sistema', 'I', 'Error en el acceso del usuario');
                this._alertasService.danger('Error en el acceso del usuario');
                this.clearControl();
              }
            }, error: (e) => {
              let error = e.error
              let mensaje = error.errorMessageDTO;

              this._alertasService.clear();
              this._alertasService.danger(mensaje.message + " " + "Favor de contactar a la mesa de servicios de BANOBRAS Extensión: 3000");
              //Registra el acceso del usuario en la Bitácora
              this.registroBitacora('Login', 'Ingreso al sistema', 'I', mensaje.message);
            },
          })
        }
        else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('Login', 'Ingreso al sistema', 'I', 'Las credenciales no han podido ser encriptadas');
          this._alertasService.danger('Las credenciales no han podido ser encriptadas');
          this.clearControl();
        }
      }, error: (e) => {
        this._alertasService.clear();
        this._alertasService.danger('Usuario y/o contraseña incorrecto.');
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('Login', 'Ingreso al sistema', 'I', "Error en la petición para encriptar las credenciales ");
      },
    });
  }

  //Limpia los input del form
  clearControl() {
    this.loginForm.setValue({
      usuario: '',
      password: ''
    });
  }

  //Valida si el usuario existe en la aplicación de Bitácoras
  validaUsuarioBitacora(usuario: string) {

    this._alertasService.clear();
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

          this.listaUsuario = {
            'identificador': 0, 'usuario': usuario, 'paterno': "", 'materno': "", 'nombre': "",
            'sesionActiva': "", 'usuarioBloqueado': "", 'intentosFallidos': 0, 'usuarioRegistro': 0,
            'fechaRegistro': "", 'usuarioModifica': 0, 'fechaModifica': ""
          };

          //Consume api para la consulta de usuarios
          this.responseUsuarioConsulta$ = this._postUsariosConsultaUseCase.consultaUsuarios(this.listaUsuario);
          this.responseUsuarioConsulta$.subscribe({
            next: (res: any) => {
              if ((res.contenido).length > 0) {

                this.listaUsuarios = res.contenido;
                this.identificador = this.listaUsuarios[0].identificador.toString();
                this.sesion = this.listaUsuarios[0].sesionActiva.toString();
                sessionStorage.setItem('identificador', this.identificador);

                if (this.sesion == "N") {

                  this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
                  let cadena: Array<string> = this.dataUser.grupoAplicativoPerfil;
                  this.userRoles = [];

                  cadena.forEach(element => {
                    this.perfil = element.split("_")[1];
                    this.userRoles.push(this.perfil)
                  });

                  if (this.userRoles.length > 1) {

                    $("#id01").trigger("click");

                  } else {
                    sessionStorage.setItem('perfil', this.userRoles[0]);
                    this.guardaSesionActiva(Number(this.identificador), "S");
                  }
                } else {
                  $("#id02").trigger("click");
                  this.registroBitacora('Login', 'Valida sesión', 'I', 'Operación incorrecta');

                }

              } else {
                //Registra la consulta no exitosa de Usuarios en bitácora
                this.registroBitacora('Login', 'Valida usuario', 'I', 'Error en la operación');
                this._alertasService.warning('El usuario no existe en Bitácora Centralizada, favor de comunicarse con el Administrador');
              }
            }, error: (e) => {
              let error = e.message;
              this._alertasService.clear();
              this._alertasService.danger('Estatus: ' + error + " " + "favor de contactar a la mesa de servicios de BANOBRAS Extensión 3000");
              //Registra el error en la consulta de usuarios
              this.registroBitacora('Login', 'Valida usuario', 'I', error);
            },
          })

        } else {
          //Registra el error al generar el token
          this.registroBitacora('Login', 'Generación de token', 'I', 'Error en la operación');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.message;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error);
        //Regitra el error al generar el token
        this.registroBitacora('Login', 'Generación de token', 'I', error);
      },
    })
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
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('Login', 'Guarda sesión', 'I', error);
            },
          })

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('Login', 'Guarda sesión', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
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
