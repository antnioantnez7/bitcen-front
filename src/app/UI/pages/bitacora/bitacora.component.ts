import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { PaginacionComponent } from '../../shared/components/paginacion/paginacion.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablaAccesosComponent } from '../../components/tabla-accesos/tabla-accesos.component';
import { TablaTransaccionesComponent } from '../../components/tabla-transacciones/tabla-transacciones.component';
import { CommonModule, DatePipe } from '@angular/common';
import { DatePickerDirectiveStart } from '../../shared/services/directives/date-picker-start.directive';
import { DatePickerEndDirective } from '../../shared/services/directives/date/date-picker-end.directive';
import { AlertasService } from '../../shared/services/alertas.service';
import { AlertasComponent } from '../../shared/components/alertas/alertas.component';
import { ExcelServiceService } from '../../shared/services/excel-service.service';
import { GetUsuariosBitacoraUseCase } from '../../../domain/usercase/bitacora/get-usuarios-use-bitacora-case';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { GetOperacionesBitacoraUseCase } from '../../../domain/usercase/bitacora/get-operaciones-use-bitacora';
import { GetAccesosBitacoraUseCase } from '../../../domain/usercase/bitacora/get-accesos-use-bitacora';
import { BitacoraUsuario } from '../../../domain/models/bitacoraUsuario';
import { BitacoraOperacion } from '../../../domain/models/bitacoraOperacion';
import { BitacoraAcceso } from '../../../domain/models/bitacoraAcceso';
import { PostTokenUseCase } from '../../../domain/usercase/login/post-token-use-case';
import { TimeOutComponent } from "../../shared/components/time-out/time-out.component";
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { PostOperacionBitacoraUseCase } from '../../../domain/usercase/registroBitacora/post-operacion-bitacora-use-case';
import moment from 'moment';
import { Aplicacion } from '../../../domain/models/aplicacion';
import { GetAplicacionesConsultaUseCase } from '../../../domain/usercase/aplicaciones/get-aplicaciones-consulta-use-case';
import { SpinnerComponent } from "../../shared/components/spinner/spinner/spinner.component";
import { GetPerfilesBitacoraUseCase } from '../../../domain/usercase/bitacora/get-perfiles-use-bitacora-case';
import { TablaPerfilesComponent } from "../../components/tabla-perfiles/tabla-perfiles.component";
import { BitacoraPerfiles } from '../../../domain/models/bitacoraPerfiles';
import { Usuario } from '../../../domain/models/usuario';
import { PostUsuarioRegistroEdicionUseCase } from '../../../domain/usercase/usuarios/post-usuario-registro-edicion-use-case';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [TablaUsuariosComponent, TablaAccesosComponent, TablaTransaccionesComponent,
    PaginacionComponent, ReactiveFormsModule, CommonModule, FormsModule,
    DatePickerDirectiveStart, DatePickerEndDirective, AlertasComponent, TimeOutComponent,
    BreadcrumbComponent, SpinnerComponent, TablaPerfilesComponent],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.css'
})
export class BitacoraComponent {

  //Obtiene la referencia de los componentes hijos
  @ViewChild('paginaUsuarios') paginaUsuarios!: PaginacionComponent;
  @ViewChild('paginaPerfiles') paginaPerfiles!: PaginacionComponent;
  @ViewChild('paginaOperaciones') paginaOperaciones!: PaginacionComponent;
  @ViewChild('paginaAccesos') paginaAccesos!: PaginacionComponent;

  //Se suscribe al evento, para ejecutar el comportamiento.
  responseReporte$: Observable<any> | undefined;
  responseUsuarios$!: Observable<BitacoraUsuario>;
  responsePerfiles$!: Observable<BitacoraPerfiles>;
  responseOperaciones$!: Observable<BitacoraOperacion>;
  responseAccesos$!: Observable<BitacoraAcceso>;
  response$Token!: Observable<any>;
  response$Bitacora!: Observable<any>;
  responseAplicacionConsulta$!: Observable<Aplicacion>;
  responseUsuarioRegistroEdicion$!: Observable<string>;

