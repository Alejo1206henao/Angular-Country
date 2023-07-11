import { Component } from '@angular/core';
import {capitalService} from "../../services/capital.service";
import {capital} from "../../interface/capital.interface";


@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {

  public isLoading: boolean = false;
  public countryes: capital[] = [];
  constructor(private countriesService : capitalService) {
  }
  searchByCapital(term:string):void{

    this.isLoading = true;

    this.countriesService.searchCapital(term).subscribe(
      countryes => {
        this.countryes = countryes;
        this.isLoading = false;
      }
    )
  }

}
