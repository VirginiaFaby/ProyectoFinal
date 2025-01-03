import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GCorralesComponent } from './g-corrales.component';

describe('GCorralesComponent', () => {
  let component: GCorralesComponent;
  let fixture: ComponentFixture<GCorralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GCorralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GCorralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
