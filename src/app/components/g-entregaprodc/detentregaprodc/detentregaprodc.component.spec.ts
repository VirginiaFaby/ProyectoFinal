import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetentregaprodcComponent } from './detentregaprodc.component';

describe('DetentregaprodcComponent', () => {
  let component: DetentregaprodcComponent;
  let fixture: ComponentFixture<DetentregaprodcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetentregaprodcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetentregaprodcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
