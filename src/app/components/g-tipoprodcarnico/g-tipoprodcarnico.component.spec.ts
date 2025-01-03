import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GTipoprodcarnicoComponent } from './g-tipoprodcarnico.component';

describe('GTipoprodcarnicoComponent', () => {
  let component: GTipoprodcarnicoComponent;
  let fixture: ComponentFixture<GTipoprodcarnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GTipoprodcarnicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GTipoprodcarnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
