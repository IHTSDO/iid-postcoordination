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
    // let transformed = new ScgHighlightingPipe().transform(input);
    let transformed = this.formatExpression(input);
    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }

  formatExpression(expression: string): string {
    let formatted = expression
    .replace(/\{/g, '\n  {')        // Newline after colon before the first attribute set (with `{}`)
      // .replace(/: \{/g, ':\n  {')        // Newline after colon before the first attribute set (with `{}`)
      // .replace(/, \{/g, ',\n  {')        // Newline before opening each additional attribute set (with `{}`)
      // .replace(/\} ,/g, '},\n  ')        // Newline after closing brace and before commas (with `{}`)
      // .replace(/\{ /g, '{\n    ')        // Newline and indent inside each attribute set (with `{}`)
      // .replace(/\}/g, ' }')              // Keep closing brace on the same line as the last attribute (with `{}`)
      // .replace(/: /g, ':\n  ')           // Newline after the colon for expressions without `{}` as well
      // .replace(/, /g, ',\n  ')           // Newline before each attribute (for both types of expressions)
      // .replace(/ = /g, ' = ');           // Ensure proper spacing around equal signs (for both types)

    return formatted;
  }
  

}
