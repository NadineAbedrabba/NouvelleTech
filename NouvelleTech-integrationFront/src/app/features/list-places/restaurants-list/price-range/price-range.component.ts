import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-range',
  standalone: true,
  templateUrl: './price-range.component.html',
  styleUrls: ['./price-range.component.css']
})
export class PriceRangeComponent implements AfterViewInit {
  @ViewChild('rangeSlider') rangeSlider!: ElementRef;
  @ViewChild('rangeValues') rangeValues!: ElementRef;

  @Output() priceRangeChanged = new EventEmitter<[number, number]>(); // <-- ici

  ngAfterViewInit(): void {
    const sliders = this.rangeSlider.nativeElement.querySelectorAll('.range-input') as NodeListOf<HTMLInputElement>;

    sliders.forEach((slider: HTMLInputElement) => {
      if (slider.type === 'range') {
        slider.oninput = () => this.getVals();
      }
    });

    this.getVals(); // Initialisation
  }

  getVals(): void {
    const sliders = this.rangeSlider.nativeElement.querySelectorAll('.range-input') as NodeListOf<HTMLInputElement>;
    let slide1 = parseFloat(sliders[0].value);
    let slide2 = parseFloat(sliders[1].value);

    if (slide1 > slide2) {
      [slide1, slide2] = [slide2, slide1];
    }

    this.rangeValues.nativeElement.innerHTML = `${slide1}&nbsp;DT - ${slide2}&nbsp;DT`;

    this.priceRangeChanged.emit([slide1, slide2]); // <-- émettre au parent
 
 
  }

  emitFixedRange(min: number, max: number): void {
    this.priceRangeChanged.emit([min, max]);
  }
}
