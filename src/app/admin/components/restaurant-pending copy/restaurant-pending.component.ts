import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-pending',
  templateUrl: './restaurant-pending.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./restaurant-pending.component.scss'],
  providers: [DatePipe]
})
export class RestaurantPendingComponent implements OnInit {
  restaurant?: Restaurant;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const idParam: string | null = this.route.snapshot.paramMap.get('id');
    const id: number | undefined = idParam !== null && !isNaN(+idParam) ? +idParam : undefined;

    if (id === undefined) {
      console.error("ID invalide ou manquant dans l'URL.");
      this.isLoading = false;
      return;
    }

    this.loadRestaurant(id);
  }

  loadRestaurant(id: number): void {
    this.isLoading = true;
    this.restaurantService.getRestaurantById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data: Restaurant) => {
          this.restaurant = data;
        },
        error: (error: any) => {
          console.error("Erreur lors du chargement du restaurant :", error);
        }
      });
  }

  formatDate(date: string | Date | undefined): string | null | undefined {
    if (!date) return undefined;
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  accept(): void {
    if (!this.restaurant) return;
    this.isLoading = true;
    this.restaurantService.updateRestaurantStatus(this.restaurant.id!, 'ACCEPTEE')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updated) => {
          this.restaurant = updated;
        },
        error: (err) => console.error('Erreur lors de l\'acceptation:', err)
      });
  }

  reject(): void {
    if (!this.restaurant) return;
    this.isLoading = true;
    this.restaurantService.updateRestaurantStatus(this.restaurant.id!, 'NON_ACCEPTEE')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updated) => {
          this.restaurant = updated;
        },
        error: (err) => console.error('Erreur lors du rejet:', err)
      });
  }
}
