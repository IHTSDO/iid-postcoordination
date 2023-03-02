import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TerminologyService } from '../services/terminology.service';

@Component({
  selector: 'app-odontogram-procedure',
  templateUrl: './odontogram-procedure.component.html',
  styleUrls: ['./odontogram-procedure.component.css']
})
export class OdontogramProcedureComponent implements OnInit {

  @Output() closeToUserForm = new EventEmitter<string>();

  teeth: any[] = [];
  filteredTeeth: any[] = [];
  selectedTooth: any;

  procedures: any[] = [];
  filteredProcedures: any[] = [];
  selectedProcedure: any;

  morphologies: any[] = [];
  filteredMorphologies: any[] = [];
  selectedMorphology: any;

  substances: any[] = [];
  selectedSubstance: any;

  statuses: any[] = [];
  selectedStatus: any;

  closeToUserFormRoot = "129125009 |Procedure with explicit context (situation)|";
  closeToUserFormForDisplay = "Close to user form:   " + this.closeToUserFormRoot;
  associatedProcedure = "363589002 |Associated procedure|";
  directDevice = "363699004 |Direct device|";
  directMorphology = "363700003 |Direct morphology|";
  procedureSite = "363704007 |Procedure site|";
  usingSubstance = "424361007 |Using substance|";
  procedureContext = "408730004 |Procedure context| ";

  constructor(private terminologyService: TerminologyService) { }

  ngOnInit(): void {
    this.terminologyService.expandValueSet('(^ 721145008 |Odontogram reference set| AND < 38199008 |Tooth structure (body structure)| )','',0,100).subscribe((data: any) => {
      this.teeth = data.expansion?.contains;
      this.filteredTeeth = this.teeth;
      // sort by display name
      this.teeth.sort((a, b) => a.display.localeCompare(b.display));
    });
    this.terminologyService.expandValueSet('(^ 721145008 |Odontogram reference set| AND < 71388002 |Procedure (procedure)|)','',0,100).subscribe((data: any) => {
      this.procedures = data.expansion?.contains;
      // sort by display name
      this.procedures.sort((a, b) => a.display.localeCompare(b.display));
      this.filteredProcedures = this.procedures;
    });
    this.terminologyService.expandValueSet('( ^ 721145008 |Odontogram refset| AND << 49755003 |Morphologically abnormal structure (morphologic abnormality)| )','',0,100).subscribe((data: any) => {
      this.morphologies = data.expansion?.contains;
      // sort by display name
      this.morphologies.sort((a, b) => a.display.localeCompare(b.display));
      this.filteredMorphologies = this.morphologies;
    });
    this.terminologyService.expandValueSet('(^ 721145008 |Odontogram reference set| AND < 105590001 |Substance (substance)| )','',0,100).subscribe((data: any) => {
      this.substances = data.expansion?.contains;
      // sort by display name
      this.substances.sort((a, b) => a.display.localeCompare(b.display));
    });
    this.terminologyService.expandValueSet('( ^ 721145008 |Odontogram reference set| AND < 288532009 |Context values for actions (qualifier value)| )','',0,100).subscribe((data: any) => {
      this.statuses = data.expansion?.contains;
      // sort by display name
      this.statuses.sort((a, b) => a.display.localeCompare(b.display));
    });
  }

  clean() {
    this.selectedTooth = undefined;
    this.selectedProcedure = undefined;
    this.selectedMorphology = undefined;
    this.selectedSubstance = undefined;
    this.selectedStatus = undefined;
    this.closeToUserFormForDisplay = "Close to user form:   " + this.closeToUserFormRoot;
    this.closeToUserForm.emit(this.closeToUserFormRoot);
  }

