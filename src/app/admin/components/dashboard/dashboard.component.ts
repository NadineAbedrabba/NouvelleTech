import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';

Chart.register(...registerables);

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgApexchartsModule],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements AfterViewInit {
  public cuisineChartOptions: ChartOptions;

  constructor() {
    this.cuisineChartOptions = {
      series: [35, 25, 20, 20],
      chart: {
        type: 'donut',
        height: 300
      },
      labels: ["TUNISIENNE", "Italienne", "Japonaise", "Autre"],
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



  private initRatingChart(): void {
    const ratingCtx = document.getElementById('ratingChart') as HTMLCanvasElement;
    if (ratingCtx) {
        new Chart(ratingCtx.getContext('2d')!, {
            type: 'bar',
            data: {
                labels: ['1 étoile', '2 étoiles', '3 étoiles', '4 étoiles', '5 étoiles'],
                datasets: [{
                   
                    data: [2, 2, 3, 4, 3], // Modifiez ces valeurs selon vos données réelles
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(54, 162, 235, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Répartition des restaurants par note'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                          
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Notes'
                        }
                    }
                }
            }
        });
    }
}
  

  ngAfterViewInit(): void {
    const cuisineCtx = document.getElementById('cuisineChart') as HTMLCanvasElement;
    if (cuisineCtx) {
      new Chart(cuisineCtx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: ['TUNISIENNE', 'Chinoise', 'Française', 'Mexicaine', 'Japonaise'],
          datasets: [{
          
            data: [8, 2, 3, 1, 1],
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
          plugins: {
            legend: {
              display: false // <-- Masque la légende
            }
          },
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
          
        }
      });
    }
    this.initReservationsChart();
    this.initStatusChart();
    this.initRatingChart();
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
            data: [3, 5, 4, 5, 5, 6, 7, 8, 9, 10, 8, 5],
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
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              
            },
            x: {
              grid: {
                display: false
              }
            }
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
            data: [20, 5, 2],
            backgroundColor: [
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              display: false
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  }
}
