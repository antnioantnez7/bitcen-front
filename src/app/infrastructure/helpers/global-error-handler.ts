import { ErrorHandler, Injectable } from "@angular/core";

//Cacha los errores en los llamados http
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    throw error;
  }
}




