import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-odontogram',
  templateUrl: './odontogram.component.html',
  styleUrls: ['./odontogram.component.css']
})
export class OdontogramComponent implements OnInit {

  @Output() closeToUserForm = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();

  teeth: any[] = [];
  filteredTeeth: any[] = [];
  selectedTooth: any;

  toothSurfaces: any[] = [];
  selectedToothSurfaces: any[] = [];

  toothFindings: any[] = [];
  filteredToothFindings: any[] = [];
  selectedToothFinding: any;

  closeToUserFormRoot = "278544002 |Tooth finding (finding)| ";
  findingSite = "363698007 |Finding site (attribute)|"
  closeToUserFormForDisplay = "Close to user form:   " + this.closeToUserFormRoot;

  constructor(private terminologyService: TerminologyService) { }

  ngOnInit(): void {
    this.terminologyService.expandValueSet('(< 38199008 |Tooth structure (body structure)| AND ^721145008 |Odontogram reference set (foundation metadata concept)|) MINUS (<< 302214001 |Entire tooth (body structure)| OR <<410613002 |Tooth part (body structure)|)','',0,100).subscribe((data: any) => {
      this.teeth = data.expansion?.contains;
      this.filteredTeeth = this.teeth;
      // sort by display name
      this.teeth.sort((a, b) => a.display.localeCompare(b.display));
    });
    this.terminologyService.expandValueSet('(< 245643006 |Structure of tooth surface (body structure)| AND ^721145008 |Odontogram reference set (foundation metadata concept)|) MINUS (<< 85077000 |Tooth root structure (body structure)|)','',0,100).subscribe((data: any) => {
      this.toothSurfaces = data.expansion?.contains;
      // sort by display name
      this.toothSurfaces.sort((a, b) => a.display.localeCompare(b.display));
    });
    this.terminologyService.expandValueSet('(< 278544002 |Tooth finding (finding)| AND ^721145008 |Odontogram reference set (foundation metadata concept)|)','',0,100).subscribe((data: any) => {
      this.toothFindings = data.expansion?.contains;
      // sort by display name
      this.toothFindings.sort((a, b) => a.display.localeCompare(b.display));
      this.filteredToothFindings = this.toothFindings;
    });
  }

  clean() {
    this.selectedTooth = undefined;
    this.selectedToothSurfaces = [];
    this.selectedToothFinding = undefined;
    this.filteredTeeth = this.teeth;
    this.filteredToothFindings = this.toothFindings;
  }

  generateCloseToUserForm() {
    let form = this.closeToUserFormRoot + " :\n";
    if (this.selectedToothFinding) {
      form = this.selectedToothFinding.code + " |" + this.selectedToothFinding.display + "|" + " :\n";
    }
    if (this.selectedTooth) {
      form = form + "\t" + this.findingSite + " = " + this.selectedTooth.code + " |" + this.selectedTooth.display + "|";
    }
    
    console.log(this.selectedToothSurfaces)
    if (this.selectedToothSurfaces.length > 0) {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      this.selectedToothSurfaces.forEach((surface, index) => {
        form = form + "\t" + this.findingSite + " = " + surface.code + " |" + surface.display + "|";
        if (index < this.selectedToothSurfaces.length - 1) {
          form = form + " ,\n";
        }
      });
      // form = form + "\t" + this.findingSite + " = " + this.selectedToothSurface.code + " |" + this.selectedToothSurface.display + "|";
    }
    if (form.endsWith(":\n")) {
      // remove last 2 characters of the form
      form = form.substring(0, form.length - 2);
    }
    // update form to add a space before a pipe character only if the previous character is a digit
    form = form.replace(/(\d)\|/g, '$1 |');
    this.closeToUserFormForDisplay = "Close to user form:   " + form;
    this.closeToUserForm.emit(form);
  }

  onCheckboxChange(event: MatCheckboxChange, item: string) {
    if (event.checked) {
      this.selectedToothSurfaces.push(item);
    } else {
      const index = this.selectedToothSurfaces.indexOf(item);
      if (index >= 0) {
        this.selectedToothSurfaces.splice(index, 1);
      }
    }
    this.generateCloseToUserForm();
  }

  onToothChange(value: any) {
    if (typeof value === 'string') {
      this.selectedTooth = undefined;
      this.filteredTeeth = this.filterByMultiPrefix(this.teeth, value);
      return;
    }
    this.filteredTeeth = this.teeth;
    this.generateCloseToUserForm();
  }

  onToothFindingChange(value: any) {
    if (typeof value === 'string') {
      this.selectedToothFinding = undefined;
      this.filteredToothFindings = this.filterByMultiPrefix(this.toothFindings, value);
      return;
    }
    this.filteredToothFindings = this.toothFindings;
    this.generateCloseToUserForm();
  }

  displayConcept(option: any): string {
    return option?.display || '';
  }

  private filterByMultiPrefix(source: any[], query: string): any[] {
    const normalizedQuery = (query || '').toLowerCase().trim();
    if (!normalizedQuery) {
      return source;
    }
    const prefixes = normalizedQuery.split(/\s+/).filter(Boolean);
    return source.filter((item) => {
      const words = (item?.display || '').toLowerCase().split(/[\s\-_/]+/).filter(Boolean);
      return prefixes.every((prefix) => words.some((word: string) => word.startsWith(prefix)));
    });
  }

  saveExpression() {
    this.save.emit(Date.now().toString());
  }

}
