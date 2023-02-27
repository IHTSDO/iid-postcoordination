import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EclExpandComponent } from './ecl-expand.component';

describe('EclExpandComponent', () => {
  let component: EclExpandComponent;
  let fixture: ComponentFixture<EclExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EclExpandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EclExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
