import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalFormsTabsComponent } from './clinical-forms-tabs.component';

describe('ClinicalFormsTabsComponent', () => {
  let component: ClinicalFormsTabsComponent;
  let fixture: ComponentFixture<ClinicalFormsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalFormsTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalFormsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
