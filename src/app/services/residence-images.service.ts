import { inject, Injectable, OnInit } from '@angular/core';
import ResidenceImage from '../models/residenceImage.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomImagesService implements OnInit {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/residence_images';

  ngOnInit(): void {
  }
  getResidencesImages(): Observable<ResidenceImage[]> {
    return this.httpClient.get<ResidenceImage[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }
}