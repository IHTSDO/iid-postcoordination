import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontogramProcedureComponent } from './odontogram-procedure.component';

describe('OdontogramProcedureComponent', () => {
  let component: OdontogramProcedureComponent;
  let fixture: ComponentFixture<OdontogramProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdontogramProcedureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdontogramProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
