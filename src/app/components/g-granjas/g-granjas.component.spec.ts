import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GGranjasComponent } from './g-granjas.component';

describe('GGranjasComponent', () => {
  let component: GGranjasComponent;
  let fixture: ComponentFixture<GGranjasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GGranjasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GGranjasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
