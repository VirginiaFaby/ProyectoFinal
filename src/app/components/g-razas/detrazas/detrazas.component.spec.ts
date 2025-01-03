import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetrazasComponent } from './detrazas.component';

describe('DetrazasComponent', () => {
  let component: DetrazasComponent;
  let fixture: ComponentFixture<DetrazasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetrazasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetrazasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
