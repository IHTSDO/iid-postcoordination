import { Component, Input, OnInit } from '@angular/core';
import { TerminologyService } from '../services/terminology.service';
import { FormControl } from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap,tap} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BindingDetailsComponent } from '../binding-details/binding-details.component';

@Component({
  selector: 'app-autocomplete-binding',
  templateUrl: './autocomplete-binding.component.html',
  styleUrls: ['./autocomplete-binding.component.css']
})
export class AutocompleteBindingComponent implements OnInit {
  formControl = new FormControl();
  autoFilter: Observable<any> | undefined;
  @Input() binding: any;
  loading = false;

  constructor(private terminologyService: TerminologyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.autoFilter = this.formControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>  {
        this.loading = true;
        let response = this.terminologyService.expandValueSet(this.binding.ecl, term)
        return response;
      }),
      tap(data => {
        this.loading = false;
      })
    );  
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BindingDetailsComponent, {
      height: '90%',
      width: '70%',
      data: this.binding
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

}