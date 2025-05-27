import { Component } from '@angular/core';
import { RestaurantDetailsComponent } from '../admin/components/restaurant-details/restaurant-details.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-resto',
  standalone: true,
  imports: [RestaurantDetailsComponent , ],
  templateUrl: './detail-resto.component.html',
  styleUrls: ['./detail-resto.component.css']
})
export class DetailRestoComponent {
  restaurant: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      if (id) {
        // Normalement tu appellerais un service ici :
        // this.restaurantService.getById(id).subscribe(...)
        // Pour tester, tu peux juste créer un faux resto :
        this.restaurant = {
          id,
          name: 'Mock Resto #' + id
        };
      }
    });
  }

  openReservationForm() {
    // this.router.navigate(['/reservation'], {
    //   queryParams: { companyId: this.restaurant.id }
    // });
  }
}
