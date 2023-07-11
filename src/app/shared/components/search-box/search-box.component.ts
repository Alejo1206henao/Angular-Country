import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {debounceTime, Subject} from "rxjs";

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
})

export class SearchBoxComponent implements OnInit{

  //es un tipo especial del observable
  private debounce: Subject<string> = new Subject<string>();

  @Input()
  public placeHolder: string = '';
  //estoy creaando un evento que me emita un string
  @Output()
  public onValue : EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onDebounce : EventEmitter<string> = new EventEmitter<string>();

  ngOnInit():void {
    this.debounce
      .pipe(
        debounceTime(600)
      )
      .subscribe(value => {
      this.onDebounce.emit(value)
    })
  }

  //estoy creando un metodo que es el que voy a enviar al searchoBox
  //atraves de lo que me traiga el onValue, me lo almanece en un valor
  emitValue(value:string):void{
    this.onValue.emit(value);
  }

  onKeyPress(searchTime:string):void{
    this.debounce.next(searchTime)
    return;
  }

}