  // generateCloseToUserForm() {
  //   let form = this.closeToUserFormRoot + " : {\n";
  //   const fields = [
  //     {
  //       name: this.associatedProcedure,
  //       value: this.selectedProcedure,
  //     },
  //     {
  //       name: this.procedureSite,
  //       value: this.selectedTooth,
  //     },
  //     {
  //       name: this.directMorphology,
  //       value: this.selectedMorphology,
  //     },
  //     {
  //       name: this.usingSubstance,
  //       value: this.selectedSubstance,
  //     },
  //     {
  //       name: this.procedureContext,
  //       value: this.selectedStatus,
  //     },
  //     {
  //       name: '408732007 |Subject relationship context|',
  //       value: { code: '410604004', display: 'Subject of record'}
  //     },
  //     {
  //       name: '408731000 |Temporal context|',
  //       value: { code: '410512000', display: 'Current or specified time'}
  //     }
  //   ];

  //   fields.forEach((field) => {
  //     if (field.value) {
  //       if (!form.endsWith(": {\n")) {
  //         form += " ,\n";
  //       }
  //       form += `\t${ field.name } = ${ field.value.code } |${ field.value.display }|`;
  //     }
  //   });


  //   if (form.endsWith(": {\n")) {
  //     form = form.slice(0, -4);
  //   }
  //   form = form + " }";
  //   form = "=== " + form;
  //   this.closeToUserFormForDisplay = `Close to user form: ${ form }`;
  //   this.closeToUserForm.emit(form);
  // }
  generateCloseToUserForm() {
    let form = this.closeToUserFormRoot + " :\n";
    if (this.selectedProcedure) {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + this.associatedProcedure + " = " + this.selectedProcedure.code + " |" + this.selectedProcedure.display + "|: {\n";
      if (this.selectedTooth) {
        if (!form.endsWith(" {\n")) {
          form = form + " ,\n";
        }
        form = form + "\t" + this.procedureSite + " = " + this.selectedTooth.code + " |" + this.selectedTooth.display + "|";
      }
      if (this.selectedMorphology) {
        if (!form.endsWith(" {\n")) {
          form = form + " ,\n";
        }
        form = form + "\t" + this.directMorphology + " = " + this.selectedMorphology.code + " |" + this.selectedMorphology.display + "|";
      }
      if (this.selectedSubstance) {
        if (!form.endsWith(" {\n")) {
          form = form + " ,\n";
        }
        form = form + "\t" + this.usingSubstance + " = " + this.selectedSubstance.code + " |" + this.selectedSubstance.display + "|";
      }
      if (form.endsWith(" {")) {
        form = form.substring(0, form.length - 2);
      } else  {
        form = form + "},";
      } 
    }
    if (this.selectedStatus) {
      if (!form.endsWith(":\n")) {
        form = form + " ,\n";
      }
      form = form + "\t" + this.procedureContext + " = " + this.selectedStatus.code + " |" + this.selectedStatus.display + "|";
    }
    if (form.endsWith(":\n")) {
      // remove last 2 characters of the form
      form = form.substring(0, form.length - 2);
    }
    if (form.endsWith("},")) {
      form = form.substring(0, form.length - 1);
    } 
    // update form to add a space before a pipe character only if the previous character is a digit
    form = form.replace(/(\d)\|/g, '$1 |');
    this.closeToUserFormForDisplay = "Close to user form:   " + form;
    this.closeToUserForm.emit(form);
  }

  onKeyTooth(event: any) {
    let filter = event.target.value;
    this.filteredTeeth = this.teeth.filter((tooth) => {
      return tooth.display.toLowerCase().includes(filter.toLowerCase());
    });
  }

  onKeyMorphology(event: any) {
    let filter = event.target.value;
    this.filteredMorphologies = this.morphologies.filter((finding) => {
      return finding.display.toLowerCase().includes(filter.toLowerCase());
    });
  }

  onKeyProcedure(event: any) {
    let filter = event.target.value;
    this.filteredProcedures = this.procedures.filter((finding) => {
      return finding.display.toLowerCase().includes(filter.toLowerCase());
    });
  }

}
