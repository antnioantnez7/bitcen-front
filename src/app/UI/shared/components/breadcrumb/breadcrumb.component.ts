import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IBreadCrumb } from '../../../../domain/models/breadcrumb';


@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})

export class BreadcrumbComponent {

  //Definición de variables
  public breadcrumbs: IBreadCrumb[];
  public listBreadcrumb: IBreadCrumb[] = [];
  public breadcrumbLinksList: IBreadCrumb[] = [];
  public enlace: boolean = true;
  label?: string = "";
  path?: string = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    })
  }

  /**
   * Cree recursivamente una ruta de navegación según la ruta activada.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {

    if (route.routeConfig && route.routeConfig.data) {
      this.label = route.routeConfig.data['breadcrumb'];
    } else {
      this.label = '';
    }

    if (route.routeConfig && route.routeConfig.data) {
      this.path = route.routeConfig.path;
    } else {
      this.path = '';
    }

    const lastRoutePart = this.path!.split('/').pop();
    const isDynamicRoute = lastRoutePart!.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart!.split(':')[1];
      this.path = this.path!.replace(lastRoutePart!, route.snapshot.params[paramName]);
      this.label = route.snapshot.params[paramName];
    }

    //En routeConfig la ruta completa no está disponible, por lo que se reconstruye cada vez.
    const nextUrl = this.path ? `${url}/${this.path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: this.label!,
      url: nextUrl,
      activo: this.enlace,
    };
    //Solo agrega ruta con etiqueta no vacía
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    this.listBreadcrumb = newBreadcrumbs;
    this.breadcrumbLinksList = [this.listBreadcrumb[0]];


    for (let i = 1; i <= this.listBreadcrumb.length; i++) {

      if (i > 1) {
        this.listBreadcrumb[0].url = this.listBreadcrumb[1].url;
        this.listBreadcrumb[0].activo = false;
      }

    }

    //retorna nuevo Breadcrumbs;
    return this.listBreadcrumb;
  }
}
