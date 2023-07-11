import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./shared/pages/home-page/home-page.component";
import {AboutPageComponent} from "./shared/pages/about-page/about-page.component";
import {ContactPageComponent} from "./shared/pages/contact-page/contact-page.component";

//definición de rutas
const routes: Routes = [
  {
   path:'home',
    component: HomePageComponent,
  },
  {
    path:'about',
    component: AboutPageComponent,
  },
  {
    path:'contac',
    component: ContactPageComponent,
  },
  {
    path:'country',
    loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule)
  },
  {
    path:'**',
    redirectTo: 'country'
  }
  //aca estoy diciendo que cualquier ruta que no esa (home o about),
  //me la regrese al homa
  // {
  //   path:'**',
  //   redirectTo: 'home'
  // },
];

@NgModule({
  imports:[
    RouterModule.forRoot(routes),
  ],
  exports:[
    RouterModule,
  ]
})
export class AppRoutingModule {
}


