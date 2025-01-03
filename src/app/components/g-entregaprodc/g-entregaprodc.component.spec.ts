import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GEntregaprodcComponent } from './g-entregaprodc.component';

describe('GEntregaprodcComponent', () => {
  let component: GEntregaprodcComponent;
  let fixture: ComponentFixture<GEntregaprodcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GEntregaprodcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GEntregaprodcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
