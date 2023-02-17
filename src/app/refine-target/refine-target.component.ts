import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-refine-target',
  templateUrl: './refine-target.component.html',
  styleUrls: ['./refine-target.component.css']
})
export class RefineTargetComponent implements OnInit {

  formControl = new FormControl();
  autoFilter: Observable<any> | undefined;
  expansion: any[] | undefined;
  total: any;
  loading = false;
  expandUrl = '';
  expansionLength = 0;
  firstTime = true;

  constructor(
    public dialogRef: MatDialogRef<RefineTargetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public terminologyService: TerminologyService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(item: any): void {
    this.dialogRef.close({...item, ...this.data});
  }

  ngOnInit(): void {
    this.autoFilter = this.formControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) =>  {
        if (term?.length > 2 || this.firstTime) {
          this.firstTime = false;
          this.loading = true;
          let response = this.terminologyService.expandValueSet(this.data.ecl, term);
          return response;
        } else {
          return of([]);
        }
      }),
      tap(data => {
        this.total = data?.expansion?.total;
        this.expansionLength = data?.expansion?.contains?.length;
        this.loading = false;
      })
    );  
  }

}
