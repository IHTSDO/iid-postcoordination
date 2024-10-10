import { Component, Input, OnInit } from '@angular/core';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-ecl-expand',
  templateUrl: './ecl-expand.component.html',
  styleUrls: ['./ecl-expand.component.css']
})
export class EclExpandComponent implements OnInit {

  @Input() ecl: string = '';
  @Input() equivalentConcept: any = {};

  expansion: any[] | undefined;
  total: any = 0;
  expansionLength = 0;
  expandUrl = '';
  // ecl: string = '';

  loading = false;
  preExpansion: any[] | undefined;
  preTotal: any = 0;
  preExpansionLength = 0;

  constructor(public terminologyService: TerminologyService) { }

  ngOnInit(): void {
  }

  // On equivalentConcept change, lookup concept
  ngOnChanges() {
    if (this.equivalentConcept?.code) {
      this.terminologyService.lookupConcept(this.equivalentConcept.code).subscribe(response => {
        if (!response.issue) {
          // get the display name from the object response.parameter where name = "display"
          this.equivalentConcept.display = response.parameter.find((p: any) => p.name === 'display')?.valueString;
        } else {
          console.log(response.issue.diagnostics)
        }
      });
    }
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
    // this.expandUrl = this.terminologyService.getValueSetExpansionUrl(this.ecl, '');
    this.terminologyService.expandValueSetFromServer('', 'http://snomed.info/xsct/11000003104', this.ecl, '', offset, 20).subscribe(response => {
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
      // Set preExpansionLength to the length of the preExpansion array or total, whichever is lowest
      this.preExpansionLength = (this.preExpansion) ? Math.min(this.preExpansion.length, this.preTotal) : 0;
      this.loading = false;
    } );
  }

}
