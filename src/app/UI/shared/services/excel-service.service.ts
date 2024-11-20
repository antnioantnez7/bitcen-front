import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  valoresExcel: any[] = [];
  valoresExcelUsuarios: any[] = [];
  valoresExcelPerfiles: any[] = [];
  valoresExcelOperaciones: any[] = [];
  valoresExcelAccesos: any[] = [];
  nameSheet: string = "";

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, tipo: string): void {

    switch (tipo) {
      case "usuarios":
        this.valoresExcel = this.renombrarTitulosUsuarios(json);
        this.nameSheet = "Usuarios";
        break;
      case "perfiles":
        this.valoresExcel = this.renombrarTitulosUsuarios(json);
        this.nameSheet = "Perfiles";
        break;
      case "operaciones":
        this.valoresExcel = this.renombrarTitulosOperaciones(json);
        this.nameSheet = "Operaciones";
        break;
      case "accesos":
        this.valoresExcel = this.renombrarTitulosAccesos(json);
        this.nameSheet = "Accesos";
        break;
      default:
        break;
    }


    if (this.valoresExcel) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.valoresExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, this.nameSheet);
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }

  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    let dateToday: any;
    const datePipe = new DatePipe('en-US');
    dateToday = datePipe.transform(new Date(), 'dd/MM/yyyy');
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_' + dateToday + EXCEL_EXTENSION);
  }

  public exportAsExcelFileAll(aplicacion: string, json1: any[], json2: any[], json3: any[], json4: any[]): void {

    this.valoresExcelUsuarios = this.renombrarTitulosUsuarios(json1);
    this.valoresExcelPerfiles = this.renombrarTitulosUsuarios(json2);
    this.valoresExcelAccesos = this.renombrarTitulosAccesos(json3);
    this.valoresExcelOperaciones = this.renombrarTitulosOperaciones(json4);


    let dateToday: any;
    const datePipe = new DatePipe('en-US');
    dateToday = datePipe.transform(new Date(), 'dd/MM/yyyy');

    let excelFileName: string = aplicacion + '_bitacora_todos_' + dateToday;

    const usuarios: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.valoresExcelUsuarios);
    const perfiles: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.valoresExcelPerfiles);
    const accesos: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.valoresExcelAccesos);
    const operaciones: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.valoresExcelOperaciones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, usuarios, 'Usuarios');
    XLSX.utils.book_append_sheet(workbook, perfiles, 'Perfiles');
    XLSX.utils.book_append_sheet(workbook, accesos, 'Accesos');
    XLSX.utils.book_append_sheet(workbook, operaciones, 'Operaciones');
    const excelBuffer: any = XLSX.writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);

  }


  renombrarTitulosUsuarios(json: any[]): any[] {
    this.valoresExcel = JSON.parse(JSON.stringify(json));

    this.valoresExcel.forEach((obj: any) => {
      for (const k in obj) {
        if (k === "identificador") {
          obj["Identificador"] = obj[k];
          delete obj[k];
        } else if (k === "aplicativoId") {
          obj["Id Aplicativo"] = obj[k];
          delete obj[k];
        } else if (k === "capa") {
          obj["Capa"] = obj[k];
          delete obj[k];
        } else if (k === "metodo") {
          obj["Método"] = obj[k];
          delete obj[k];
        } else if (k === "proceso") {
          obj["Proceso"] = obj[k];
          delete obj[k];
        } else if (k === "subproceso") {
          obj["Subproceso"] = obj[k];
          delete obj[k];
        } else if (k === "detalleOperacion") {
          obj["Detalle Operación"] = obj[k];
          delete obj[k];
        } else if (k === "transaccionId") {
          obj["Id Transacción"] = obj[k];
          delete obj[k];
        } else if (k === "ipEquipo") {
          obj["IP Equipo"] = obj[k];
          delete obj[k];
        } else if (k === "fechaHoraOperacion") {
          obj["Fecha/Hora Operación"] = obj[k];
          delete obj[k];
        } else if (k === "usuarioOperador") {
          obj["Usuario Operador"] = obj[k];
          delete obj[k];
        } else if (k === "nombreOperador") {
          obj["Nombre Operador"] = obj[k];
          delete obj[k];
        } else if (k === "expedienteOperador") {
          obj["Expediente Operador"] = obj[k];
          delete obj[k];
        } else if (k === "areaOperador") {
          obj["Área Operador"] = obj[k];
          delete obj[k];
        } else if (k === "puestoOperador") {
          obj["Puesto Operador"] = obj[k];
          delete obj[k];
        } else if (k === "usuario") {
          obj["Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "nombreUsuario") {
          obj["Nombre Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "expedienteUsuario") {
          obj["Expediente Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "areaUsuario") {
          obj["Área Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "puestoUsuario") {
          obj["Puesto Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "estatusOperacion") {
          obj["Estatus Operación"] = obj[k];
          delete obj[k];
        } else if (k === "respuestaOperacion") {
          obj["Respuesta Operación"] = obj[k];
          delete obj[k];
        }

      }
    });

    return this.valoresExcel;

  }


  renombrarTitulosOperaciones(json: any[]): any[] {

    this.valoresExcel = JSON.parse(JSON.stringify(json));
    this.valoresExcel.forEach((obj: any) => {
      for (const k in obj) {
        if (k === "identificador") {
          obj["Identificador"] = obj[k];
          delete obj[k];
        } else if (k === "aplicativoId") {
          obj["Id Aplicativo"] = obj[k];
          delete obj[k];
        } else if (k === "capa") {
          obj["Capa"] = obj[k];
          delete obj[k];
        } else if (k === "metodo") {
          obj["Método"] = obj[k];
          delete obj[k];
        } else if (k === "proceso") {
          obj["Proceso"] = obj[k];
          delete obj[k];
        } else if (k === "subproceso") {
          obj["Subproceso"] = obj[k];
          delete obj[k];
        } else if (k === "detalleOperacion") {
          obj["Detalle Operación"] = obj[k];
          delete obj[k];
        } else if (k === "transaccionId") {
          obj["Id Transacción"] = obj[k];
          delete obj[k];
        } else if (k === "ipEquipo") {
          obj["IP Equipo"] = obj[k];
          delete obj[k];
        } else if (k === "fechaHoraTransaccion") {
          obj["Fecha/Hora Transacción"] = obj[k];
          delete obj[k];
        } else if (k === "usuarioOperador") {
          obj["Usuario Operador"] = obj[k];
          delete obj[k];
        } else if (k === "nombreOperador") {
          obj["Nombre Operador"] = obj[k];
          delete obj[k];
        } else if (k === "expedienteOperador") {
          obj["Expediente Operador"] = obj[k];
          delete obj[k];
        } else if (k === "areaOperador") {
          obj["Área Operador"] = obj[k];
          delete obj[k];
        } else if (k === "puestoOperador") {
          obj["Puesto Operador"] = obj[k];
          delete obj[k];
        } else if (k === "estatusOperacion") {
          obj["Estatus Operación"] = obj[k];
          delete obj[k];
        } else if (k === "respuestaOperacion") {
          obj["Respuesta Operación"] = obj[k];
          delete obj[k];
        }

      }
    });

    return this.valoresExcel;

  }


  renombrarTitulosAccesos(json: any[]): any[] {

    this.valoresExcel = JSON.parse(JSON.stringify(json));

    this.valoresExcel.forEach((obj: any) => {
      for (const k in obj) {
        if (k === "identificador") {
          obj["Identificador"] = obj[k];
          delete obj[k];
        } else if (k === "aplicativoId") {
          obj["Id Aplicativo"] = obj[k];
          delete obj[k];
        } else if (k === "capa") {
          obj["Capa"] = obj[k];
          delete obj[k];
        } else if (k === "metodo") {
          obj["Método"] = obj[k];
          delete obj[k];
        } else if (k === "actividad") {
          obj["Actividad"] = obj[k];
          delete obj[k];
        } else if (k === "transaccionId") {
          obj["Id Transacción"] = obj[k];
          delete obj[k];
        } else if (k === "ipEquipo") {
          obj["IP Equipo"] = obj[k];
          delete obj[k];
        } else if (k === "fechaHoraAcceso") {
          obj["Fecha/Hora Transacción"] = obj[k];
          delete obj[k];
        } else if (k === "usuarioAcceso") {
          obj["Usuario Acceso"] = obj[k];
          delete obj[k];
        } else if (k === "nombreUsuario") {
          obj["Nombre Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "expedienteUsuario") {
          obj["Expediente Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "areaUsuario") {
          obj["Área Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "puestoUsuario") {
          obj["Puesto Usuario"] = obj[k];
          delete obj[k];
        } else if (k === "estatusOperacion") {
          obj["Estatus Operación"] = obj[k];
          delete obj[k];
        } else if (k === "respuestaOperacion") {
          obj["Respuesta Operación"] = obj[k];
          delete obj[k];
        }

      }
    });

    return this.valoresExcel;

  }
}
