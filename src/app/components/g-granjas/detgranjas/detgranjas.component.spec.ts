import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetgranjasComponent } from './detgranjas.component';

describe('DetgranjasComponent', () => {
  let component: DetgranjasComponent;
  let fixture: ComponentFixture<DetgranjasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetgranjasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetgranjasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
