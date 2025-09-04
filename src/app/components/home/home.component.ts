import { Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitiesService } from '../../services/cities.service';
import { ServiceService } from '../../services/service.service';
import Service from '../../models/service.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  cities: CitiesService = inject(CitiesService);
  private serviceService = inject(ServiceService);
  services: Service[] = [];

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log(this.services);
      },
      error: (err) => {
        console.error('Erreur API', err);
      }
    });
  }
}
