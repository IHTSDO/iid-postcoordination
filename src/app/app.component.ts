import { Component, OnInit } from '@angular/core';
import { CodingSpecService } from './services/coding-spec.service';
import { TerminologyService } from './services/terminology.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-coding-demo-template';
  bindingsForExport: any[] = [];
  editions: any[] = [];
  editionsDetails: any[] = [];
  languages = ['be', 'en', 'es', 'fr', 'no'];
  selectedEdition = 'Edition';
  selectedLanguage = 'en';
  fhirServers = [
    { name: "SNOMED Dev IS", url: "https://dev-is-browser.ihtsdotools.org/fhir"},
    { name: "SNOMED Public", url: "https://snowstorm.ihtsdotools.org/snowstorm/snomed-ct/fhir"},
    { name: "SNOMED Public", url: "https://snowstorm-temp.kaicode.io/fhir"},

  ];
  selectedServer = this.fhirServers[2];

  constructor( private codingSpecService: CodingSpecService, private terminologyService: TerminologyService ) { }

  ngOnInit(): void {
    this.setFhirServer(this.selectedServer);
    this.bindingsForExport = [];
    let spec: any[] = this.codingSpecService.getCodingSpec();
    for (const section of spec) {
      for (const binding of section.bindings) {
        this.bindingsForExport.push({ section: section.title, title: binding.title, ecl: binding.ecl.replace(/\s\s+/g, ' ') })
      }
    }
    this.updateCodeSystemOptions();
  }

  updateCodeSystemOptions() {
    this.terminologyService.getCodeSystems().subscribe(response => {
      this.editionsDetails = [];
      this.editions = response.entry;
      let editionNames = new Set();
      this.editions.forEach(loopEdition => {
        if (loopEdition.resource.title) {
          const loopName = loopEdition.resource.title.substr(0,loopEdition.resource.title.lastIndexOf(' ')).trim();
          if (loopName) {
            editionNames.add(loopName);
          }
        }
      });
      editionNames.forEach(editionName => {
        this.editionsDetails.push(
          {
            editionName: editionName,
            editions: this.editions.filter( el => (el.resource.title?.includes(editionName))).sort( this.compare )
          }
        );
      });
      const currentVerIndex = this.editionsDetails.findIndex(x => (x.editionName === 'International Edition SNOMED CT release' || x.editionName === 'International'));
      if (currentVerIndex >= 0) {
        this.setEdition(this.editionsDetails[currentVerIndex].editions[0]);
      } else {
        this.setEdition(this.editions[0]);
      }
    });
  }

  compare( a: any, b: any ) {
    if ( a.resource.date < b.resource.date ){
      return 1;
    }
    if ( a.resource.date > b.resource.date ){
      return -1;
    }
    return 0;
  }

  setFhirServer(server: any) {
    this.selectedServer = server;
    this.terminologyService.setSnowstormFhirBase(server.url);
    this.selectedEdition = 'Edition';
    this.editions = [];
    this.editionsDetails = [];
    this.updateCodeSystemOptions();
  }

  setEdition(edition: any) {
    this.selectedEdition = edition.resource.title?.replace('SNOMED CT release ','');
    this.terminologyService.setFhirUrlParam(edition.resource.version);
  }

  setLanguage(language: string) {
    this.selectedLanguage = language;
    this.terminologyService.setLang(language);
  }
}