  //Se declaran las variables del caso de uso
  _getUsuariosBitUseCase = inject(GetUsuariosBitacoraUseCase);
  _getPerfilesBitUseCase = inject(GetPerfilesBitacoraUseCase);
  _getOperacionesBitUseCase = inject(GetOperacionesBitacoraUseCase);
  _getAccesoBitUseCase = inject(GetAccesosBitacoraUseCase);
  _postToken = inject(PostTokenUseCase);
  _registraBitacora = inject(PostOperacionBitacoraUseCase);
  _getAplicacionesRegistroConsultaUseCase = inject(GetAplicacionesConsultaUseCase);
  _postUsuarioRegistroEdicionUseCase = inject(PostUsuarioRegistroEdicionUseCase);
  _alertasService = inject(AlertasService);

  bitacoraForm: FormGroup;
  isformSubmitted: boolean = false;
  valueChange: any;
  searchText = "";

  selectTab: any = undefined;
  selectDownloadAll: any = undefined;

  dateToday: any;
  desabilitar: any;
  fechaIn!: string;
  fechaFormato: any;
  aplicacion: string = "";
  lsAplicaciones: Aplicacion[] = [];
  dataUser: any;
  elemento: string = "";
  listaGrupos: string[] = [];
  listaTotalGrupos: string[] = [];
  aplicacionUsuario: string[] = [];
  grupo: any = "";
  isLoading = true;
  datePipe = new DatePipe('en-US');
  listaUsuario!: Usuario;

  //Valores de paginación de la tabla generico
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages = 0;
  pages: number[] = [];

  valoresListUsuarios: BitacoraUsuario[] = [];
  valoresListPerfiles: BitacoraPerfiles[] = [];
  valoresListOperaciones: BitacoraOperacion[] = [];
  valoresListAccesos: BitacoraAcceso[] = [];

  sortColumn: string = '';
  sortAscending: boolean = true;

  //Ejecuta los eventos requeridos en la carga de la página
  constructor(private excelServiceService: ExcelServiceService, private readonly el: ElementRef) {

    const datePipe = new DatePipe('en-US');
    this.dateToday = datePipe.transform(new Date(), 'dd/MM/yyyy');
    const fecha = new Date();
    this.fechaFormato = fecha.toLocaleDateString();

    this.bitacoraForm = new FormGroup({
      aplicacion: new FormControl(null, [Validators.required]),
      fechaInicio: new FormControl(this.dateToday, [Validators.required]),
      fechaFin: new FormControl(this.dateToday, [Validators.required]),
      historicos: new FormControl({ disabled: true }),
    })

    this.consultaGrupos();
    this.consultaAplicaciones();

  }

  //Elimina los valores de usuario y password ya encriptados
  ngOnInit() {
    this.isLoading = false;
    sessionStorage.removeItem('password');
  }

  //Obtiene la fecha inicio
  getDateStart(date: any) {
    this.bitacoraForm.patchValue({ fechaInicio: date })
  }

  //Obtiene la fecha fin
  getDateEnd(date: any) {
    this.bitacoraForm.patchValue({ fechaFin: date })
  }

