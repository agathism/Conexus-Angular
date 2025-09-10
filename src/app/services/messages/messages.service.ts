import { Injectable} from '@angular/core';
import Message from '../../models/message.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { UserService } from '../users/user-service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService{
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private httpClient: HttpClient,
    private userService: UserService  // Injection de votre service User
  ) {}

  // Récupère les headers avec le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken(); // Votre méthode existante
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Vérifie si l'utilisateur est connecté
  private checkAuthentication(): boolean {
    if (!this.userService.isAuthenticated()) {
      console.error('Utilisateur non authentifié');
      return false;
    }
    return true;
  }

  // Tous mes messages
  getMyMessages(): Observable<Message[]> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    return this.httpClient.get<Message[]>(`${this.apiUrl}/my-messages`, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Messages que j'ai envoyés
  getMySentMessages(): Observable<Message[]> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    return this.httpClient.get<Message[]>(`${this.apiUrl}/my-messages/sent`, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Messages que j'ai reçus
  getMyReceivedMessages(): Observable<Message[]> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    return this.httpClient.get<Message[]>(`${this.apiUrl}/my-messages/received`, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Conversation avec un utilisateur spécifique
  getConversation(otherUserId: string): Observable<Message[]> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    return this.httpClient.get<Message[]>(`${this.apiUrl}/my-messages/conversation/${otherUserId}`, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Envoyer un nouveau message
  sendMessage(receiverId: string, content: string): Observable<Message> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    const messageData = {
      receiver: `/api/users/${receiverId}`,
      content: content
    };
    
    return this.httpClient.post<Message>(`${this.apiUrl}/messages`, messageData, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Nombre de messages non lus
  getUnreadCount(): Observable<{unreadCount: number}> {
    if (!this.checkAuthentication()) {
      return throwError(() => new Error('Non authentifié'));
    }

    return this.httpClient.get<{unreadCount: number}>(`${this.apiUrl}/my-messages/unread-count`, {
      headers: this.userService.getAuthHeaders()
    });
  }

  // Ma gestion d'erreurs personnalisée
  // Je catégorise les erreurs pour donner des messages plus clairs à mes utilisateurs
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur réseau ou côté client (pas de connexion internet, etc.)
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      // Erreur HTTP du serveur - je personnalise selon les codes
      switch (error.status) {
        case 401:
          errorMessage = 'Non autorisé - je dois me reconnecter';
          break;
        case 403:
          errorMessage = 'Accès interdit - je n\'ai pas les droits';
          break;
        case 404:
          errorMessage = 'Messages non trouvés';
          break;
        case 500:
          errorMessage = 'Erreur serveur - problème côté Symfony';
          break;
        default:
          errorMessage = `Erreur: ${error.status} - ${error.message}`;
      }
    }

    // Je log toujours pour débugger
    console.error('❌ Erreur API Messages:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}