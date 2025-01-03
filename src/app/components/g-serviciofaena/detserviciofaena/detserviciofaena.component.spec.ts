import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetserviciofaenaComponent } from './detserviciofaena.component';

describe('DetserviciofaenaComponent', () => {
  let component: DetserviciofaenaComponent;
  let fixture: ComponentFixture<DetserviciofaenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetserviciofaenaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetserviciofaenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
