import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { INEOAPI, INEO } from './data.interface';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = environment.nasaApiKey;
  // private apiAPODUrl = `https://api.nasa.gov/planetary/apod?api_key=${this.apiKey}`;
  private apiNEOUrl = `https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false&api_key=${this.apiKey}`;

  constructor(
    private data: DataService,
    private http: HttpClient
  ) { }

  getNEOToday$(): Observable<INEO> {
    return this.http.get<INEOAPI>(this.apiNEOUrl).pipe(
      map(res => {
        // do transformations to normalize data
      }),
      tap(neo => this.data.updateNEO(neo)),
      catchError((err, caught) => this.onError(err, caught))
    );
  }

  private onError(err: HttpErrorResponse | any, caught) {
    let errorMsg = 'Error: unable to complete request.';
    if (err instanceof HttpErrorResponse) {
      errorMsg = err.message;
    }
    this.data.error(errorMsg);
    return throwError(errorMsg);
  }
}
