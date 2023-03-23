import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-clinical-transformation',
  templateUrl: './clinical-transformation.component.html',
  styleUrls: ['./clinical-transformation.component.css']
})
export class ClinicalTransformationComponent implements OnInit {
  proceduresBinding: any = {
    title: 'Procedure',
    type: 'dropdown',
    ecl: `< 71388002 |Procedure (procedure)|`,
    value: '',
    note: 'Procedure.'
  };

  findingsBinding: any = {
    title: 'Search...',
    type: 'dropdown',
    ecl: `< 404684003 |Clinical finding (finding)|`,
    value: '',
    note: 'Search...'
  };

  binding = this.findingsBinding;

  @Output() closeToUserForm = new EventEmitter<string>();
  closeToUserFormForDisplay = "Close to user form:";

  selectedConcept: any;
  selectedSeverity: any;
  selectedLaterality: any;

  severity: any = {
    title: 'Severity',
    attribute: '246112005 |Severity|',
    range: `<< 272141005 |Severities (qualifier value)|`,
    enabled: true,
    preloadedRange: []
  }

  laterality: any = {
    title: 'Laterality',
    attribute: '272741003 |Laterality|',
    range: `< 182353008 |Side (qualifier value)|`,
    enabled: true,
    preloadedRange: []
  }

  constructor() { }

  ngOnInit(): void {
  }

  clearSelected() {
    this.selectedConcept = null;
    this.selectedSeverity = null;
    this.selectedLaterality = null;
  }

  setSelectedConcept(concept: any) {
    this.clearSelected();
    this.selectedConcept = concept;
    this.generateCloseToUserForm();
  }

  generateCloseToUserForm() {
    let form = '';
    if (this.selectedConcept) {
      form = this.selectedConcept.code + " |" + this.selectedConcept.display + "|";
    }
    if (this.selectedSeverity || this.selectedLaterality) {
      form = form + " :\n";
    }
    if (this.selectedSeverity) {
      form = form + "\t" + this.severity.attribute + " = " + this.selectedSeverity.code + " |" + this.selectedSeverity.display + "|";
    }
    if (this.selectedLaterality) {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + this.laterality.attribute + " = " + this.selectedLaterality.code + " |" + this.selectedLaterality.display + "|";
    }
    // update form to add a space before a pipe character only if the previous character is a digit
    form = form.replace(/(\d)\|/g, '$1 |');
    this.closeToUserFormForDisplay = "Close to user form:   " + form;
    this.closeToUserForm.emit(form);
  }

}
