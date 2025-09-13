import { inject, Injectable} from '@angular/core';
import Residence from '../../models/residence.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import SearchFilters from '../../models/searchFilters.interface';
import { UserService } from '../users/user-service';
import ResidenceCreation from '../../models/residenceCreation.interface';

@Injectable({
  providedIn: 'root'
})
export class ResidencesService{
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);
  private apiUrl = 'http://127.0.0.1:8000/api/residences';
  private myResidenceUrl = 'http://127.0.0.1:8000/api/my-residences'

  // Headers par défaut
  private readonly defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  getResidences(): Observable<Residence[]> {
    return this.httpClient.get<Residence[]>(this.apiUrl, {
      headers: { 'accept': 'application/json' }
    });
  }

  // Permet de récupérer les résidences dont je suis propriétaires
  getMyResidences(): Observable<Residence[]> {
    return this.httpClient.get<Residence[]>(this.myResidenceUrl, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Recherche des résidences avec des filtres
  searchResidences(filters: SearchFilters): Observable<Residence[]> {
    const params = this.buildSearchParams(filters);
    return this.httpClient.get<Residence[]>(this.apiUrl, { 
      params,
      headers: this.defaultHeaders
    }).pipe(
      map(residences => this.transformResidences(residences)),
      catchError(this.handleError)
    );
  }

  // Récupère une résidence par son ID
  getResidenceById(id: number): Observable<Residence> {
    return this.httpClient.get<Residence>(`${this.apiUrl}/${id}`, {
      headers: this.defaultHeaders
    }).pipe(
      map(residence => this.transformResidence(residence)),
      catchError(this.handleError)
    );
  }

  
  // Créer une nouvelle résidence
  createResidence(residenceData: Partial<ResidenceCreation>): Observable<ResidenceCreation> {
    return this.httpClient.post<ResidenceCreation>(this.apiUrl, residenceData, {
      headers: this.userService.getAuthHeaders()
    })
  }

  // Modifier une résidence existante
  updateResidence(id: number, residenceData: Partial<Residence>): Observable<Residence> {
    return this.httpClient.put<Residence>(`${this.apiUrl}/${id}`, residenceData, {
      headers: this.userService.getAuthHeaders()
    })
  }

  // Supprimer une résidence
  deleteResidence(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.userService.getAuthHeaders()
    })
  }

  // Construction des paramètres de recherche
  private buildSearchParams(filters: SearchFilters): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (this.isValidFilterValue(value)) {
        // si le champ est "city", on le transforme en "city.name"
        if (key === 'city') {
          params = params.set('city.name', value.toString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });
    return params;
  }

  // Vérifie si une valeur de filtre est valide
  private isValidFilterValue(value: any): boolean {
    return value !== null && 
           value !== undefined && 
           value !== '' && 
           !(typeof value === 'string' && value.trim() === '');
  }

  // Transformation des données de résidences (conversion des dates, etc.)
  private transformResidences(residences: any[]): Residence[] {
    return residences.map(residence => this.transformResidence(residence));
  }

  // Transformation d'une résidence individuelle
  private transformResidence(residence: any): Residence {
    return {
      ...residence,
      // Conversion des dates si elles sont en string
      createdAt: residence.createdAt ? new Date(residence.createdAt) : new Date(),
      // Conversion des nombres
      amountShowers: Number(residence.amountShowers) || 0,
      monthlyPrice: Number(residence.monthlyPrice) || 0,
      surface: Number(residence.surface) || 0
    };
  }

  // Gestion centralisée des erreurs
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 404:
          errorMessage = 'Résidences non trouvées';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;
      }
    }

    console.error('❌ Erreur API Residences:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}   