import { Component, inject, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitiesService } from '../../services/cities.service';
import { ServiceService } from '../../services/service.service';
import { TestimoniesService } from '../../services/testimonies.service';
import Service from '../../models/service.interface';
import Testimony from '../../models/testimony.interface';
import City from '../../models/city.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private citiesService = inject(CitiesService);
  cities: City[] = [];
  private serviceService = inject(ServiceService);
  services: Service[] = [];
  private testimonyService = inject(TestimoniesService);
  testimonies: Testimony[] = [];

  ngOnInit(): void {
    this.loadServices();
    this.loadTestimonies();
    this.loadCities(); 
  }

  private loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log('✅ Services chargés:', this.services);
      },
      error: (err) => {
        console.error('❌ Erreur Services API:', err);
      }
    });
  } 

  private loadTestimonies(): void {
    this.testimonyService.getTestimonies().subscribe({
      next: (data) => {
        this.testimonies = data;
        console.log('✅ Témoignages chargés:', this.testimonies);
      },
      error: (err) => {
        console.error('❌ Erreur Testimonies API:', err);
      }
    });
  }

  private loadCities(): void {
    this.citiesService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        console.log('✅ Villes chargées:', this.cities);
      },
      error: (err) => {
        console.error('❌ Erreur Cities API:', err);
      }
    });
  }
}