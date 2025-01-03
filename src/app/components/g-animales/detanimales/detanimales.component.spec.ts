import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetanimalesComponent } from './detanimales.component';

describe('DetanimalesComponent', () => {
  let component: DetanimalesComponent;
  let fixture: ComponentFixture<DetanimalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetanimalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetanimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
