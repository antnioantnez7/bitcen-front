import { PostUsuarioBitacoraUseCase } from './../../../domain/usercase/registroBitacora/post-usuario-bitacora-use-case';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { AlertasComponent } from "../../shared/components/alertas/alertas.component";
import { PaginacionComponent } from '../../shared/components/paginacion/paginacion.component';
import { Usuario } from '../../../domain/models/usuario';
import { Observable } from 'rxjs';
import { AlertasService } from '../../shared/services/alertas.service';
import { PostTokenUseCase } from '../../../domain/usercase/login/post-token-use-case';
import { PostUsuariosConsultaUseCase } from '../../../domain/usercase/usuarios/post-usuarios-consulta-use-case';
import { DeleteUsuarioUseCase } from '../../../domain/usercase/usuarios/delete-usuario-use-case';
import { v4 as uuid } from 'uuid';
import { PostUsuarioRegistroEdicionUseCase } from '../../../domain/usercase/usuarios/post-usuario-registro-edicion-use-case';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchPipe } from '../../shared/services/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { TimeOutComponent } from '../../shared/components/time-out/time-out.component';
import { ModalEliminaAplicacionComponent } from "../../shared/components/modal/modal-elimina-aplicacion/modal-elimina-aplicacion.component";
import { AgregarUsuarioComponent } from "../../shared/components/modal/agregar-usuario/agregar-usuario.component";
import { SpinnerComponent } from "../../shared/components/spinner/spinner/spinner.component";
declare let $: any;
import { NgxPaginationModule } from 'ngx-pagination';
import { NgToggleModule } from 'ng-toggle-button';

@Component({
  selector: 'app-catalogo-usuarios',
  standalone: true,
  imports: [CommonModule, PaginacionComponent, SearchPipe, FormsModule, AlertasComponent, TimeOutComponent,
    BreadcrumbComponent, ModalEliminaAplicacionComponent, AgregarUsuarioComponent, SpinnerComponent, NgxPaginationModule,
    NgToggleModule],
  templateUrl: './catalogo-usuarios.component.html',
  styleUrl: './catalogo-usuarios.component.css'
})
export class CatalogoUsuariosComponent implements OnInit, AfterViewInit {

  //Obtiene la referencia del componente hijo
  @ViewChild('paginaUsuarios') paginaUsuarios!: PaginacionComponent;
  @ViewChild('toggle') toggleSesion!: NgToggleModule;

  //Se suscribe al evento, para ejecutar el comportamiento
  response$Token!: Observable<any>;
  responseUsuarioConsulta$!: Observable<Usuario>;
  responseUsuarioEliminar!: Observable<string>;
  responseUsuarioRegistroEdicion$!: Observable<string>;
  response$Bitacora!: Observable<any>;

  //Uso de servicio y definición de variables
  _alertasService = inject(AlertasService);
  _postToken = inject(PostTokenUseCase);
  _postUsariosConsultaUseCase = inject(PostUsuariosConsultaUseCase);
  _registraBitacora = inject(PostUsuarioBitacoraUseCase);
  _postUsuarioRegistroEdicionUseCase = inject(PostUsuarioRegistroEdicionUseCase);
  _deleteUsuarioUseCase = inject(DeleteUsuarioUseCase);

  tituloAgregar: string = "Agregar Usuario";
  tituloEliminar: string = "Eliminar";
  listaUsuarios: Usuario[] = [];
  listaUsuario!: Usuario;

  //Valores de paginación de la tabla
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages = 0;
  pages: number[] = [];
  valueChange: any;

  //Busqueda en tabla
  searchText = "";
  modalRow: any;

  //Ordenamiento de la tabla
  sortColumn: string = '';
  sortAscending: boolean = true;

  buttonPrimary: string = "";
  buttonSecondary: string = "Cancelar";
  contenido: string = "";
  usuario: string = "";
  identificador!: number;
  editable: boolean = false;
  edit: boolean = true;
  condicion = true;
  isLoading = true;
  datePipe = new DatePipe('en-US');
  dateToday: any;
  rol: string = "";
  isDisabled: boolean = false;

