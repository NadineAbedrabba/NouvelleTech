import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeaturesComponent } from './app-features.component';

describe('AppFeaturesComponent', () => {
  let component: AppFeaturesComponent;
  let fixture: ComponentFixture<AppFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppFeaturesComponent]
    });
    fixture = TestBed.createComponent(AppFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
