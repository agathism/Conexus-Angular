import { Component, inject, OnInit } from '@angular/core';
import { ResidencesService } from '../../services/residences/residences.service';
import Residence from '../../models/residence.interface';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../services/services/service.service';
import Service from '../../models/service.interface';
import { RoomsService } from '../../services/rooms/rooms.service';
import Room from '../../models/room.interface';
import { ConveniencesService } from '../../services/conveniences/conveniences.service';
import Convenience from '../../models/convenience.interface';
import { ActivatedRoute } from '@angular/router';
import { RulesService } from '../../services/rules/rules.service';
import Rule from '../../models/rule.interface';
import { ResidenceImagesService } from '../../services/residenceImages/residence-images.service';
import ResidenceImage from '../../models/residenceImage.interface';

@Component({
  selector: 'app-residence-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residence-detail.component.html',
  styleUrl: './residence-detail.component.css'
})
export class ResidenceDetailComponent implements OnInit {
  private residencesService = inject(ResidencesService);
  residence!: Residence;
  private serviceService = inject(ServiceService);
  services: Service[] = [];
  private roomsService = inject(RoomsService);
  rooms: Room[] = [];
  private conveniencesService = inject(ConveniencesService);
  conveniences: Convenience[] = [];
  private residenceImagesService = inject(ResidenceImagesService);
  residencesImages: ResidenceImage[] = [];
  private rulesService = inject(RulesService);
  rules: Rule[] = [];
  private route = inject(ActivatedRoute);

  testimoniesCount = 0;
  roomsCount = 0;

    ngOnInit(): void {
    // Récupère l'ID depuis l'URL
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadResidence(id); 
    this.loadServices();
    this.loadRooms();
    this.loadConveniences();
    this.loadRules(); 
    this.loadResidenceImages(); 
  }

  private loadResidence(id: number): void { 
    this.residencesService.getResidenceById(id).subscribe({
      next: (residence) => { 
        this.residence = residence; 
        console.log('✅ Résidence chargée:', this.residence);
      },
      error: (err) => {
        console.error('❌ Erreur Residences API:', err);
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

  private loadRooms(): void {
    this.roomsService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.roomsCount = data.length;
        console.log('✅ Chambres chargés:', this.rooms);
      },
      error: (err) => {
        console.error('❌ Erreur Rooms API:', err);
      }
    });
  }

  private loadResidenceImages(): void {
    this.residenceImagesService.getResidencesImages().subscribe({
      next: (data) => {
        this.residencesImages = data;
        console.log('✅ Photos de résidence chargés:', this.residencesImages);
      },
      error: (err) => {
        console.error('❌ Erreur ResidencesImages API:', err);
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

  private loadRules(): void {
    this.rulesService.getRules().subscribe({
      next: (data) => {
        this.rules = data;
        console.log('✅ Règles chargés:', this.rules);
      },
      error: (err) => {
        console.error('❌ Erreur Rules API:', err);
      }
    });
  }
}
