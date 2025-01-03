import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetpersonasComponent } from './detpersonas.component';

describe('DetpersonasComponent', () => {
  let component: DetpersonasComponent;
  let fixture: ComponentFixture<DetpersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetpersonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetpersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
