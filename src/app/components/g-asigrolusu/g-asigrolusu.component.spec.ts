import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GAsigrolusuComponent } from './g-asigrolusu.component';

describe('GAsigrolusuComponent', () => {
  let component: GAsigrolusuComponent;
  let fixture: ComponentFixture<GAsigrolusuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GAsigrolusuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GAsigrolusuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
