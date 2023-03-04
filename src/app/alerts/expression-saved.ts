import { Component, Inject } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
    selector: 'snack-expression-saved',
    templateUrl: './expression-saved.html',
    styles: [
      `
      .example-alert {
        color: lightgreen;
      }
      .green-snackbar {
        background: #2196F3;
      }
    `,
    ],
  })
  export class ExpressionSavedComponent {
    constructor(
        public sbRef: MatSnackBarRef<ExpressionSavedComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: any
      ) {}
  }