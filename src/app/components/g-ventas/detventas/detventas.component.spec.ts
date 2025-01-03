import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetventasComponent } from './detventas.component';

describe('DetventasComponent', () => {
  let component: DetventasComponent;
  let fixture: ComponentFixture<DetventasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetventasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
