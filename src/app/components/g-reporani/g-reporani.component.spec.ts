import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporaniComponent } from './g-reporani.component';

describe('GReporaniComponent', () => {
  let component: GReporaniComponent;
  let fixture: ComponentFixture<GReporaniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporaniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
