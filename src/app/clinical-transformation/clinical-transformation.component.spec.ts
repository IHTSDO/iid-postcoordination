import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTransformationComponent } from './clinical-transformation.component';

describe('ClinicalTransformationComponent', () => {
  let component: ClinicalTransformationComponent;
  let fixture: ComponentFixture<ClinicalTransformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalTransformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTransformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
