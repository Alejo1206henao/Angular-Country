import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByCapitalPageComponent } from './pages/by-capital-page/by-capital-page.component';
import { ByCountryPageComponent } from './pages/by-country-page/by-country-page.component';
import { ByRegionPageComponent } from './pages/by-region-page/by-region-page.component';
import { CountryPageComponent } from './pages/country-page/country-page.component';
import {CountriesRuotingModule} from "./countries-routing.module";
import {SharedModule} from "../shared/shared.module";
import { CountryTableComponent } from './components/capital-table/country-table.component';
import { CountriesTableComponent } from './components/countries-table/countries-table.component';
import { RegionTableComponent } from './components/region-table/region-table.component';



@NgModule({
  declarations: [
    ByCapitalPageComponent,
    ByCountryPageComponent,
    ByRegionPageComponent,
    CountryPageComponent,
    CountryTableComponent,
    CountriesTableComponent,
    RegionTableComponent
  ],
  imports: [
    CommonModule,
    CountriesRuotingModule,
    SharedModule,
  ]
})
export class CountriesModule { }
