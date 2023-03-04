import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionFormsComponent } from './expression-forms.component';

describe('ExpressionFormsComponent', () => {
  let component: ExpressionFormsComponent;
  let fixture: ComponentFixture<ExpressionFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
