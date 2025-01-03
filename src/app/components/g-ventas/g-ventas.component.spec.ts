import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GVentasComponent } from './g-ventas.component';

describe('GVentasComponent', () => {
  let component: GVentasComponent;
  let fixture: ComponentFixture<GVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
