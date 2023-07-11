import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {countries} from "../interface/country.interface";
import {catchError, delay, map, Observable, of} from "rxjs";

@Injectable({providedIn: 'root'})
export class countriesService {
  private getCountriesRequest(url:string):Observable<countries[]>{
    return this.httpClient.get<countries[]>( url)
      .pipe( catchError( () => of([]) ),
        delay(2000),
      )
  }

  private apiUrl: string = `https://restcountries.com/v3.1`
  constructor(private httpClient: HttpClient) {
  }
  searchByCountry(termi:string):Observable<countries[]>{
    const url = `${this.apiUrl}/name/${termi}`;
    return this.getCountriesRequest(url);
  }

  searchByCountryByAlphaCode(code: string): Observable<null | countries>{
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.httpClient.get<countries[]>(url).pipe(
      map(countries => countries.length > 0 ? countries[0]: null),
      catchError( () => of(null) )
    );
  }



}

