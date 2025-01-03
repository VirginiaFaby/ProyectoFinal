import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAsigrolmeComponent } from './g-asigrolme.component';

describe('GAsigrolmeComponent', () => {
  let component: GAsigrolmeComponent;
  let fixture: ComponentFixture<GAsigrolmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GAsigrolmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GAsigrolmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
