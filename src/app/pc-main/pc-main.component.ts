import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ExpressionSavedComponent } from '../alerts/expression-saved';
import { SnackAlertComponent } from '../alerts/snack-alert';
import { ScgHighlightingPipe } from '../pipes/scg-highlighting.pipe';
import { RefineTargetComponent } from '../refine-target/refine-target.component';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-pc-main',
  templateUrl: './pc-main.component.html',
  styleUrls: ['./pc-main.component.css']
})
export class PcMainComponent implements OnInit {

  timestamp: any = Date.now();

  findingsBinding: any = {
    title: 'Clinical finding',
    type: 'dropdown',
    ecl: `< 404684003 |Clinical finding (finding)|`,
    value: '',
    note: 'Clinical finding.'
  };

  proceduresBinding: any = {
    title: 'Procedure',
    type: 'dropdown',
    ecl: `< 71388002 |Procedure (procedure)|`,
    value: '',
    note: 'Procedure.'
  };

  binding = this.findingsBinding;
  selectedBinding: string = "1";

  selectedConcept: any;
  selectedSeverity: any;
  selectedLaterality: any;
  selectedQualifications: any[] = [];
  closeToUserForm = "";
  classifiableForm = "";
  necessaryNormalForm = "";
  ecl: string = "";

  addOptions: any[] = [];
  refineOptions: any[] = [];

  loadingPcOptions = false;
  loadingPatch = false;

  severity: any = {
    title: 'Severity',
    attribute: '246112005 |Severity|',
    range: `<< 272141005 |Severities (qualifier value)|`,
    enabled: false,
    preloadedRange: []
  }

  laterality: any = {
    title: 'Laterality',
    attribute: '272741003 |Laterality|',
    range: `< 182353008 |Side (qualifier value)|`,
    enabled: false,
    preloadedRange: []
  }

  contextAttributes: any[] = [
    {
      title: 'Finding context',
      attribute: '408729009 |Finding context|',
      range: `< 410514004 |Finding context value|`,
      enabled: true,
      hideInBinding: "2",
      preloadedRange: []
    },
    {
      title: 'Procedure context',
      attribute: '408730004 |Procedure context|',
      range: `< 288532009 |Context values for actions (qualifier value)|`,
      enabled: false,
      hideInBinding: "1",
      preloadedRange: []
    },
    {
      title: 'Temporal context',
      attribute: '408731000 |Temporal context|',
      range: `< 410510008 |Temporal context value| `,
      enabled: false,
      preloadedRange: []
    },
    {
      title: 'Subject relationship context',
      attribute: '408732007 |Subject relationship context|',
      range: `< 125676002 |Person|`,
      enabled: false,
      preloadedRange: []
    }
  ];
  selectedContextAttributes: any[] = [];

  mrcmAttributes: any = {};
  otherMrcmAttributes: any = {};
  loadingMrcmAttributes = false;
  selfGroupedIds: any = ['260870009', '363702006', '42752001', '255234002', '288556008', '371881003', '263502005', '726633004'];
  equivalentConcept: any = {};

  constructor(private terminologyService: TerminologyService, public dialog: MatDialog, private sanitizer: DomSanitizer, private _snackBar: MatSnackBar) { }

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

  setBinding() {
    setTimeout(() => {
      if (this.selectedBinding === "1") {
        this.binding = this.findingsBinding;
      } else {
        this.binding = this.proceduresBinding;
      }
      this.clearSelected();
      this.timestamp = Date.now();
    }, 500);
  }

  clearSelected() {
    this.selectedConcept = null;
    this.selectedSeverity = null;
    this.selectedLaterality = null;
    this.selectedQualifications = [];
    this.selectedContextAttributes = [];
    this.closeToUserForm = "";
    this.classifiableForm = "";
    this.necessaryNormalForm = "";
    this.ecl = "";
    this.addOptions = [];
    this.refineOptions = [];
    this.mrcmAttributes = {};
    this.otherMrcmAttributes = {};
    this.equivalentConcept = {};
  }

  clearAll() {
    this.clearSelected();
    this.timestamp = Date.now();
  }

  setSelectedConcept(concept: any) {
    this.clearSelected();
    this.selectedConcept = concept;
    this.generatePostcoordinationOptions(concept);
    this.generateCloseToUserForm();
  }

