import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CodingTabsComponent } from './coding-tabs/coding-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BindingComponent } from './binding/binding.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AutocompleteBindingComponent } from './autocomplete-binding/autocomplete-binding.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BindingDetailsComponent } from './binding-details/binding-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DropdownBindingComponent } from './dropdown-binding/dropdown-binding.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PcMainComponent } from './pc-main/pc-main.component';
import { MatCardModule } from '@angular/material/card';
import { RefineTargetComponent } from './refine-target/refine-target.component';
import { ScgHighlightingPipe } from './pipes/scg-highlighting.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { ClinicalViewComponent } from './clinical-view/clinical-view.component';
import { EclExpandComponent } from './ecl-expand/ecl-expand.component';
import { WristFractureComponent } from './wrist-fracture/wrist-fracture.component';
import { OdontogramComponent } from './odontogram/odontogram.component';
import { OdontogramProcedureComponent } from './odontogram-procedure/odontogram-procedure.component';




@NgModule({
  declarations: [
    AppComponent,
    CodingTabsComponent,
    BindingComponent,
    AutocompleteBindingComponent,
    BindingDetailsComponent,
    DropdownBindingComponent,
    PcMainComponent,
    RefineTargetComponent,
    ScgHighlightingPipe,
    ClinicalViewComponent,
    EclExpandComponent,
    WristFractureComponent,
    OdontogramComponent,
    OdontogramProcedureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    ClipboardModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
