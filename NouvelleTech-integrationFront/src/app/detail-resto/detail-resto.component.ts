import { Component, OnInit } from '@angular/core';
import { RestaurantDetailsComponent } from '../admin/components/restaurant-details/restaurant-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-detail-resto',
  standalone: true,
  imports: [RestaurantDetailsComponent , ],
  templateUrl: './detail-resto.component.html',
  styleUrls: ['./detail-resto.component.css']
})
export class DetailRestoComponent implements OnInit{
  restaurant: any;

  constructor(private route: ActivatedRoute, private router: Router , private restaurantService :RestaurantService) {}
  restaurantId!: string;

 ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id')!;
  }

 
  openReservationForm() {
    this.router.navigate(['/reserver'], { queryParams: { id: this.restaurantId } });
  }
}
