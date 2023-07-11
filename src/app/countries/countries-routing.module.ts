import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CountryPageComponent} from "./pages/country-page/country-page.component";
import {ByCapitalPageComponent} from "./pages/by-capital-page/by-capital-page.component";
import {ByCountryPageComponent} from "./pages/by-country-page/by-country-page.component";
import {ByRegionPageComponent} from "./pages/by-region-page/by-region-page.component";

//Arreglo de rutas

const routes: Routes= [
  {
    path:'by-capital',
    component: ByCapitalPageComponent
  },
  {
    path:'by-country',
    component: ByCountryPageComponent
  },
  {
    path:'by-region',
    component: ByRegionPageComponent
  },
  {
    path:'by/:id',
    component: CountryPageComponent
  },
  {
    path:'**',
    redirectTo: 'by-capital'
  },
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class CountriesRuotingModule { }
