import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-italian-restaurant-carousel',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './italian-restaurant-carousel.component.html',
  styleUrls: ['./italian-restaurant-carousel.component.css']
})
export class ItalianRestaurantCarouselComponent implements AfterViewInit {

  images!: NodeListOf<HTMLImageElement>; // Déclaration sans initialisation

  ngAfterViewInit(): void {
    // Assurez-vous que le DOM est chargé avant d'initialiser `images`
    this.images = document.querySelectorAll(".carousel img") as NodeListOf<HTMLImageElement>;
    let index = 0;

    const nextImage = () => {
      this.images[index].classList.remove("active");
      index = (index + 1) % this.images.length;
      this.images[index].classList.add("active");
    };

    setInterval(nextImage, 4000); // Changement d'image toutes les 4 secondes
  }
  }