import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRestoComponent } from './detail-resto.component';

describe('DetailRestoComponent', () => {
  let component: DetailRestoComponent;
  let fixture: ComponentFixture<DetailRestoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailRestoComponent]
    });
    fixture = TestBed.createComponent(DetailRestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
