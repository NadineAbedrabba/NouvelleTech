import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeSplitComponent } from './creative-split.component';

describe('CreativeSplitComponent', () => {
  let component: CreativeSplitComponent;
  let fixture: ComponentFixture<CreativeSplitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreativeSplitComponent]
    });
    fixture = TestBed.createComponent(CreativeSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
