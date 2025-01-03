import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporvenComponent } from './g-reporven.component';

describe('GReporvenComponent', () => {
  let component: GReporvenComponent;
  let fixture: ComponentFixture<GReporvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporvenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
