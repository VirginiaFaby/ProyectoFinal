import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporguiaComponent } from './g-reporguia.component';

describe('GReporguiaComponent', () => {
  let component: GReporguiaComponent;
  let fixture: ComponentFixture<GReporguiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporguiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporguiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
