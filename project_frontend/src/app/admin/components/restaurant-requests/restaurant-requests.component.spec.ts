import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantRequestsComponent } from './restaurant-requests.component';

describe('RestaurantRequestsComponent', () => {
  let component: RestaurantRequestsComponent;
  let fixture: ComponentFixture<RestaurantRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
