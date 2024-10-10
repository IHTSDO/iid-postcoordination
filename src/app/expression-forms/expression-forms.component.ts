import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScgHighlightingPipe } from '../pipes/scg-highlighting.pipe';

@Component({
  selector: 'app-expression-forms',
  templateUrl: './expression-forms.component.html',
  styleUrls: ['./expression-forms.component.css']
})
export class ExpressionFormsComponent implements OnInit {

  @Input() closeToUserForm: string = "";
  @Input() classifiableForm: string = "";
  @Input() necessaryNormalForm: string = "";

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getSafeHtml(input: string) {
    let transformed = new ScgHighlightingPipe().transform(input);
    // transformed = transformed.replace(/,/g, ',\n');
    transformed = transformed.replace(/} /g, '}\n');
    transformed = transformed.replace(/},/g, '},\n');
    transformed = transformed.replace(/:/g, ':\n');
    transformed = transformed.replace(/{/g, '\t{'); 
    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }

}
