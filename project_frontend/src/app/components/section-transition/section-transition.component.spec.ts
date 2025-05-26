import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTransitionComponent } from './section-transition.component';

describe('SectionTransitionComponent', () => {
  let component: SectionTransitionComponent;
  let fixture: ComponentFixture<SectionTransitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionTransitionComponent]
    });
    fixture = TestBed.createComponent(SectionTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
