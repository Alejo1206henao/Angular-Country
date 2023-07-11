import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, map, Observable, of} from "rxjs";
import {capital} from "../interface/capital.interface";

@Injectable({providedIn: 'root'})
export class capitalService {

  private getCountriesRequest(url:string):Observable<capital[]>{
    return this.http.get<capital[]>( url)
    .pipe( catchError( () => of([]) ),
      delay(2000),
    )
  }

  private apiUrl: string = 'https://restcountries.com/v3.1';
  constructor(private http: HttpClient) {
  }
  searchCapital( term:string ) : Observable<capital[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
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
  searchByCountryByAlphaCode(code: string): Observable<null | capital>{
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.http.get<capital[]>(url).pipe(
      map(capital => capital.length > 0 ? capital[0]: null),
      catchError( () => of(null) )
    );
  }



}
