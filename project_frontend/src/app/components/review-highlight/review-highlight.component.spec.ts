import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewHighlightComponent } from './review-highlight.component';

describe('ReviewHighlightComponent', () => {
  let component: ReviewHighlightComponent;
  let fixture: ComponentFixture<ReviewHighlightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewHighlightComponent]
    });
    fixture = TestBed.createComponent(ReviewHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
