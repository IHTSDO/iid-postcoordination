import { Component, OnInit } from '@angular/core';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-ecl-expand',
  templateUrl: './ecl-expand.component.html',
  styleUrls: ['./ecl-expand.component.css']
})
export class EclExpandComponent implements OnInit {

  expansion: any[] | undefined;
  total: any = 0;
  expansionLength = 0;
  expandUrl = '';
  ecl: string = '';

  loading = false;
  preExpansion: any[] | undefined;
  preTotal: any = 0;
  preExpansionLength = 0;

  posExpansion: any[] | undefined;
  posTotal: any = 0;
  posExpansionLength = 0;


  constructor(public terminologyService: TerminologyService) { }

  ngOnInit(): void {
  }

  loadPage() {
    this.loadExpansion(false);
  }

  loadExpansion(clear: boolean) {
    let offset = this.expansion?.length;
    if (clear) {
      this.expansion = [];
      this.total = '-';
      this.expansionLength = 0;
      offset = 0;
    }
    this.loading = true;
    this.expandUrl = this.terminologyService.getValueSetExpansionUrl(this.ecl, '');
    this.terminologyService.expandValueSet(this.ecl, '', offset, 20).subscribe(response => {
      if (!response.issue) {
        this.expansion = this.expansion?.concat(response.expansion?.contains);
        this.total = response.expansion?.total;
        this.expansionLength = (this.expansion) ? this.expansion.length : 0
      } else {
        this.expansion = [];
        this.total = '-';
        this.expansionLength = 0;
        console.log(response.issue.diagnostics)
      }
      this.preTotal = this.total;
      this.preExpansion = this.expansion;
      this.preExpansionLength = this.expansionLength;
      this.loading = false;
    } );
  }

}