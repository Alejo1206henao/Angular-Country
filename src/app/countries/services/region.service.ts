import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Region} from "../interface/region.interface";


@Injectable({providedIn: 'root'})
export class RegionService {
  private apiUrl:string = `https://restcountries.com/v3.1`;
  constructor(private httpClient: HttpClient) {
  }
  searchByRegion(reg:string):Observable<Region[]>{
    const url: string = `${this.apiUrl}/region/${reg}`
    return this.httpClient.get<Region[]>(url)
  }

}
