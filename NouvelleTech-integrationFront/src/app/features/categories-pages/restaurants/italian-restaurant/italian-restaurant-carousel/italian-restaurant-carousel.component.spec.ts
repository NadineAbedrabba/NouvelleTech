import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItalianRestaurantCarouselComponent } from './italian-restaurant-carousel.component';

describe('ItalianRestaurantCarouselComponent', () => {
  let component: ItalianRestaurantCarouselComponent;
  let fixture: ComponentFixture<ItalianRestaurantCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItalianRestaurantCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItalianRestaurantCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
