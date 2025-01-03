import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GReporserfaaniComponent } from './g-reporserfaani.component';

describe('GReporserfaaniComponent', () => {
  let component: GReporserfaaniComponent;
  let fixture: ComponentFixture<GReporserfaaniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GReporserfaaniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GReporserfaaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
