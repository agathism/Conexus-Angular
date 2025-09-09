import { Component, inject, OnInit } from '@angular/core';
import { ResidencesService } from '../../services/residences/residences.service';
import Residence from '../../models/residence.interface';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../services/services/service.service';
import Service from '../../models/service.interface';
import { TestimoniesService } from '../../services/testimonies/testimonies.service';
import Testimony from '../../models/testimony.interface';
import { RoomsService } from '../../services/rooms/rooms.service';
import Room from '../../models/room.interface';
import { ConveniencesService } from '../../services/conveniences/conveniences.service';
import Convenience from '../../models/convenience.interface';

@Component({
  selector: 'app-residence-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residence-detail.component.html',
  styleUrl: './residence-detail.component.css'
})
export class ResidenceDetailComponent implements OnInit {
  private residencesService = inject(ResidencesService);
  residences: Residence[] = [];
  private serviceService = inject(ServiceService);
  services: Service[] = [];
  private testimonyService = inject(TestimoniesService);
  testimonies: Testimony[] = [];
  private roomsService = inject(RoomsService);
  rooms: Room[] = [];
  private conveniencesService = inject(ConveniencesService);
  conveniences: Convenience[] = [];

    ngOnInit(): void {
    this.loadResidence(889); 
    this.loadServices();
    this.loadTestimonies();
    this.loadRooms();
    this.loadConveniences();
    // this.loadCities(); // A faire aussi
  }

  private loadResidence(id: number): void {
    this.residencesService.getResidenceById(id).subscribe({
    next: (data) => { 
      this.residences = [data];
      console.log('✅ Résidence chargée:', this.residences);
    },
      error: (err) => {
        console.error('❌ Erreur Services API:', err);
      }
    });
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

  private loadRooms(): void {
    this.roomsService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        console.log('✅ Chambres chargés:', this.rooms);
      },
      error: (err) => {
        console.error('❌ Erreur Rooms API:', err);
      }
    });
  }

  private loadConveniences(): void {
    this.conveniencesService.getConveniences().subscribe({
      next: (data) => {
        this.conveniences = data;
        console.log('✅ Commodités chargés:', this.conveniences);
      },
      error: (err) => {
        console.error('❌ Erreur Conveniences API:', err);
      }
    });
  }
}