  generateCloseToUserForm() {
    let form = '';
    if (this.selectedConcept) {
      form = this.selectedConcept.code + " |" + this.selectedConcept.display + "|";
    }
    if (this.selectedSeverity || this.selectedLaterality || this.selectedQualifications.length > 0 || this.selectedContextAttributes.length > 0) {
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
    this.selectedContextAttributes.forEach((contextAttribute: any) => {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + contextAttribute.attribute + " = " + contextAttribute.code + " |" + contextAttribute.display + "|";
    });
    this.selectedQualifications.forEach((qualification: any) => {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + qualification.attribute + " = " + qualification.code + " |" + qualification.display + "|";
    });
    // update form to add a space before a pipe character only if the previous character is a digit
    form = form.replace(/(\d)\|/g, '$1 |');

    this.closeToUserForm = form;
    // this.ecl = "<< " + this.closeToUserForm;
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

  openContextDialog(attribute: any): void {
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
        // remove element from selectedContextAttributes that matches the same attribute.attribute
        this.selectedContextAttributes = this.selectedContextAttributes.filter((qualification: any) => qualification.attribute !== result.attribute?.attribute);
        this.selectedContextAttributes.push({attribute: result.attribute?.attribute, display: result.display, code: result.code});
        this.generateCloseToUserForm();
      }
    });
  }

  async generatePostcoordinationOptions(concept: any) {
    // We assume it's a clinical finding
    this.addOptions = [];
    this.refineOptions = [];
    this.mrcmAttributes = {};
    this.otherMrcmAttributes = {};
    this.loadingPcOptions = true;
    this.loadingMrcmAttributes = true;
    this.terminologyService.getMRCMAttributes(concept.code).subscribe((data: any) => {
      // Separate items into selfGrouped and other attributes, excluding "Is a" attribute (116680003)
      const allItems = (data.items || []).filter((item: any) => item.conceptId !== '116680003' && !item.fsn?.term?.toLowerCase().includes('is a'));
      this.mrcmAttributes = {
        ...data,
        items: allItems.filter((item: any) => this.selfGroupedIds.includes(item.conceptId))
      };
      this.otherMrcmAttributes = {
        ...data,
        items: allItems.filter((item: any) => !this.selfGroupedIds.includes(item.conceptId))
      };
      // sort both by fsn.term
      this.mrcmAttributes.items.sort((a: any, b: any) => a.fsn.term.localeCompare(b.fsn.term));
      this.otherMrcmAttributes.items.sort((a: any, b: any) => a.fsn.term.localeCompare(b.fsn.term));
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
      let groups = refinement?.match(/{(.*?)}/g);
      // the attributes are all the substrings og the groups split by commas, as a single array
      let attributes = groups?.map((group: string) => group.split(/(?<=\|),/gm)).flat();
      // remove all the curly braces and trim the strings
      attributes = attributes?.map((attribute: string) => attribute.replace(/{|}/g, '').trim());
      this.severity.enabled = true;
      this.laterality.enabled = true;
      if (attributes) {
        attributes?.forEach(async (attribute: string) => {
          let attType = attribute.split('=')[0].trim();
          let attTypeCode = attType.split('|')[0].trim();
          // Disables laterality and severity if they are already present in the refinement
          if (attTypeCode === '246112005') {
            this.severity.enabled = false;
          } else if (attTypeCode === '272741003') {
            this.laterality.enabled = false;
          }
          const lateralizableFindingsQuery = '<< 404684003 |Clinical finding (finding)| : << 363698007 |Finding site (attribute)| = ^723264001 |Lateralizable body structure reference set (foundation metadata concept)|';
          const lateralizableProceduresQuery = '<< 71388002 |Procedure (procedure)| : << 363704007 |Procedure site (attribute)| = ^723264001 |Lateralizable body structure reference set (foundation metadata concept)|';
          let latQuery = lateralizableFindingsQuery;
          // Create latQuery variable equals to lateralizableFindingsQuery if selectedBinding == "1" else to lateralizableProceduresQuery
          if (this.selectedBinding == "2") {
            latQuery = lateralizableProceduresQuery;
          }
          let isLateralizable = await this.terminologyService.expandValueSet(latQuery, concept.code,0,1).toPromise();
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
      } else {
        this.loadingPcOptions = false;
      }
      
    });
  }

  save() {
    if (this.closeToUserForm) {
      this.loadingPatch = true;
      this.classifiableForm = "";
      this.terminologyService.addPostcoordinatedExpression(this.closeToUserForm).subscribe(
        (data: any) => {
          if (data?.concept?.length > 0) {
            this._snackBar.openFromComponent(SnackAlertComponent, {
              duration: 5 * 1000,
              data: "Success: Expression saved in Expressions Repository",
              panelClass: ['green-snackbar']
            });
            data?.concept[0].property?.forEach((property: any) => {
              if (property.code === 'humanReadableClassifiableForm') {
                this.classifiableForm = property.valueString;
                // extract first focus concept from classifiableForm, it's the substring before the colon, and after "===", trimmed
                let focusConcept = this.classifiableForm.substring(this.classifiableForm.indexOf('===') + 3, this.classifiableForm.indexOf(':')).trim();
                this.ecl = `<< ${focusConcept}`;
              } else if (property.code === 'humanReadableNecessaryNormalForm') {
                this.necessaryNormalForm = property.valueString;
              } else if (property.code === 'equivalentConcept') {
                this.equivalentConcept = { code: property.valueString, display: '' };
              }
            });
          }
          this.loadingPatch = false;
        });
    }
  }

}
