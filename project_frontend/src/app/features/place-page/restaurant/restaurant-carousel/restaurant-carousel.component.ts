import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-restaurant-carousel',
  standalone: true,
  imports: [CommonModule ,RouterModule
  ],
  templateUrl: './restaurant-carousel.component.html',
  styleUrls: ['./restaurant-carousel.component.css']
})
export class RestaurantCarouselComponent implements AfterViewInit {
  @ViewChild('nextBtn', { static: true }) nextBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('prevBtn', { static: true }) prevBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLElement>;

  timeRunning = 600;
  timeAutoNext = 300800;
  runTimeOut: any;
  runNextAuto: any;

  ngAfterViewInit(): void {
    const nextDom = this.nextBtn.nativeElement;
    const prevDom = this.prevBtn.nativeElement;

    const carouselDom = this.carousel.nativeElement;
    const SliderDom = carouselDom.querySelector('.carousel .list') as HTMLElement;
    const thumbnailBorderDom = carouselDom.querySelector('.carousel .thumbnail') as HTMLElement;
    const timeDom = carouselDom.querySelector('.carousel .time');

    let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

    nextDom.onclick = () => this.showSlider('next', SliderDom, thumbnailBorderDom, carouselDom);
    prevDom.onclick = () => this.showSlider('prev', SliderDom, thumbnailBorderDom, carouselDom);

    this.runNextAuto = setTimeout(() => {
      nextDom.click();
    }, this.timeAutoNext);
  }

  showSlider(
    type: 'next' | 'prev',
    SliderDom: HTMLElement,
    thumbnailBorderDom: HTMLElement,
    carouselDom: HTMLElement
  ): void {
    const SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    const thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
      SliderDom.appendChild(SliderItemsDom[0]);
      thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
      carouselDom.classList.add('next');
    } else {
      SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
      thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
      carouselDom.classList.add('prev');
    }

    clearTimeout(this.runTimeOut);
    this.runTimeOut = setTimeout(() => {
      carouselDom.classList.remove('next');
      carouselDom.classList.remove('prev');
    }, this.timeRunning);

    clearTimeout(this.runNextAuto);
    this.runNextAuto = setTimeout(() => {
      this.nextBtn.nativeElement.click();
    }, this.timeAutoNext);
  }
}
