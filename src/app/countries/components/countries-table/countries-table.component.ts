import {Component, Input} from '@angular/core';
import {countries} from "../../interface/country.interface";

@Component({
  selector: 'countrie-table',
  templateUrl: './countries-table.component.html',
  styles:[
    `img {
      width: 25px;
    }`
  ]
})
export class CountriesTableComponent {
  @Input()
  public country: countries[] = [];
}
