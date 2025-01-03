import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTiposerviciosComponent } from './g-tiposervicios.component';

describe('GTiposerviciosComponent', () => {
  let component: GTiposerviciosComponent;
  let fixture: ComponentFixture<GTiposerviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTiposerviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTiposerviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
