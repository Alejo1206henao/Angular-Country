import { Component } from '@angular/core';
import {Region} from "../../interface/region.interface";
import {RegionService} from "../../services/region.service";

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {

  public regions: Region[] = [];

  constructor( private regionService: RegionService) {}

  searchByRegion(reg:string){
    this.regionService.searchByRegion(reg).
    subscribe(region => {
      this.regions = region;
    })
  }


}
