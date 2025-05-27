import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseLayoutComponent } from './entreprise-layout.component';

describe('EntrepriseLayoutComponent', () => {
  let component: EntrepriseLayoutComponent;
  let fixture: ComponentFixture<EntrepriseLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepriseLayoutComponent]
    });
    fixture = TestBed.createComponent(EntrepriseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
