import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcMainComponent } from './pc-main.component';

describe('PcMainComponent', () => {
  let component: PcMainComponent;
  let fixture: ComponentFixture<PcMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
