import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GRazasComponent } from './g-razas.component';

describe('GRazasComponent', () => {
  let component: GRazasComponent;
  let fixture: ComponentFixture<GRazasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GRazasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GRazasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
