import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {countriesService} from "../../services/country.service";
import {switchMap} from "rxjs";
import {countries} from "../../interface/country.interface";
import {capital} from "../../interface/capital.interface";
import {Region} from "../../interface/region.interface";
import {capitalService} from "../../services/capital.service";
import {RegionService} from "../../services/region.service";

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent implements OnInit {

  public countries?: countries;
  public capital?: capital;
  public Region?: Region;

  constructor(
    private countriesService:countriesService,
    private capitalService:capitalService,
    private regionService:RegionService,
    private activatedRoute: ActivatedRoute,
    private router: Router, ) {}

  ngOnInit(): void {

    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.countriesService.searchByCountryByAlphaCode(id)),
    ).subscribe(country => {
      if ( !country ){
        return this.router.navigateByUrl('');
      }
       return this.countries = country;
    });

    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.capitalService.searchByCountryByAlphaCode(id)),
    ).subscribe(capital => {
      if ( !capital ){
        return this.router.navigateByUrl('');
      }
      return this.capital = capital;
    });
  }
}
