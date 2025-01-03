import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettipoprodcarnicoComponent } from './dettipoprodcarnico.component';

describe('DettipoprodcarnicoComponent', () => {
  let component: DettipoprodcarnicoComponent;
  let fixture: ComponentFixture<DettipoprodcarnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DettipoprodcarnicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DettipoprodcarnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
