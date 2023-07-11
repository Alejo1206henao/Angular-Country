import { Component } from '@angular/core';
import {countriesService} from "../../services/country.service";
import {countries} from "../../interface/country.interface";

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {

  public country: countries[] = [];
  //es falso por que cuando cargo la pag. no estoy cargando la pog
  public isLoading: boolean = false;


  constructor(private countriesService:countriesService) {
  }
  searchByCountry(term:string):void{

    this.isLoading = true;

    this.countriesService.searchByCountry(term)
      .subscribe(
        country => {
          this.country = country;
          this.isLoading= false;
        }
      )
  }

}
