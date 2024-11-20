import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { PaginacionComponent } from '../../shared/components/paginacion/paginacion.component';
import { Aplicacion } from '../../../domain/models/aplicacion';
import { SearchPipe } from '../../shared/services/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { AlertasComponent } from '../../shared/components/alertas/alertas.component';
import { AlertasService } from '../../shared/services/alertas.service';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { PostTokenUseCase } from '../../../domain/usercase/login/post-token-use-case';
import { GetAplicacionesConsultaUseCase } from '../../../domain/usercase/aplicaciones/get-aplicaciones-consulta-use-case';
import { TimeOutComponent } from "../../shared/components/time-out/time-out.component";
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { PostAplicacionesRegistroUseCase } from '../../../domain/usercase/aplicaciones/post-aplicaciones-registro-use-case';
import { DeleteAplicacionUseCase } from '../../../domain/usercase/aplicaciones/delete-aplicacion-use-case';
import { ModalEliminaAplicacionComponent } from "../../shared/components/modal/modal-elimina-aplicacion/modal-elimina-aplicacion.component";
import { AgregarAplicacionComponent } from "../../shared/components/modal/agregar-aplicacion/agregar-aplicacion.component";
import { PostAplicacionesActualizaUseCase } from '../../../domain/usercase/aplicaciones/post-aplicaciones-actualiza-use-case';
import { CommonModule, DatePipe } from '@angular/common';
import { PostOperacionBitacoraUseCase } from '../../../domain/usercase/registroBitacora/post-operacion-bitacora-use-case';
declare let $: any;
import { NgxPaginationModule } from 'ngx-pagination';
import { SpinnerComponent } from "../../shared/components/spinner/spinner/spinner.component";

@Component({
  selector: 'app-catalogo-aplicaciones',
  standalone: true,
  imports: [CommonModule, PaginacionComponent, SearchPipe, FormsModule, AlertasComponent, TimeOutComponent,
    BreadcrumbComponent, ModalEliminaAplicacionComponent, AgregarAplicacionComponent, NgxPaginationModule, SpinnerComponent],
  templateUrl: './catalogo-aplicaciones.component.html',
  styleUrl: './catalogo-aplicaciones.component.css'
})

export class CatalogoAplicacionesComponent implements OnInit, AfterViewInit {

  //Obtiene la referencia del componente hijo
  @ViewChild('paginaAplicaciones') paginaAplicaciones!: PaginacionComponent;

  //Se suscribe al evento, para ejecutar el comportamiento
  response$Token!: Observable<any>;
  responseAplicacionConsulta$!: Observable<Aplicacion>;
  responseAplicacionEliminar!: Observable<string>;
  responseAplicacionEditar$!: Observable<string>;
  response$Bitacora!: Observable<any>;

  //Uso de servicio y definición de variables
  _alertasService = inject(AlertasService);
  _postToken = inject(PostTokenUseCase);
  _getAplicacionesConsultaUseCase = inject(GetAplicacionesConsultaUseCase);
  _registraBitacora = inject(PostOperacionBitacoraUseCase);
  _postAplicacionesRegistroUseCase = inject(PostAplicacionesRegistroUseCase);
  _deleteAplicacionUseCase = inject(DeleteAplicacionUseCase);
  _postAplicacionEditarUseCase = inject(PostAplicacionesActualizaUseCase);

  tituloAgregar: string = "Agregar Aplicación";
  tituloEliminar: string = "Eliminar";
  listaAplicaciones: Aplicacion[] = [];
  listaAplicacion!: Aplicacion;

  //Valores de paginación de la tabla
  itemsPerPage: number = 5;
  totalPages = 0;
  pages: number[] = [];
  valueChange: any;
  currentPage: number = 1;
  page = 1;

  //Busqueda en tabla
  searchText = "";
  modalRow: any;

  //Ordenamiento de la tabla
  sortColumn: string = '';
  sortAscending: boolean = true;

  buttonPrimary: string = "";
  buttonSecondary: string = "Cancelar";
  contenido: string = "";
  aplicativo: string = "";
  editable: boolean = false;
  edit: boolean = true;
  condicion = true;
  datePipe = new DatePipe('en-US');
  dateToday: any;
  rol: string = "";
  isDisabled: boolean = false;

  constructor() { }

  //Consulta el catálogo de Aplicaciones para mostrar en la tabla
  //Obtiene el perfil de usuario para manejo de permisos en la página
  ngOnInit(): void {
    this.consultaAplicaciones();
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
  get paginatedAplicaciones() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.listaAplicaciones.slice(start, end);
  }

  //Método que se ejecuta para avanzar o retroceder en la paginación
  changePage(page: number, value: string) {
    if (value == 'paginaAplicaciones')
      this.currentPage = page;
  }


  //Obtiene el número de registros por página
  onChange(value: any) {
    this.valueChange = value;
    this.itemsPerPage = Number(value.target.value);
  }

