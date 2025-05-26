import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit {

  // Exemple de restaurants en Tunisie avec leurs coordonnées géographiques
  restaurants = [
    { name: 'Restaurant Tunis', lat: 36.81897, lng: 10.16579 },
    { name: 'Restaurant Sousse', lat: 35.8256, lng: 10.6367 },
    { name: 'Restaurant Djerba', lat: 33.8792, lng: 10.8574 },
    { name: 'Restaurant Hammamet', lat: 36.411, lng: 10.6112 },
    { name: 'Restaurant Sfax', lat: 34.7401, lng: 10.7603 }
  ];

  ngOnInit() {
    // Création de la carte avec le centre de la Tunisie
    const map = L.map('map').setView([33.8869, 9.5375], 7);

    // Charger les tuiles de la carte (OpenStreetMap)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '' // On désactive l'attribution ici
    }).addTo(map);

    // Supprimer l'attribution "Leaflet" à partir de la carte
    map.attributionControl.setPrefix(''); // Enlève le texte "Leaflet"
    
    // Ajouter des marqueurs pour chaque restaurant
    this.restaurants.forEach(restaurant => {
      const marker = L.marker([restaurant.lat, restaurant.lng]).addTo(map);

      // Ajouter une popup pour chaque restaurant
      marker.bindPopup(`
        <b>${restaurant.name}</b>
        <br>Latitude: ${restaurant.lat}
        <br>Longitude: ${restaurant.lng}
      `);

      // Zoomer de manière fluide sur le marqueur lors du clic
      marker.on('click', () => {
        map.flyTo([restaurant.lat, restaurant.lng], 13, {
          animate: true,
          duration: 1.0
        });
      });
    });
  }
}
