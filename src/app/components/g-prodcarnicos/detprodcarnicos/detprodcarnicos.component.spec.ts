import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetprodcarnicosComponent } from './detprodcarnicos.component';

describe('DetprodcarnicosComponent', () => {
  let component: DetprodcarnicosComponent;
  let fixture: ComponentFixture<DetprodcarnicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetprodcarnicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetprodcarnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
