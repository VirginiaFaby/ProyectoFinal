import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GProdcarnicosComponent } from './g-prodcarnicos.component';

describe('GProdcarnicosComponent', () => {
  let component: GProdcarnicosComponent;
  let fixture: ComponentFixture<GProdcarnicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GProdcarnicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GProdcarnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
