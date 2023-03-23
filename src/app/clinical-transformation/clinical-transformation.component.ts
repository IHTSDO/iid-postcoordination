import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TerminologyService } from '../services/terminology.service';

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
  @Output() save = new EventEmitter<string>();
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

  mild = {
    code: '255604002',
    display: 'Mild'
  }
  moderate = {
    code: '6736007',
    display: 'Moderate'
  }
  severe = {
    code: '24484000',
    display: 'Severe'
  }

  laterality: any = {
    title: 'Laterality',
    attribute: '272741003 |Laterality|',
    range: `< 182353008 |Side (qualifier value)|`,
    enabled: true,
    preloadedRange: []
  }

  right: any = {
    code: '24028007',
    display: 'Right'
  }
  left: any = {
    code: '7771000',
    display: 'Left'
  }
  bilateral: any = {
    code: '51440002',
    display: 'Bilateral'
  }

  lateralizable = false;
  allowsSeverity = false;
  loading = false;

  constructor(private terminologyService: TerminologyService) { }

  ngOnInit(): void {
  }

  clearSelected() {
    this.selectedConcept = null;
    this.selectedSeverity = null;
    this.selectedLaterality = null;
    this.lateralizable = false;
    this.closeToUserFormForDisplay = "Close to user form:";
    this.closeToUserForm.emit('');
  }

  setSelectedConcept(concept: any) {
    this.clearSelected();
    this.selectedConcept = concept;
    this.generateCloseToUserForm();
    this.checkLaterality(concept);
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

  async checkLaterality(concept: any) {
    this.loading = true;
    this.lateralizable = false;
    let lateralizableTmp = true;
    this.terminologyService.lookupConcept(concept.code).subscribe((data: any) => {
      let normalForm = '';
      data.parameter.forEach((param: any) => {
        if (param.name === 'property') {
          if (param.part[0].valueString === 'normalForm') {
            normalForm = param.part[1].valueString;
          }
        }
      });
      // The refinement is the rest of the string in normalForm after the symbol ':'
      let refinement = normalForm.split(':')[1];
      // the groups are all the substrings enclosed in {}
      let groups = refinement?.match(/{(.*?)}/g);
      // the attributes are all the substrings og the groups split by commas, as a single array
      let attributes = groups?.map((group: string) => group.split(/(?<=\|),/gm)).flat();
      // remove all the curly braces and trim the strings
      attributes = attributes?.map((attribute: string) => attribute.replace(/{|}/g, '').trim());
      if (attributes) {
        attributes?.forEach(async (attribute: string) => {
          let attType = attribute.split('=')[0].trim();
          let attTypeCode = attType.split('|')[0].trim();
          // Disables laterality and severity if they are already present in the refinement
          if (attTypeCode === '246112005') {
            this.allowsSeverity = false;
          } else if (attTypeCode === '272741003') {
            lateralizableTmp = false;
          }
          if (lateralizableTmp) {
            const lateralizableFindingsQuery = '<< 404684003 |Clinical finding (finding)| : << 363698007 |Finding site (attribute)| = ^723264001 |Lateralizable body structure reference set (foundation metadata concept)|';
            const lateralizableProceduresQuery = '<< 71388002 |Procedure (procedure)| : << 363704007 |Procedure site (attribute)| = ^723264001 |Lateralizable body structure reference set (foundation metadata concept)|';
            let latQuery = lateralizableFindingsQuery;
            let isLateralizable = await this.terminologyService.expandValueSet(latQuery, concept.code,0,1).toPromise();
            lateralizableTmp = isLateralizable?.expansion?.total === 1;
          }
          this.loading = false;
          this.lateralizable = lateralizableTmp;
        });
      } else {
        this.loading = false;
      }
    });
  }

  saveExpression() {
    this.save.emit(Date.now().toString());
  }

}
