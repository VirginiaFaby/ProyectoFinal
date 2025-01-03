import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAsigmeproComponent } from './g-asigmepro.component';

describe('GAsigmeproComponent', () => {
  let component: GAsigmeproComponent;
  let fixture: ComponentFixture<GAsigmeproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GAsigmeproComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GAsigmeproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
