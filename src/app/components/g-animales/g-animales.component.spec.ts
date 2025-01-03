import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAnimalesComponent } from './g-animales.component';

describe('GAnimalesComponent', () => {
  let component: GAnimalesComponent;
  let fixture: ComponentFixture<GAnimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GAnimalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