  //Consulta el catálogo de aplicaciones para mostrar en la tabla
  consultaAplicaciones() {

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

          //Consume api para la consulta de aplicaciones
          this.responseAplicacionConsulta$ = this._getAplicacionesConsultaUseCase.consultaAplicaciones();
          this.responseAplicacionConsulta$.subscribe({
            next: (res: any) => {

              if ((res.contenido).length > 0) {
                this.listaAplicaciones = res.contenido;

                //Registra la consulta de Aplicaciones en  la bitácora
                this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Consulta de aplicaciones', 'Ejecución del servicio /bitacora/catalogos/aplicativos/consultar', 'C', 'Operación exitosa');
              } else {

                this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Consulta de aplicaciones', 'Ejecución del servicio /bitacora/catalogos/aplicativos/consultar', 'I', 'No se realizó la consulta de aplicaciones');
                this._alertasService.warning('No se realizó la consulta de aplicaciones');
              }

            }, error: (e) => {
              let error = e.error;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + e);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Consulta de aplicaciones', 'Ejecución del servicio /bitacora/catalogos/aplicativos/consultar', 'I', error);
            },
          })

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('onSubmit', 'Generación de token', 'Catálogo de  Aplicaciones', 'Servicio para generar Token', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('onSubmit', 'Generación de token', 'Catálogo de aplicaciones', 'Servicio para generar Token', 'I', error.message);
      },
    })

  }

  //Obtiene el número total de Aplicaciones
  get totalAplicaciones() {
    return this.listaAplicaciones.length;
  }

  //Obtiene el nuúmero de páginas a mostrar en la paginación
  get pagesAplicaciones() {
    this.totalPages = Math.ceil(this.listaAplicaciones.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }

  //Elimina la Aplicación seleccionada
  eliminaAplicacion(flagAction: boolean) {

    this._alertasService.clear();

    this.responseAplicacionEliminar = this._deleteAplicacionUseCase.eliminaAplicacion(this.aplicativo);
    this.responseAplicacionEliminar.subscribe({
      next: (res: any) => {

        if (res.statusCode === 200) {

          this.registroBitacora('onSubmit', 'Catálogo de aplicaciones', 'Elimina Aplicación', 'Se elimina: ' + this.aplicativo, 'C', 'Se eliminó la aplicación seleccionada');
          this.consultaAplicaciones();

        } else {

          this.registroBitacora('onSubmit', 'Catálogo de aplicaciones', 'Elimina Aplicación', 'No se eliminó: ' + this.aplicativo, 'I', 'No se eliminó la aplicación seleccionada');
          this._alertasService.warning('No se eliminó la aplicación seleccionada');
        }

      }, error: (e) => {
        let error = e.message;
        ;
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Eliminar Aplicación', 'No se eliminó: ' + this.aplicativo, 'I', error);
      }
    })
  }

  //Abre modal para eliminar una aplicación
  deleteRow(row: any) {
    this.buttonPrimary = "Aceptar";
    this.aplicativo = row.aplicativoId;
    this.contenido = "Al eliminar la Aplicación " + row.aplicativoId + " no podrá realizar las consultas de éste Aplicativo. ¿Desea continuar?";
    $('#modal-elimina-aplicacion').modal("show");
  }

  //Actualiza la tabla después de editar el renglón
  actualizar(datoDelPopup: string) {
    if (datoDelPopup == "Agregado") {
      this.consultaAplicaciones();
    }
  }

  //Muestra el icono editar el renglón de la tabla
  editar(e: any) {
    if (this.edit) e.editable = !e.editable;
    this.edit = false;
    this.condicion = false;
  }

  //Cancela la operación de edición en la tabla
  cancelar(e: any) {
    this.consultaAplicaciones();
    this.edit = true;
    e.editable = !e.editable;
    this.condicion = true;
  }

  //Guarda los cambios de la Aplicación
  salvar(e: any) {
    this.editaAplicacion(e);
    this.edit = true;
    e.editable = !e.editable;
    this.condicion = true;
  }

  //Ejecuta el servicio para actualizar la Aplicación
  editaAplicacion(valor: any) {

    this._alertasService.clear();

    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);

    //Obtiene la fecha del día para registrar un nuevo  usuario
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');
    this.listaAplicacion = { 'aplicativoId': valor.aplicativoId, 'nombre': valor.nombre, 'usuarioRegistro': 1, 'fechaRegistro': this.dateToday + 'Z', 'usuarioModifica': 1, 'fechaModifica': this.dateToday + 'Z' };

    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Consume api para el registro de aplicaciones
          this.responseAplicacionEditar$ = this._postAplicacionEditarUseCase.actualizaAplicaciones(this.listaAplicacion);
          this.responseAplicacionEditar$.subscribe({
            next: (res: any) => {

              if (res.statusCode == 200) {

                //Registra la consulta de operaciones en  la bitácora
                this.registroBitacora('onSubmit', 'Catálogo de aplicaciones', 'Edición de aplicación', 'Se editó la aplicación: ' + valor.aplicativoId, 'C', 'Operación exitosa');
              } else {

                this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Edición de aplicación', 'No se editó la aplicación: ' + valor.aplicativoId, 'I', 'No se realizó el alta/edición de la aplicación');
                this._alertasService.warning('No se realizó el alta de la aplicación');
              }

            }, error: (e) => {
              let error = e.message;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('onSubmit', 'Catálogo de Aplicaciones', 'Edición de aplicación', 'No se editó la aplicación: ' + valor.aplicativoId, 'I', error);
            },
          })

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('onSubmit', 'Generación de token', 'En catálogo de Aplicaciones', 'Servicio de Tokenizer', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.message;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error);
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('onSubmit', 'Generación de token', 'Catálogo de aplicaciones', 'Servicio de Tokenizer', 'I', error.message);
      },
    })
  }

  //Ordena por columnas
  sortData(column: keyof Aplicacion): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.listaAplicaciones.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return this.sortAscending ? -1 : 1;
      } else if (a[column] > b[column]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  //Guarda en bitácora todos los eventos de operación
  registroBitacora(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string) {

    this.response$Bitacora = this._registraBitacora.postOperacionBitacoraData(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion);
    this.response$Bitacora.subscribe({
      next: (res: any) => {

      }, error: (e) => {
        let error = e.message;
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora(metodo, proceso, subproceso, detalleOperacion, 'I', error);
      }
    })

  }

}
