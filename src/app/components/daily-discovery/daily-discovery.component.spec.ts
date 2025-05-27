import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDiscoveryComponent } from './daily-discovery.component';

describe('DailyDiscoveryComponent', () => {
  let component: DailyDiscoveryComponent;
  let fixture: ComponentFixture<DailyDiscoveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDiscoveryComponent]
    });
    fixture = TestBed.createComponent(DailyDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
