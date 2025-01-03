import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettiposerviciosComponent } from './dettiposervicios.component';

describe('DettiposerviciosComponent', () => {
  let component: DettiposerviciosComponent;
  let fixture: ComponentFixture<DettiposerviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettiposerviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettiposerviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
