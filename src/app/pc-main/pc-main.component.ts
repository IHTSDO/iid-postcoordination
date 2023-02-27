import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ScgHighlightingPipe } from '../pipes/scg-highlighting.pipe';
import { RefineTargetComponent } from '../refine-target/refine-target.component';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-pc-main',
  templateUrl: './pc-main.component.html',
  styleUrls: ['./pc-main.component.css']
})
export class PcMainComponent implements OnInit {

  binding: any = {
    title: 'Clinical finding',
    type: 'dropdown',
    ecl: `< 404684003 |Clinical finding (finding)|`,
    value: '',
    note: 'Clinical finding.'
  };

  selectedConcept: any;
  selectedSeverity: any;
  selectedLaterality: any;
  selectedQualifications: any[] = [];
  closeToUserForm = "";
  classifiableForm = "";

  addOptions: any[] = [];
  refineOptions: any[] = [];

  loadingPcOptions = false;

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
    range: `<< 182353008 |Side (qualifier value)|`,
    enabled: true,
    preloadedRange: []
  }

  mrcmAttributes: any = {};
  loadingMrcmAttributes = false;

  constructor(private terminologyService: TerminologyService, public dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.terminologyService.expandValueSet(this.severity.range,'').subscribe((data: any) => {
      this.severity.preloadedRange = data.expansion?.contains;
    });
    this.terminologyService.expandValueSet(this.laterality.range,'').subscribe((data: any) => {
      this.laterality.preloadedRange = data.expansion?.contains;
    });
  }

  getSafeHtml(input: string) {
    const transformed = new ScgHighlightingPipe().transform(input);
    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }

  setSeverity(severity: any) {
    this.selectedSeverity = severity;
    this.generateCloseToUserForm();
  }

  setLaterality(laterality: any) {
    this.selectedLaterality = laterality;
    this.generateCloseToUserForm();
  }

  setSelectedConcept(concept: any) {
    this.closeToUserForm = "";
    this.classifiableForm = "";
    this.addOptions = [];
    this.refineOptions = [];
    this.selectedConcept = concept;
    this.selectedLaterality = null;
    this.selectedSeverity = null;
    this.selectedQualifications = [];
    this.generatePostcoordinationOptions(concept);
    this.generateCloseToUserForm();
  }

  generateCloseToUserForm() {
    let form = '';
    if (this.selectedConcept) {
      form = this.selectedConcept.code + " |" + this.selectedConcept.display + "|";
    }
    if (this.selectedSeverity || this.selectedLaterality || this.selectedQualifications.length > 0) {
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
    this.selectedQualifications.forEach((qualification: any) => {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + qualification.attribute + " = " + qualification.code + " |" + qualification.display + "|";
    });
    // update form to add a space before a pipe character only if the previous character is a digit
    form = form.replace(/(\d)\|/g, '$1 |');

    this.closeToUserForm = form;
  }

  openMrcmDialog(attribute: any): void {
    let refBinding: any = {
      title: attribute.fsn.term,
      type: 'dropdown',
      ecl: attribute.attributeRange[0]?.rangeConstraint,
      value: '',
      note: '',
      attribute: { attribute: attribute.idAndFsnTerm }
    };
    refBinding.attribute.attribute = refBinding.attribute.attribute.replace(/\| (.*) \|/g, '|$1|');
    const dialogRef = this.dialog.open(RefineTargetComponent, {
      height: '90%',
      width: '70%',
      data: refBinding
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // remove element from selectedQualifications that matches the same attribute.attribute
        this.selectedQualifications = this.selectedQualifications.filter((qualification: any) => qualification.attribute !== result.attribute?.attribute);

        this.selectedQualifications.push({attribute: result.attribute?.attribute, display: result.display, code: result.code});
        this.generateCloseToUserForm();
      }
    });
  }

  openPcDialog(attribute: any): void {
    let refBinding: any = {
      title: attribute.title,
      type: 'dropdown',
      ecl: attribute.range,
      value: '',
      note: '',
      attribute: attribute
    };
    const dialogRef = this.dialog.open(RefineTargetComponent, {
      height: '90%',
      width: '70%',
      data: refBinding
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // remove element from selectedQualifications that matches the same attribute.attribute
        this.selectedQualifications = this.selectedQualifications.filter((qualification: any) => qualification.attribute !== result.attribute?.attribute);

        this.selectedQualifications.push({attribute: result.attribute?.attribute, display: result.display, code: result.code});
        this.generateCloseToUserForm();
      }
    });
  }

  async generatePostcoordinationOptions(concept: any) {
    // We assume it's a clinical finding
    this.addOptions = [];
    this.refineOptions = [];
    this.mrcmAttributes = {};
    this.loadingPcOptions = true;
    this.loadingMrcmAttributes = true;
    this.terminologyService.getMRCMAttributes(concept.code).subscribe((data: any) => {
      this.mrcmAttributes = data;
      // sort this.mrcmAttributes.items by fsn.term
      this.mrcmAttributes.items.sort((a: any, b: any) => a.fsn.term.localeCompare(b.fsn.term));
      this.loadingMrcmAttributes = false;
    });
    this.terminologyService.lookupConcept(concept.code).subscribe((data: any) => {
      let normalForm = '';
      data.parameter.forEach((param: any) => {
        if (param.name === 'property') {
          if (param.part[0].valueString === 'normalForm') {
            normalForm = param.part[1].valueString;
          }
        }
      });
      this.addOptions = [ this.severity, this.laterality ];
      // The refinement is the rest of the string in normalForm after the symbol ':'
      let refinement = normalForm.split(':')[1];
      // the groups are all the substrings enclosed in {}
      let groups = refinement.match(/{(.*?)}/g);
      // the attributes are all the substrings og the groups split by commas, as a single array
      let attributes = groups?.map((group: string) => group.split(/(?<=\|),/gm)).flat();
      // remove all the curly braces and trim the strings
      attributes = attributes?.map((attribute: string) => attribute.replace(/{|}/g, '').trim());
      this.severity.enabled = true;
      this.laterality.enabled = true;
      attributes?.forEach(async (attribute: string) => {
        let attType = attribute.split('=')[0].trim();
        let attTypeCode = attType.split('|')[0].trim();
        // Disables laterality and severity if they are already present in the refinement
        if (attTypeCode === '246112005') {
          this.severity.enabled = false;
        } else if (attTypeCode === '272741003') {
          this.laterality.enabled = false;
        }
        let isLateralizable = await this.terminologyService.expandValueSet(
          '<< 404684003 |Clinical finding (finding)| : << 363698007 |Finding site (attribute)| = ^723264001 |Lateralizable body structure reference set (foundation metadata concept)|',
          concept.code,0,1).toPromise();
          this.laterality.enabled = isLateralizable?.expansion?.total === 1;
        let attTypeDisplay = attType.split('|')[1].trim();
        let attTypeDisplayNoSemtag = attTypeDisplay.substring(0, attTypeDisplay.indexOf('(')-1).trim();
        let attValue = attribute.split('=')[1].trim();
        let attValueCode = attValue.split('|')[0].trim();
        let attValueDisplay = attValue.split('|')[1].trim();
        let attValueDisplayNoSemtag = attValueDisplay.substring(0, attValueDisplay.indexOf('(')-1).trim();
        this.refineOptions.push({
          title: attTypeDisplayNoSemtag + ' → ' + attValueDisplayNoSemtag,
          attribute: attType,
          range: "<< " + attValue
        });
        this.addOptions = [ this.severity, this.laterality ];
        // Remove duplicate objects in refineOptions
        this.refineOptions = this.refineOptions.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i);
        this.loadingPcOptions = false;
      });
    });
  }

}

// let attributes = groups?.map((group: any) => {
//   return group.split(',');
// });