import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, observable, Observable, of} from "rxjs";
import {country} from "../interface/country.interface";

@Injectable({providedIn: 'root'})
export class capitalsService {

  private apiUrl: string = 'https://restcountries.com/v3.1';
  constructor(private http: HttpClient) {
  }

  searchCapital( term:string ) : Observable<country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.http.get<country[]>( url)
      // .pipe(
      // catchError( error => {
      //   console.log('Error');
      //   return of([])
      // })


      //los tap me sirve para traer en cadena todo lo que tiene el arreglo directamente desde el servicio
      //y el map arreglos vacion
      // tap (contries => console.log('operador paso por aca1', contries)),
      // map(contries =>[] )
    // );
  }

}
