import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporserfaeComponent } from './g-reporserfae.component';

describe('GReporserfaeComponent', () => {
  let component: GReporserfaeComponent;
  let fixture: ComponentFixture<GReporserfaeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporserfaeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporserfaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