  //Valida las fechas
  validateDate(fechaInicio: Date, fechaFin: Date) {

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      this._alertasService.danger('Fecha inicio no debe ser mayor a fecha fin');
      return;
    } else {
      this._alertasService.clear();
    }
    if (new Date(fechaFin) > new Date(this.dateToday)) {
      this.validateEndDate(fechaFin);
    }
  }

  //Valida la fecha Final
  validateEndDate(fechaFin: Date) {
    if (new Date(fechaFin) > new Date(this.dateToday)) {
      this._alertasService.danger('Fecha fin no debe ser mayor a la fecha actual');
    }
  }


  //Obtiene la referencia de cada componente dentro del formulario
  get f() { return this.bitacoraForm.controls; }

  //Consulta la Bitácora de Usuarios, Operaciones y Accesos
  onsubmit() {

    this._alertasService.clear();

    if (this.bitacoraForm.controls['aplicacion'].value == 'Seleccionar aplicación') {
      this._alertasService.danger('Favor de seleccionar la Aplicación');
      return;
    }

    if (this.bitacoraForm.invalid) {
      //Mensaje de error
      this._alertasService.danger('Favor de seleccionar todos los campos');
      return;
    }

    this._alertasService.clear();

    //Valida las fechas Inicio y Fin
    let fechaInicio = this.bitacoraForm.get('fechaInicio')?.value;
    let fechaFin = this.bitacoraForm.get('fechaFin')?.value;

    this.validateDate(fechaInicio, fechaFin);

    //Convierte la fecha para realizar las consultas
    let fechaInicioFormat = moment(fechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let fechaFinFormat = moment(fechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD');

    //Crea el número de transacción para validar el token
    let transaccion = uuid();
    sessionStorage.setItem('transaccion', transaccion);

    //Recupera el token del usuario activo
    this.response$Token = this._postToken.postToken();
    this.response$Token.subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          let data = res;
          let token = data.tokenDTO;
          sessionStorage.setItem('token', token.token);

          //Consume api para consulta de usuarios
          this.responseUsuarios$ = this._getUsuariosBitUseCase.getUsuariosBitacoraData(this.aplicacion, 'Usuarios', fechaInicioFormat + "T00:00:00.000Z", fechaFinFormat + "T23:59:59.000Z", false);
          this.responseUsuarios$.subscribe({
            next: (res: any) => {
              if (res.statusCode == 200) {
                this.valoresListUsuarios = res.contenido;

                //Registra la consulta de usuarios en  la bitácora
                this.registroBitacora('onSubmit', 'Consulta', 'Consulta de usuarios', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'C', 'Operación exitosa');

                //Consume api para consulta de perfiles
                this.responsePerfiles$ = this._getPerfilesBitUseCase.getPerfilesBitacoraData(this.aplicacion, 'Perfiles', fechaInicioFormat + "T00:00:00.000Z", fechaFinFormat + "T23:59:59.000Z", false);
                this.responsePerfiles$.subscribe({
                  next: (res: any) => {
                    if (res.statusCode == 200) {
                      this.valoresListPerfiles = res.contenido;

                      //Registra la consulta de usuarios en  la bitácora
                      this.registroBitacora('onSubmit', 'Consulta', 'Consulta de perfiles', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'C', 'Operación exitosa');

                      //Consume api para consulta de operaciones
                      this.responseOperaciones$ = this._getOperacionesBitUseCase.getOperacionesBitacoraData(this.aplicacion, fechaInicioFormat + "T00:00:00.000Z", fechaFinFormat + "T23:59:59.000Z", false);
                      this.responseOperaciones$.subscribe({
                        next: (res: any) => {

                          if (res.statusCode == 200) {

                            //Llena la tabla de operaciones
                            this.valoresListOperaciones = res.contenido;

                            //Registra la consulta de operaciones en  la bitácora
                            this.registroBitacora('onSubmit', 'Consulta', 'Consulta de operaciones', 'Ejecuta el servicio /bitacora/operaciones/consultar', 'C', 'Operación exitosa');

                            //Consume api para consulta de accesos
                            this.responseAccesos$ = this._getAccesoBitUseCase.getAccesosBitacoraData(this.aplicacion, fechaInicioFormat + "T00:00:00.000Z", fechaFinFormat + "T23:59:59.000Z", false);
                            this.responseAccesos$.subscribe({
                              next: (res: any) => {

                                if (res.statusCode == 200) {
                                  this.valoresListAccesos = res.contenido;

                                  //Registra la consulta de accesos en  la bitácora
                                  this.registroBitacora('onSubmit', 'Consulta', 'Consulta de accesos', 'Ejecuta el servicio /bitacora/accesos/consultar', 'C', 'Operación exitosa');
                                } else {
                                  this.registroBitacora('onSubmit', 'Consulta', 'Consulta de accesos', 'Ejecuta el servicio /bitacora/accesos/consultar', 'I', 'No existe información para mostrar en accesos');
                                }
                              }, error: (e) => {
                                let error = e.message;
                                this._alertasService.clear();
                                this._alertasService.danger('estatus: ' + error);
                                //Registra el error en la consulta de accesos
                                this.registroBitacora('onSubmit', 'Consulta', 'Consulta de accesos', 'Ejecuta el servicio /bitacora/accesos/consultar', 'I', error);
                              },
                            })

                          } else {
                            this.registroBitacora('onSubmit', 'Consulta', 'Consulta de operaciones', 'Ejecuta el servicio /bitacora/operaciones/consultar', 'I', 'No existe información para mostrar en operaciones');
                          }

                        }, error: (e) => {
                          let error = e.message;
                          this._alertasService.clear();
                          this._alertasService.danger('estatus: ' + error);
                          //Registra el error en la consulta de operaciones
                          this.registroBitacora('onSubmit', 'Consulta', 'Consulta de operaciones', 'Ejecuta el servicio /bitacora/operaciones/consultar', 'I', error);
                        },
                      })



                    } else {

                      this.registroBitacora('onSubmit', 'Consulta', 'Consulta de perfiles', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'I', 'No existe información para mostrar en perfiles');
                    }
                  }, error: (e) => {
                    let error = e.message;
                    this._alertasService.clear();
                    this._alertasService.danger('estatus: ' + error);
                    //Registra el error en la consulta de perfiles
                    this.registroBitacora('onSubmit', 'Consulta', 'Consulta de perfiles', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'I', error);
                  },
                });

              } else {

                this.registroBitacora('onSubmit', 'Consulta', 'Consulta de usuarios', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'I', 'No existe información para mostrar en usuarios');
              }
            }, error: (e) => {
              let error = e.message;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error);
              //Registra el error en la consulta de usuarios
              this.registroBitacora('onSubmit', 'Consulta', 'Consulta de usuarios', 'Ejecuta el servicio /bitacora/usuarios/consultar', 'I', error);
            },
          });

        } else {
          //Registra el acceso del usuario en la Bitácora
          this.registroBitacora('onSubmit', 'Generación de token', 'Consultas', 'Consulta de accesos, operaciones y usuarios', 'I', 'El token no ha podido ser generado');
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
        //Registra el acceso del usuario en la Bitácora
        this.registroBitacora('onSubmit', 'Generación de token', 'Consultas', 'Consulta de accesos, operaciones y usuarios', 'I', error.message);
      },
    })
  }


  //Limpia los input del form
  clearControl() {
    this.bitacoraForm.setValue({
      aplicacion: null,
      fechaInicio: this.dateToday,
      fechaFin: this.dateToday,
      historicos: false,
    });

    this._alertasService.clear();
    this.valoresListUsuarios = [];
    this.valoresListPerfiles = [];
    this.valoresListOperaciones = [];
    this.valoresListAccesos = [];

  }

  //Paginación de la tabla de Usuarios
  get paginatedDataUS() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.valoresListUsuarios.slice(start, end);
  }

  //Obtiene el total de usuarios
  get totalUsuarios() {
    return this.valoresListUsuarios.length;
  }

  //Obtiene el número de páginas a mostrar en la paginación de Usuarios
  get pagesUsuarios() {
    this.totalPages = Math.ceil(this.valoresListUsuarios.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }

  //Paginación de la tabla de Perfiles
  get paginatedDataPe() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.valoresListPerfiles.slice(start, end);
  }

  //Obtiene el total de perfiles
  get totalPerfiles() {
    return this.valoresListPerfiles.length;
  }

  //Obtiene el número de páginas a mostrar en la paginación de Perfiles
  get pagesPerfiles() {
    this.totalPages = Math.ceil(this.valoresListPerfiles.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }

  //Paginación de la tabla de Accesos
  get paginatedDataAc() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.valoresListAccesos.slice(start, end);
  }

  //Obtiene el total de accesos
  get totalAccesos() {
    return this.valoresListAccesos.length;
  }

  //Obtiene el número de páginas a mostrar en la paginación de Accesos
  get pagesAccesos() {
    this.totalPages = Math.ceil(this.valoresListAccesos.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }

  //Paginación de la tabla de Operaciones
  get paginatedDataOp() {
    const start = (this.currentPage - 1) * (this.itemsPerPage);
    const end = start + this.itemsPerPage;
    return this.valoresListOperaciones.slice(start, end);
  }

  //Obtiene el total de operaciones
  get totalOperaciones() {
    return this.valoresListOperaciones.length;
  }

  //Obtiene el número de páginas a mostrar en la paginación de Operaciones
  get pagesOperaciones() {
    this.totalPages = Math.ceil(this.valoresListOperaciones.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    return this.pages;
  }

  //Descarga el archivo Excel con el contenio de todas las tablas
  downloadFileAll() {

    this._alertasService.clear();

    if (this.valoresListUsuarios.length > 0 || this.valoresListPerfiles.length > 0 || this.valoresListAccesos.length > 0 || this.valoresListOperaciones.length > 0) {
      this.selectDownloadAll = 1;
      this.excelServiceService.exportAsExcelFileAll(this.aplicacion, this.valoresListUsuarios, this.valoresListPerfiles, this.valoresListAccesos, this.valoresListOperaciones);
    } else {
      this._alertasService.info("No existe información en las tablas");
    }
  }

  //Descarga el archivo Excel por tabla
  downloadFile() {

    this._alertasService.clear();

    if (this.selectTab === undefined || this.selectTab === 1) {
      if (this.valoresListUsuarios.length > 0) {
        let fileName = this.aplicacion + '_bitacora_usuarios_';
        this.excelServiceService.exportAsExcelFile(this.valoresListUsuarios, fileName, "usuarios");
      } else {
        this._alertasService.info("No existe información en la tabla para realizar la descarga");
      }
    }
    else if (this.selectTab === 2) {
      if (this.valoresListPerfiles.length > 0) {
        let fileName = this.aplicacion + '_bitacora_perfiles_';
        this.excelServiceService.exportAsExcelFile(this.valoresListPerfiles, fileName, "perfiles");
      } else {
        this._alertasService.info("No existe información en la tabla para realizar la descarga");
      }
    }
    else if (this.selectTab === 3) {
      if (this.valoresListOperaciones.length > 0) {
        let fileName = this.aplicacion + '_bitacora_accesos_';
        this.excelServiceService.exportAsExcelFile(this.valoresListAccesos, fileName, "accesos");
      } else {
        this._alertasService.info("No existe información en la tabla para realizar la descarga");
      }
    }
    else if (this.selectTab === 4) {
      if (this.valoresListAccesos.length > 0) {
        let fileName = this.aplicacion + '_bitacora_operaciones_';
        this.excelServiceService.exportAsExcelFile(this.valoresListOperaciones, fileName, "operaciones");
      } else {
        this._alertasService.info("No existe información en la tabla para realizar la descarga");
      }
    }
  }

  //Selecciona el tab
  getTab(value: any) {
    this.selectTab = value;
  }

  //Método que se ejecuta para avanzar o retroceder en la paginación
  changePage(page: number, value: string) {

    if (value == 'paginaUsuarios')
      this.currentPage = page;
    if (value == 'paginaPerfiles')
      this.currentPage = page;
    if (value == 'paginaOperaciones')
      this.currentPage = page;
    if (value == 'paginaAccesos')
      this.currentPage = page;
  }

  //Muestra el número de registros por página
  onChange(value: any) {
    this.valueChange = value;
    this.itemsPerPage = Number(value.target.value);
  }

  //Selecciona la aplicación del combo
  onAplicacionChanged(value: any) {
    this.aplicacion = value;
  }

  //Consulta las aplicaciones de BD para llenar el combo
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
          this.responseAplicacionConsulta$ = this._getAplicacionesRegistroConsultaUseCase.consultaAplicaciones();
          this.responseAplicacionConsulta$.subscribe({
            next: (res: any) => {

              if ((res.contenido).length > 0) {

                this.lsAplicaciones = res.contenido;
                this.lsAplicaciones.forEach(element => {

                  this.validaGrupo(element.aplicativoId);
                });

                //Registra la consulta de operaciones en  la bitácora
              } else {
                this._alertasService.warning('No se realizó la consulta de aplicaciones');
              }
            }, error: (e) => {
              let error = e.error;
              this._alertasService.clear();
              this._alertasService.danger('estatus: ' + error);
            },
          })
        } else {
          //Registra el acceso del usuario en la Bitácora
          this._alertasService.danger('El token no ha podido ser generado');
        }
      }, error: (e) => {
        let error = e.error.errorMessageDTO;
        this._alertasService.clear();
        this._alertasService.danger('estatus: ' + error.message);
      },
    })

  }

  //Consulta los grupos que vienen de LDAP
  consultaGrupos() {

    this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
    this.listaGrupos = this.dataUser.listaTotalGrupos;

    this.listaGrupos.forEach(element => {

      this.elemento = element.split("-")[0];
      let valor2 = this.elemento.split("_")[0];
      this.listaTotalGrupos.push(valor2.toUpperCase());
    });

  }

  //Filtra los grupos para llenar el combo de aplicaciones
  validaGrupo(element: any) {

    let grupo = this.listaTotalGrupos.find(u => u === element.toUpperCase());

    if (grupo) {
      this.aplicacionUsuario.push(grupo);
    }

  }

  //Guarda en bitácora todos los eventos de operación
  registroBitacora(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string) {

    this.response$Bitacora = this._registraBitacora.postOperacionBitacoraData(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion.slice(0, 100));
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
