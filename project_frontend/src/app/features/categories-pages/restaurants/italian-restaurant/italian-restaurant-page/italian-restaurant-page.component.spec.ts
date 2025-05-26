import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItalianRestaurantPageComponent } from './italian-restaurant-page.component';

describe('ItalianRestaurantPageComponent', () => {
  let component: ItalianRestaurantPageComponent;
  let fixture: ComponentFixture<ItalianRestaurantPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItalianRestaurantPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItalianRestaurantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
