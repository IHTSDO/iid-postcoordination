import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wrist-fracture',
  templateUrl: './wrist-fracture.component.html',
  styleUrls: ['./wrist-fracture.component.css']
})
export class WristFractureComponent implements OnInit {

  @Output() closeToUserForm = new EventEmitter<string>();

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

  closeToUserFormRoot = "125605004 |Fracture of bone (disorder)|";
  selectedBone: any;
  selectedDisplacementMorph: any;
  selectedFractureMorph: any;
  selectedFractureMorph2: any;
  closeToUserFormForDisplay = "Close to user form:   " + this.closeToUserFormRoot;

  constructor() { }

  ngOnInit(): void {
  }

  generateCloseToUserForm() {
    // Create the close to user form
    // Use closeToUserFormRoot for focus concept
    // if selectedBone use selectedBone.code for finding site in a rolegroup with fracture morpohology
    // if selectedFractureMorph replace the code and display in the previous role group
    // if selectedDisplacementMorph add a new rolegroup with the finding site and the displacement morphology

    let form = this.closeToUserFormRoot + ":\n";
    let morph = "125605004 |Fracture of bone (disorder)|";
    let bone = "272673000 |Bone structure (body structure)|";
    let findingSite = "363698007 |Finding site (attribute)|";
    let associatedMorphology = "116676008 |Associated morphology (attribute)|";
    if (this.selectedBone) {
      bone = this.selectedBone.code + " |" + this.selectedBone.display + "|";
    }
    if (this.selectedFractureMorph) {
      morph = this.selectedFractureMorph.code + " |" + this.selectedFractureMorph.display + "|";
    }

    if (this.selectedBone) {
      form = form + "\t{" + this.selectedBone.attribute + " = " + this.selectedBone.code + " |" + this.selectedBone.display + "| ,\n";
      form = form + "\t" + associatedMorphology + " = " + morph + " }";
    }
    if (this.selectedDisplacementMorph) {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t{" + findingSite + " = " + bone + " ,\n";
      form = form + "\t" + this.selectedDisplacementMorph.attribute + " = " + this.selectedDisplacementMorph.code + " |" + this.selectedDisplacementMorph.display + "| }";
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

  clean() {
    this.selectedBone = undefined;
    this.selectedDisplacementMorph = undefined;
    this.selectedFractureMorph = undefined;
    this.selectedFractureMorph2 = undefined;
    this.generateCloseToUserForm();
  }

}
