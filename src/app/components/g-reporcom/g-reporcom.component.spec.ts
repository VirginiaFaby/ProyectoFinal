import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporcomComponent } from './g-reporcom.component';

describe('GReporcomComponent', () => {
  let component: GReporcomComponent;
  let fixture: ComponentFixture<GReporcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporcomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
