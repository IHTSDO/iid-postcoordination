import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WristFractureComponent } from './wrist-fracture.component';

describe('WristFractureComponent', () => {
  let component: WristFractureComponent;
  let fixture: ComponentFixture<WristFractureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WristFractureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WristFractureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
