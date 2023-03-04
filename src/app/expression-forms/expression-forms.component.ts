import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScgHighlightingPipe } from '../pipes/scg-highlighting.pipe';

@Component({
  selector: 'app-expression-forms',
  templateUrl: './expression-forms.component.html',
  styleUrls: ['./expression-forms.component.css']
})
export class ExpressionFormsComponent implements OnInit {

  @Input() classifiableForm: string = "";
  @Input() necessaryNormalForm: string = "";

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getSafeHtml(input: string) {
    const transformed = new ScgHighlightingPipe().transform(input);
    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }

}
