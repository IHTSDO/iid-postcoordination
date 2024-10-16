import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackAlertComponent } from '../alerts/snack-alert';
import { ScgHighlightingPipe } from '../pipes/scg-highlighting.pipe';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-clinical-view',
  templateUrl: './clinical-view.component.html',
  styleUrls: ['./clinical-view.component.css']
})
export class ClinicalViewComponent implements OnInit {

  bones: any[] = [
    { code: "75129005", display: "Bone structure of distal radius (body structure)", attribute: "363698007 |Finding site (attribute)|" },
    { code: "21754008", display: "Structure of styloid process of radius (body structure)", attribute: "363698007 |Finding site (attribute)|" },
    { code: "91361004", display: "Structure of styloid process of ulna (body structure)", attribute: "363698007 |Finding site (attribute)|" },
    { code: "30518006", display: "Bone structure of scaphoid (body structure)", attribute: "363698007 |Finding site (attribute)|" },
  ]

  displacementMorphs: any[] = [
    { code: "42164003", display: "Posterior displacement (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "76093008", display: "Anterior displacement (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "87642003", display: "Dislocation (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
  ]

  fractureMorphs: any[] = [
    { code: "52329006", display: "Fracture, open (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "20946005", display: "Fracture, closed (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "134317008", display: "Linear fracture (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "13321001", display: "Fracture, comminuted (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
    { code: "442085002", display: "Greenstick fracture (morphologic abnormality)", attribute: "116676008 |Associated morphology (attribute)|" },
  ]

  fracture = "116676008 |Associated morphology (attribute)| = 72704001 |Fracture (morphologic abnormality)|";

  closeToUserFormRoot = "125605004 |Fracture of bone (disorder)|";
  closeToUserForm = this.closeToUserFormRoot;
  selectedBone: any;
  selectedDisplacementMorph: any;
  selectedFractureMorph: any;
  selectedFractureMorph2: any;
  ecl: string = "";

  equivalentConcept: any;

  loadingPatch = false;
  classifiableForm = "";
  necessaryNormalForm = "";

  constructor(private sanitizer: DomSanitizer, private terminologyService: TerminologyService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  clean() {
    this.selectedBone = undefined;
    this.selectedDisplacementMorph = undefined;
    this.selectedFractureMorph = undefined;
    this.selectedFractureMorph2 = undefined;
    this.ecl = "";
    this.equivalentConcept = undefined;
    this.generateCloseToUserForm();
  }

  generateCloseToUserForm() {
    let form = this.closeToUserFormRoot + ":";
    const components = [];
    if (this.selectedBone) {
      components.push(
        `${this.selectedBone.attribute} = ${this.selectedBone.code} |${this.selectedBone.display}|`
      );
    }
    if (this.selectedFractureMorph) {
      components.push(
        `${this.selectedFractureMorph.attribute} = ${this.selectedFractureMorph.code} |${this.selectedFractureMorph.display}|`
      );
    }
    if (this.selectedDisplacementMorph) {
      components.push(
        `${this.selectedDisplacementMorph.attribute} = ${this.selectedDisplacementMorph.code} |${this.selectedDisplacementMorph.display}|`
      );
    }
    if (components.length > 0) {
      form += " " + components.join(", ");
    }
    form = form.replace(/(\d)\|/g, "$1 |");
    form = form.replace(/\n/g, "");
    return form;
  }
  
  

  updateCuf(form: string) {
    form = form.replace(/\n/g, " ");
    form = form.replace(/\s\s+/g, ' ');
    this.closeToUserForm = form;
    this.necessaryNormalForm = "";
    this.classifiableForm = "";
  }

  save() {
    if (this.closeToUserForm) {
      this.ecl = "<< " + this.closeToUserForm;;
      this.loadingPatch = true;
      this.classifiableForm = "";
      this.terminologyService.addPostcoordinatedExpression(this.closeToUserForm).subscribe((data: any) => {
        if (data?.concept?.length > 0) {
          this._snackBar.openFromComponent(SnackAlertComponent, {
            duration: 5 * 1000,
            data: "Success: Expression saved in Expressions Repository",
            panelClass: ['green-snackbar']
          });
          data?.concept[0].property?.forEach((property: any) => {
            if (property.code === 'humanReadableClassifiableForm') {
              this.classifiableForm = property.valueString;
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