  constructor() { }

  //Consulta el catálogo de Aplicaciones para mostrar en la tabla
  //Obtiene el perfil de usuario para manejo de permisos en la página
  ngOnInit(): void {
    this.consultaUsuarios();
    this.isLoading = false;
    this.rol = sessionStorage.getItem('perfil')!;

    if (this.rol == 'ADMINISTRADOR' || this.rol == 'ADMIN') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }


  //Activa el uso de tooltips
  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  //Paginación de la tabla de Aplicaciones
  get paginatedUsuarios() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.listaUsuarios.slice(start, end);
  }

  //Método que se ejecuta para avanzar o retroceder en la paginación
  changePage(page: number, value: string) {
    if (value == 'paginaUsuarios')
      this.currentPage = page;
  }


  //Obtiene el número de registros por página
  onChange(value: any) {
    this.valueChange = value;
    this.itemsPerPage = Number(value.target.value);
  }


  //Consulta el catálogo de usuarios para mostrar en la tabla
  consultaUsuarios() {

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
            'identificador': 0, 'usuario': "", 'paterno': "", 'materno': "", 'nombre': "",
            'sesionActiva': "", 'usuarioBloqueado': "", 'intentosFallidos': 0, 'usuarioRegistro': 0,
            'fechaRegistro': "", 'usuarioModifica': 1, 'fechaModifica': ""
          };


          //Consume api para la consulta de usuarios
          this.responseUsuarioConsulta$ = this._postUsariosConsultaUseCase.consultaUsuarios(this.listaUsuario);
          this.responseUsuarioConsulta$.subscribe({
            next: (res: any) => {
              if ((res.contenido).length > 0) {
                this.listaUsuarios = res.contenido;
                //Registra la consulta exitosa de Usuarios en bitácora
                this.registroBitacora('consultaUsuarios', 'Usuarios', 'Consulta usuarios', 'Ejecución del servicio /bitacoras/catalogos/usuarios/consultar', 'C', 'Operación exitosa');
              } else {

                //Registra la consulta no exitosa de Usuarios en bitácora
                this.registroBitacora('consultaUsuarios', 'Usuarios', 'Consulta usuarios', 'Ejecución del servicio /bitacoras/catalogos/usuarios/consultar', 'I', 'Error en la operación');
                this._alertasService.warning('No se realizó la consulta de usuarios');
              }

            }, error: (e) => {

              let error = e.message;
              this._alertasService.clear();
              this._alertasService.danger('Estatus: ' + error);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('consultaUsuarios', 'Usuarios', 'Consulta usuarios', 'Ejecución del servicio /bitacoras/catalogos/usuarios/consultar', 'I', error);
            },
          })

        } else {
          //Registra el error al generar el token
          this.registroBitacora('consultaUsuarios', 'Usuarios', 'Generación de token', 'Para el servicio de consulta de usuarios', 'I', 'Error en la operación');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.message;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error);
        //Regitra el error al generar el token
        this.registroBitacora('consultaUsuarios', 'Usuarios', 'Generación de token', 'Para el servicio de consulta de usuarios', 'I', error);
      },
    })

  }

  //Obtiene el número total de Usuarios
  get totalUsuarios() {
    return this.listaUsuarios.length;
  }

  //Obtiene el nuúmero de páginas a mostrar en la paginación
  get pagesUsuarios() {
    this.totalPages = Math.ceil(this.listaUsuarios.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }


  //Elimina el usuario seleccionado
  eliminaUsuario(flagAction: boolean) {

    this._alertasService.clear();

    this.responseUsuarioEliminar = this._deleteUsuarioUseCase.eliminaUsuario(this.identificador);
    this.responseUsuarioEliminar.subscribe({
      next: (res: any) => {

        if (res.statusCode === 200) {

          //Registra la eliminación del usuario
          this.registroBitacora('eliminaUsuario', 'Usuarios', 'Eliminar Usuario', 'Se eliminó el usuario: ' + this.identificador, 'C', 'Operación exitosa');

          //Cosnulta catálogo de usuarios
          this.consultaUsuarios();

        } else {

          //Registra el error al emilinar el usuario
          this.registroBitacora('eliminaUsuario', 'Usuarios', 'Eliminar Usuario', 'No se eliminó el usuario: ' + this.identificador, 'I', 'Error en la operación');
          this._alertasService.warning('No se eliminó el usuario seleccionado');
        }

      }, error: (e) => {
        let error = e.message;
        //Registra el error al eliminar el usuario
        this.registroBitacora('eliminaUsuario', 'Usuarios', 'Eliminar Usuario', 'No se eliminó el usuario: ' + this.identificador, 'I', error);
      }
    })
  }


  //Abre modal para eliminar un usuario
  deleteRow(row: any) {
    this.buttonPrimary = "Eliminar";
    this.usuario = row.usuario;
    this.identificador = row.identificador;
    this.contenido = "¿Está seguro de eliminar al usuario " + row.usuario + "?";
    $('#modal-elimina-aplicacion').modal("show");
  }


  //Actualiza la tabla después de editar el renglón
  actualizar(datoDelPopup: string) {
    if (datoDelPopup == "Agregado") {
      this.consultaUsuarios();
    }
  }

  //Muestra el icono editar el renglón de la tabla
  editar(e: any) {

    if(e.usuario != sessionStorage.getItem('usuario')){

    if (this.edit) e.editable = !e.editable;
    this.edit = false;
    this.condicion = false;
    } else {
      this._alertasService.info('Su sesión no puede ser cerrada');
    }

  }

  //Cancela la operación de edición en la tabla
  cancelar(e: any) {
    this.consultaUsuarios();
    this.edit = true;
    e.editable = !e.editable;
    this.condicion = true;
  }

  //Guarda los cambios del Usuario
  salvar(e: any) {
    this.editaUsuario(e);
    this.edit = true;
    e.editable = !e.editable;
    this.condicion = true;
  }

  //Ejecuta el servicio para actualizar al Usuario
  editaUsuario(valor: any) {

    this._alertasService.clear();


    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);

    //Obtiene la fecha del día para editar un nuevo  usuario
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');
    this.listaUsuario = {
      'identificador': valor.identificador, 'usuario': valor.usuario, 'paterno': valor.paterno, 'materno': valor.materno, 'nombre': valor.nombre,
      'sesionActiva': valor.sesionActiva, 'usuarioBloqueado': valor.usuarioBloqueado, 'intentosFallidos': valor.intentosFallidos, 'usuarioRegistro': valor.usuarioRegistro,
      'fechaRegistro': this.dateToday + 'Z', 'usuarioModifica': 1, 'fechaModifica': this.dateToday + 'Z'
    };

    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Consume api para editar el usuario
          this.responseUsuarioRegistroEdicion$ = this._postUsuarioRegistroEdicionUseCase.registraEditaUsuario(this.listaUsuario);
          this.responseUsuarioRegistroEdicion$.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200) {

                //Registra la consulta de operaciones en  la bitácora
                this.registroBitacora('editaUsuario', 'Usuarios', 'Editar usuario', 'Se editó el usuario: ' + valor.usuario, 'C', 'Operación exitosa');
              } else {

                this.registroBitacora('editaUsuario', 'Usuarios', 'Editar usuario', 'No se editó el usuario: ' + valor.usuario, 'I', 'Error en la operación');
                this._alertasService.warning('No se edito el usuario: ' + valor.usuario);
              }

            }, error: (e) => {
              let error = e.message;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('editaUsuario', 'Usuarios', 'Editar usuario', 'No se editó el usuario: ' + valor.usuario, 'I', error);
            },
          })

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('editaUsuario', 'Usuarios', 'Editar usuario', 'No se editó el usuario: ' + valor.usuario, 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('editaUsuario', 'Usuarios', 'Generación de token', 'Para el servicio editar usuario', 'I', error.message);
      },
    })

  }

  //Ordena por columnas
  sortData(column: keyof Usuario): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.listaUsuarios.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return this.sortAscending ? -1 : 1;
      } else if (a[column] > b[column]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
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

