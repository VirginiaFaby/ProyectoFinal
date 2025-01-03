import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GServiciofaenaComponent } from './g-serviciofaena.component';

describe('GServiciofaenaComponent', () => {
  let component: GServiciofaenaComponent;
  let fixture: ComponentFixture<GServiciofaenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GServiciofaenaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GServiciofaenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
