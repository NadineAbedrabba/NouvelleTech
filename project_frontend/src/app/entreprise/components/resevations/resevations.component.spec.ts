import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResevationsComponent } from './resevations.component';

describe('ResevationsComponent', () => {
  let component: ResevationsComponent;
  let fixture: ComponentFixture<ResevationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResevationsComponent]
    });
    fixture = TestBed.createComponent(ResevationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
