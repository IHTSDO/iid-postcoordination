import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorComponent } from '../alerts/http-error';
import { SnackAlertComponent } from '../alerts/snack-alert';

@Injectable({
  providedIn: 'root'
})
export class TerminologyService {

  snowstormFhirBase = 'https://snowstorm.ihtsdotools.org/fhir';
  defaultFhirUrlParam = 'http://snomed.info/sct'; // 'http://snomed.info/sct/11000221109/version/20211130'
  fhirUrlParam = this.defaultFhirUrlParam;
  lang = 'en';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }

  setSnowstormFhirBase(url: string) {
    this.snowstormFhirBase = url;
  }
  
  setFhirUrlParam(url: string) {
    this.fhirUrlParam = url;
  }

  setLang(lang: string) {
    this.lang = lang;
  }

  getCodeSystems() {
    let requestUrl = `${this.snowstormFhirBase}/CodeSystem`;
    return this.http.get<any>(requestUrl)
      .pipe(
        catchError(this.handleError<any>('getCodeSystems', {}))
      );
  }

  getValueSetExpansionUrl(ecl: string, terms: string, offset?: number, count?:number) {
    if (!offset) offset = 0;
    if (!count) count = 20;
    if (typeof terms != 'string') {
      terms = '';
    }
    return `${this.snowstormFhirBase}/ValueSet/$expand?url=${this.fhirUrlParam}?fhir_vs=ecl/${encodeURIComponent(ecl)}&count=${count}&offset=${offset}&filter=${terms}&language=${this.lang}`;
  }

  expandValueSet(ecl: string, terms: string, offset?: number, count?:number): Observable<any> {
    let requestUrl = this.getValueSetExpansionUrl(ecl, terms, offset, count);
    return this.http.get<any>(requestUrl)
      .pipe(
        catchError(this.handleError<any>('expandValueSet', {}))
      );
  }

  expandValueSetFromServer(fhirBase: string, fhirUrl: string, ecl: string, terms: string, offset?: number, count?:number): Observable<any> {
    if (!offset) offset = 0;
    if (!count) count = 20;
    if (!fhirBase) fhirBase = this.snowstormFhirBase;
    if (!fhirUrl) fhirUrl = this.fhirUrlParam;
    if (typeof terms != 'string') {
      terms = '';
    }
    let requestUrl = `${fhirBase}/ValueSet/$expand?url=${fhirUrl}?fhir_vs=ecl/${encodeURIComponent(ecl)}&count=${count}&offset=${offset}&filter=${terms}&language=${this.lang}`;
    return this.http.get<any>(requestUrl)
      .pipe(
        catchError(this.handleError<any>('expandValueSet', {}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("There was an error!");
      console.log(error);
      this._snackBar.openFromComponent(SnackAlertComponent, {
        duration: 5 * 1000,
        data: error.message,
        panelClass: ['red-snackbar']
      });
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      // console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  lookupConcept(conceptId: string) {
    // https://dev-is-browser.ihtsdotools.org/fhir/CodeSystem/$lookup?system=http://snomed.info/sct&code=313307000
    let requestUrl = `${this.snowstormFhirBase}/CodeSystem/$lookup?system=http://snomed.info/sct&code=${conceptId}&property=normalForm`;
    return this.http.get<any>(requestUrl)
      .pipe(
        catchError(this.handleError<any>('lookupConcept', {}))
      );
  }

  getMRCMAttributes(conceptId: string) {
    // https://snowstorm.ihtsdotools.org/snowstorm/snomed-ct/mrcm/MAIN/domain-attributes?parentIds=195967001&proximalPrimitiveModeling=false&contentType=POSTCOORDINATED
    let requestUrl = `${this.snowstormFhirBase.replace('fhir','snowstorm/snomed-ct')}mrcm/MAIN/domain-attributes?parentIds=${conceptId}&proximalPrimitiveModeling=false&contentType=POSTCOORDINATED`;
    return this.http.get<any>(requestUrl)
    .pipe(
      catchError(this.handleError<any>('getMRCMAttributes', {}))
    );
  }

  addPostcoordinatedExpression(expression: string) {
    let requestUrl = `${this.snowstormFhirBase}/CodeSystem/sct_11000003104_EXP`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/fhir+json'
      })
    };
    return this.http.patch<any>(requestUrl, [ { op: "add", path: "/concept", value: { code: expression } } ], httpOptions)
    .pipe(
      catchError(this.handleError<any>('addPostcoordinatedExpression', {}))
    );
  }
}
