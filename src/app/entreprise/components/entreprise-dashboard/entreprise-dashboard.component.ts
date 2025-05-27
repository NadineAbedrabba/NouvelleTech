import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
};

@Component({
  selector: 'app-entreprise-dashboard',
  templateUrl: './entreprise-dashboard.component.html',
  styleUrls: ['./entreprise-dashboard.component.css'],
  standalone: true,
  imports: [NgApexchartsModule, CommonModule]
})
export class EntrepriseDashboardComponent implements AfterViewInit {
  public cuisineChartOptions: ChartOptions;
  public averageRating: number = 4.23;
  public ratingData = {
    food: 4.5,
    ambiance: 4.3,
    service: 3.8
  };

  constructor() {
    this.cuisineChartOptions = {
      series: [35, 25, 20, 20],
      chart: {
        type: 'donut',
        height: 300
      },
      labels: ["Française", "Italienne", "Japonaise", "Autre"],
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  ngAfterViewInit(): void {
    this.initReservationsChart();
    this.initStatusChart();
    this.initRatingsChart();
    this.initCuisineChart();
  }

  private initReservationsChart(): void {
    const reservationsCtx = document.getElementById('reservationsChart') as HTMLCanvasElement;
    if (reservationsCtx) {
      new Chart(reservationsCtx.getContext('2d')!, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          datasets: [{
            label: 'Réservations',
            data: [5, 6, 7, 8, 8, 9, 5, 8, 7, 10, 11, 12],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  private initStatusChart(): void {
    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (statusCtx) {
      new Chart(statusCtx.getContext('2d')!, {
        type: 'doughnut',
        data: {
          labels: ['Approuvées', 'En attente', 'Rejetées'],
          datasets: [{
            data: [15, 3, 2],
            backgroundColor: ['rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { display: false } },
          animation: { animateScale: true, animateRotate: true }
        }
      });
    }
  }

  private initRatingsChart(): void {
    const ratingsCtx = document.getElementById('ratingsChart') as HTMLCanvasElement;
    if (ratingsCtx) {
      new Chart(ratingsCtx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: ['Nourriture', 'Ambiance', 'Service'],
          datasets: [{
            label: 'Moyenne',
            data: [this.ratingData.food, this.ratingData.ambiance, this.ratingData.service],
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(245, 158, 11, 0.7)'
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)'
            ],
            borderWidth: 1,
            barPercentage: 0.6 // Contrôle la largeur des barres
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value;
                }
              },
              grid: {
                display: true
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw}/5`
              }
            }
          }
        }
      });
    }
  }
  private initCuisineChart(): void {
    const cuisineCtx = document.getElementById('cuisineChart') as HTMLCanvasElement;
    if (cuisineCtx) {
      new Chart(cuisineCtx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: ['Italienne', 'Chinoise', 'Française', 'Mexicaine', 'Japonaise'],
          datasets: [{
            label: 'Nombre de restaurants',
            data: [30, 25, 15, 20, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }
}