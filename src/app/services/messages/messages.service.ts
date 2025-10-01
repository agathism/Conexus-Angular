import { Injectable} from '@angular/core';
import Message from '../../models/message.interface';
import Conversation from '../../models/conversation.interface';
import { catchError, Observable, of, tap, throwError} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { UserService } from '../users/user-service';
import SendMessage from '../../models/sendMessage.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService{
  private readonly apiUrl = 'http://127.0.0.1:8000/api';              

  constructor(
    private httpClient: HttpClient,
    private userService: UserService  // Injection du service User
  ) {}

  // Récupère les headers avec le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.userService.getToken(); 
    
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

  // Conversation avec un utilisateur spécifique
  getConversations(): Observable<Conversation[]> {
    console.log('🔄 getConversations - Début');
    
    if (!this.checkAuthentication()) {
      console.log('❌ Échec authentification');
      return throwError(() => new Error('Non authentifié'));
    }
    
    return this.httpClient.get<Conversation[]>(`${this.apiUrl}/my-conversations`, { 
      headers: this.userService.getAuthHeaders() 
    }).pipe(
      tap(conversations => {
        console.log('💾 Conversations mises en cache:', conversations);
      }),
      catchError(error => {
        console.error('❌ Erreur dans getConversations:', error);
        return this.handleError(error);
      })
    );
  }

  // Tous les messages avec un utilisateur spécifique
  getMessages(otherUserId: number): Observable<Message[]> {
    console.log('🔄 getMessages - Début pour userId:', otherUserId);
    if (!this.checkAuthentication()) {
      console.log('❌ Échec authentification');
      return throwError(() => new Error('Non authentifié'));
    }
    console.log('🔧 URL construite:', `${this.apiUrl}/my-messages/${otherUserId}`);
    return this.httpClient.get<Message[]>(`${this.apiUrl}/my-messages/${otherUserId}`, {
      headers: this.userService.getAuthHeaders()
    }).pipe(
      tap(messages => {
        console.log('🔧 Service - Réponse reçue:', messages);
        console.log('🔧 Service - Type:', typeof messages);
        console.log('🔧 Service - IsArray:', Array.isArray(messages));
      }),
      catchError(error => {
        console.error('❌ Erreur dans getMessages:', error);
        return this.handleError(error);
      })
    );
  }

  // Envoyer un nouveau message
  sendMessage(content: string, otherUserId: number): Observable<SendMessage> {
    console.log('📤 sendMessage appelé avec:', { content, otherUserId });
    
    if (!this.checkAuthentication()) {
      console.error('❌ Échec de l\'authentification');
      return throwError(() => new Error('Non authentifié'));
    }
    console.log('✅ Authentification vérifiée');

    // Récupérer l'ID de l'utilisateur connecté
    const currentUserId = this.userService.getCurrentUserId();
    console.log('👤 ID utilisateur actuel:', currentUserId);
    
    if (!currentUserId) {
      console.error('❌ ID utilisateur introuvable');
      return throwError(() => new Error('ID utilisateur introuvable'));
    }

    const messageData = {
      content: content,
      otherUserId: otherUserId
    };

    console.log('📝 Données du message à envoyer:', messageData);

    const url = `${this.apiUrl}/send-messages/${otherUserId}`;
    console.log('🌐 URL de l\'API:', url);
    
    const headers = this.userService.getAuthHeaders();
    console.log('🔐 Headers d\'authentification:', headers);

    console.log('🚀 Envoi de la requête HTTP POST...');
    return this.httpClient.post<SendMessage>(url, messageData, {
      headers: headers
    }).pipe(
      tap({
        next: (response) => {
          console.log('✅ Message envoyé avec succès:', response);
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'envoi du message:', error);
        }
      })
    );
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