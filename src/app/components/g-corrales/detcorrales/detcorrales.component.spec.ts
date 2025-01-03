import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetcorralesComponent } from './detcorrales.component';

describe('DetcorralesComponent', () => {
  let component: DetcorralesComponent;
  let fixture: ComponentFixture<DetcorralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetcorralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetcorralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
